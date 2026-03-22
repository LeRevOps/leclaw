import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
dotenv.config();

const hubspot_token = process.env.HUBSPOT_API_TOKEN;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const slack_webhook = process.env.SLACK_WEBHOOK_URL;

// ── FETCH CONTACTS FROM HUBSPOT ──────────────────────────────────────────────
async function fetchContacts() {
  const res = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,company,jobtitle,hs_lead_status,createdate,lastmodifieddate",
    {
      headers: {
        Authorization: `Bearer ${hubspot_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.results;
}

// ── FETCH COMPANIES FROM HUBSPOT ─────────────────────────────────────────────
async function fetchCompanies() {
  const res = await fetch(
    "https://api.hubapi.com/crm/v3/objects/companies?limit=100&properties=name,domain,industry,phone,city,state,country",
    {
      headers: {
        Authorization: `Bearer ${hubspot_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.results;
}

// ── RUN QUALITY CHECKS ───────────────────────────────────────────────────────
function checkContacts(contacts) {
  const issues = [];

  for (const contact of contacts) {
    const p = contact.properties;
    const id = contact.id;
    const name = `${p.firstname || ""} ${p.lastname || ""}`.trim() || `Contact ${id}`;

    if (!p.email) {
      issues.push({ id, name, type: "missing_email", severity: "high", fix: "Add email address" });
    }

    if (!p.firstname && !p.lastname) {
      issues.push({ id, name, type: "missing_name", severity: "high", fix: "Add first and last name" });
    }

    if (!p.company) {
      issues.push({ id, name, type: "missing_company", severity: "medium", fix: "Associate with a company" });
    }

    if (!p.jobtitle) {
      issues.push({ id, name, type: "missing_title", severity: "low", fix: "Add job title" });
    }

    // Check for stale contacts (no activity in 180 days)
    if (p.lastmodifieddate) {
      const lastMod = new Date(p.lastmodifieddate);
      const daysSince = (Date.now() - lastMod) / (1000 * 60 * 60 * 24);
      if (daysSince > 180) {
        issues.push({
          id,
          name,
          type: "stale_contact",
          severity: "low",
          fix: `No activity in ${Math.round(daysSince)} days — review or archive`,
        });
      }
    }
  }

  return issues;
}

function checkCompanies(companies) {
  const issues = [];

  for (const company of companies) {
    const p = company.properties;
    const id = company.id;
    const name = p.name || `Company ${id}`;

    if (!p.domain) {
      issues.push({ id, name, type: "missing_domain", severity: "high", fix: "Add company domain" });
    }

    if (!p.industry) {
      issues.push({ id, name, type: "missing_industry", severity: "medium", fix: "Add industry" });
    }

    if (!p.phone) {
      issues.push({ id, name, type: "missing_phone", severity: "low", fix: "Add phone number" });
    }
  }

  return issues;
}

// ── DETECT DUPLICATES ────────────────────────────────────────────────────────
function findDuplicates(contacts) {
  const emailMap = {};
  const duplicates = [];

  for (const contact of contacts) {
    const email = contact.properties.email?.toLowerCase().trim();
    if (!email) continue;

    if (emailMap[email]) {
      duplicates.push({
        email,
        ids: [emailMap[email], contact.id],
        type: "duplicate_email",
        severity: "high",
        fix: `Merge or delete duplicate — same email: ${email}`,
      });
    } else {
      emailMap[email] = contact.id;
    }
  }

  return duplicates;
}

// ── ASK CLAUDE FOR A SUMMARY ─────────────────────────────────────────────────
async function generateSummary(contactIssues, companyIssues, duplicates, totalContacts, totalCompanies) {
  const allIssues = [...contactIssues, ...companyIssues, ...duplicates];
  const highCount = allIssues.filter((i) => i.severity === "high").length;
  const medCount = allIssues.filter((i) => i.severity === "medium").length;
  const lowCount = allIssues.filter((i) => i.severity === "low").length;

  const prompt = `You are Le Data Quality, an agent inside LeClaw — a RevOps automation framework.

You just scanned a HubSpot CRM instance. Here are the results:

Total contacts scanned: ${totalContacts}
Total companies scanned: ${totalCompanies}
High severity issues: ${highCount}
Medium severity issues: ${medCount}
Low severity issues: ${lowCount}
Duplicate contacts found: ${duplicates.length}

Top issues found:
${allIssues
  .slice(0, 10)
  .map((i) => `- [${i.severity.toUpperCase()}] ${i.name}: ${i.fix}`)
  .join("\n")}

Write a concise RevOps-style executive summary (5-7 sentences) of the CRM health.
Be direct, use specific numbers, and prioritize what needs fixing first.
End with one clear recommended first action.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text;
}

// ── POST TO SLACK ─────────────────────────────────────────────────────────────
async function postToSlack(allIssues, summary, totalContacts, totalCompanies) {
  if (!slack_webhook) return;

  const high   = allIssues.filter((i) => i.severity === "high");
  const medium = allIssues.filter((i) => i.severity === "medium");
  const low    = allIssues.filter((i) => i.severity === "low");

  const score = Math.max(0, 100 - high.length * 10 - medium.length * 5 - low.length * 2);
  const scoreEmoji = score >= 80 ? "🟢" : score >= 60 ? "🟡" : "🔴";

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "🦀 LeClaw — CRM Health Report" },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*CRM Health Score*\n${scoreEmoji} ${score}/100` },
        { type: "mrkdwn", text: `*Records Scanned*\n${totalContacts} contacts · ${totalCompanies} companies` },
      ],
    },
    { type: "divider" },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*🔴 High*\n${high.length} issues` },
        { type: "mrkdwn", text: `*🟡 Medium*\n${medium.length} issues` },
        { type: "mrkdwn", text: `*🟢 Low*\n${low.length} issues` },
        { type: "mrkdwn", text: `*Total*\n${allIssues.length} issues` },
      ],
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*📊 AI Summary*\n${summary}` },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: `Shadow mode: ON · No changes written to HubSpot · ${new Date().toLocaleDateString()}` },
      ],
    },
  ];

  await fetch(slack_webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log("\n🦀 LeClaw — Le Data Quality Agent");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Connecting to HubSpot...");

  const [contacts, companies] = await Promise.all([fetchContacts(), fetchCompanies()]);

  console.log(`✓ Found ${contacts.length} contacts, ${companies.length} companies\n`);
  console.log("Running quality checks...\n");

  const contactIssues = checkContacts(contacts);
  const companyIssues = checkCompanies(companies);
  const duplicates = findDuplicates(contacts);

  const allIssues = [...contactIssues, ...companyIssues, ...duplicates];

  // Print issues by severity
  const high = allIssues.filter((i) => i.severity === "high");
  const medium = allIssues.filter((i) => i.severity === "medium");
  const low = allIssues.filter((i) => i.severity === "low");

  if (high.length) {
    console.log(`🔴 HIGH SEVERITY (${high.length})`);
    high.forEach((i) => console.log(`   ${i.name} — ${i.fix}`));
    console.log();
  }

  if (medium.length) {
    console.log(`🟡 MEDIUM SEVERITY (${medium.length})`);
    medium.forEach((i) => console.log(`   ${i.name} — ${i.fix}`));
    console.log();
  }

  if (low.length) {
    console.log(`🟢 LOW SEVERITY (${low.length})`);
    low.forEach((i) => console.log(`   ${i.name} — ${i.fix}`));
    console.log();
  }

  if (allIssues.length === 0) {
    console.log("✅ No issues found. Your CRM is clean.\n");
  }

  // Claude summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 AI SUMMARY\n");
  const summary = await generateSummary(contactIssues, companyIssues, duplicates, contacts.length, companies.length);
  console.log(summary);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`\nTotal issues found: ${allIssues.length}`);
  console.log("Shadow mode: ON — no changes written to HubSpot\n");

  // Post to Slack
  if (slack_webhook) {
    await postToSlack(allIssues, summary, contacts.length, companies.length);
    console.log("✓ Report posted to Slack\n");
  }
}

run().catch((err) => {
  console.error("Agent error:", err.message);
  process.exit(1);
});
