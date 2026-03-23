/**
 * LeClaw — Le Data Quality Agent
 * Scans CRM for missing fields, duplicates, and stale records.
 * Supports HubSpot and Salesforce.
 * Shadow mode by default — no writes to CRM.
 *
 * Usage:
 *   npm run data-quality              (auto-detects CRM from .env)
 *   npm run data-quality -- --crm hubspot
 *   npm run data-quality -- --crm salesforce
 */

import * as dotenv from "dotenv";
import { getContacts as hsGetContacts, getCompanies as hsGetCompanies } from "../../core/hubspot.js";
import { getContacts as sfGetContacts, getAccounts as sfGetAccounts } from "../../core/salesforce.js";
import { postReport } from "../../core/slack.js";
import { summarize } from "../../core/ai.js";

dotenv.config();

const CRM = process.argv.includes("--crm")
  ? process.argv[process.argv.indexOf("--crm") + 1]
  : process.env.HUBSPOT_API_TOKEN ? "hubspot" : "salesforce";

// ── NORMALIZE RECORDS ─────────────────────────────────────────────────────────
// Normalize CRM-specific shapes into a common format for shared check logic

function normalizeHubSpotContacts(records) {
  return records.map((r) => ({
    id: r.id,
    name: `${r.properties.firstname || ""} ${r.properties.lastname || ""}`.trim() || `Contact ${r.id}`,
    email: r.properties.email,
    phone: r.properties.phone,
    company: r.properties.company,
    title: r.properties.jobtitle,
    lastModified: r.properties.lastmodifieddate,
  }));
}

function normalizeHubSpotCompanies(records) {
  return records.map((r) => ({
    id: r.id,
    name: r.properties.name || `Company ${r.id}`,
    domain: r.properties.domain,
    industry: r.properties.industry,
    phone: r.properties.phone,
  }));
}

function normalizeSalesforceContacts(records) {
  return records.map((r) => ({
    id: r.Id,
    name: `${r.FirstName || ""} ${r.LastName || ""}`.trim() || `Contact ${r.Id}`,
    email: r.Email,
    phone: r.Phone,
    company: r.AccountId,
    title: r.Title,
    lastModified: r.LastModifiedDate,
  }));
}

function normalizeSalesforceAccounts(records) {
  return records.map((r) => ({
    id: r.Id,
    name: r.Name || `Account ${r.Id}`,
    domain: r.Website,
    industry: r.Industry,
    phone: r.Phone,
  }));
}

// ── QUALITY CHECKS ────────────────────────────────────────────────────────────

function checkContacts(contacts) {
  const issues = [];

  for (const c of contacts) {
    if (!c.email) {
      issues.push({ id: c.id, name: c.name, severity: "high", type: "missing_email", fix: "Add email address" });
    }
    if (!c.name || c.name.trim() === "") {
      issues.push({ id: c.id, name: c.name, severity: "high", type: "missing_name", fix: "Add first and last name" });
    }
    if (!c.company) {
      issues.push({ id: c.id, name: c.name, severity: "medium", type: "missing_company", fix: "Associate with a company or account" });
    }
    if (!c.title) {
      issues.push({ id: c.id, name: c.name, severity: "low", type: "missing_title", fix: "Add job title" });
    }
    if (c.lastModified) {
      const daysSince = (Date.now() - new Date(c.lastModified)) / (1000 * 60 * 60 * 24);
      if (daysSince > 180) {
        issues.push({
          id: c.id, name: c.name, severity: "low",
          type: "stale_contact",
          fix: `No activity in ${Math.round(daysSince)} days — review or archive`,
        });
      }
    }
  }

  return issues;
}

function checkCompanies(companies) {
  const issues = [];

  for (const co of companies) {
    if (!co.domain) {
      issues.push({ id: co.id, name: co.name, severity: "high", type: "missing_domain", fix: "Add company domain or website" });
    }
    if (!co.industry) {
      issues.push({ id: co.id, name: co.name, severity: "medium", type: "missing_industry", fix: "Add industry" });
    }
    if (!co.phone) {
      issues.push({ id: co.id, name: co.name, severity: "low", type: "missing_phone", fix: "Add phone number" });
    }
  }

  return issues;
}

function findDuplicates(contacts) {
  const emailMap = {};
  const duplicates = [];

  for (const c of contacts) {
    const email = c.email?.toLowerCase().trim();
    if (!email) continue;
    if (emailMap[email]) {
      duplicates.push({
        id: c.id, name: c.name, severity: "high",
        type: "duplicate_email",
        fix: `Merge or delete — duplicate email: ${email}`,
      });
    } else {
      emailMap[email] = c.id;
    }
  }

  return duplicates;
}

// ── AI SUMMARY ────────────────────────────────────────────────────────────────

async function generateSummary(allIssues, totalContacts, totalCompanies, crm) {
  const high   = allIssues.filter((i) => i.severity === "high").length;
  const medium = allIssues.filter((i) => i.severity === "medium").length;
  const low    = allIssues.filter((i) => i.severity === "low").length;

  return summarize(`You are Le Data Quality, a RevOps agent inside LeClaw.

You just scanned a ${crm.toUpperCase()} CRM instance. Results:
- Total contacts: ${totalContacts}
- Total companies/accounts: ${totalCompanies}
- High severity issues: ${high}
- Medium severity issues: ${medium}
- Low severity issues: ${low}
- Duplicates: ${allIssues.filter((i) => i.type === "duplicate_email").length}

Top issues:
${allIssues.slice(0, 10).map((i) => `- [${i.severity.toUpperCase()}] ${i.name}: ${i.fix}`).join("\n")}

Write a concise RevOps executive summary (4-6 sentences). Be direct, use numbers, prioritize what to fix first. End with one clear recommended first action.`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n🦀 LeClaw — Le Data Quality Agent");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`CRM: ${CRM.toUpperCase()}`);
  console.log("Connecting...\n");

  let contacts = [];
  let companies = [];

  if (CRM === "hubspot") {
    const token = process.env.HUBSPOT_API_TOKEN;
    if (!token) throw new Error("HUBSPOT_API_TOKEN not set in .env");
    const [raw_contacts, raw_companies] = await Promise.all([
      hsGetContacts(token),
      hsGetCompanies(token),
    ]);
    contacts  = normalizeHubSpotContacts(raw_contacts);
    companies = normalizeHubSpotCompanies(raw_companies);

  } else if (CRM === "salesforce") {
    const token       = process.env.SALESFORCE_ACCESS_TOKEN;
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    if (!token || !instanceUrl) throw new Error("SALESFORCE_ACCESS_TOKEN and SALESFORCE_INSTANCE_URL required in .env");
    const [raw_contacts, raw_accounts] = await Promise.all([
      sfGetContacts(token, instanceUrl),
      sfGetAccounts(token, instanceUrl),
    ]);
    contacts  = normalizeSalesforceContacts(raw_contacts);
    companies = normalizeSalesforceAccounts(raw_accounts);

  } else {
    throw new Error(`Unknown CRM: ${CRM}. Use --crm hubspot or --crm salesforce`);
  }

  console.log(`✓ Found ${contacts.length} contacts, ${companies.length} companies/accounts\n`);
  console.log("Running quality checks...\n");

  const contactIssues = checkContacts(contacts);
  const companyIssues = checkCompanies(companies);
  const duplicates    = findDuplicates(contacts);
  const allIssues     = [...contactIssues, ...companyIssues, ...duplicates];

  const high   = allIssues.filter((i) => i.severity === "high");
  const medium = allIssues.filter((i) => i.severity === "medium");
  const low    = allIssues.filter((i) => i.severity === "low");

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

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 AI SUMMARY\n");
  const summary = await generateSummary(allIssues, contacts.length, companies.length, CRM);
  console.log(summary);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`\nTotal issues: ${allIssues.length}`);
  console.log("Shadow mode: ON — no changes written to CRM\n");

  const score      = Math.max(0, 100 - high.length * 10 - medium.length * 5 - low.length * 2);
  const scoreEmoji = score >= 80 ? "🟢" : score >= 60 ? "🟡" : "🔴";

  await postReport({
    webhook:    process.env.SLACK_WEBHOOK_URL,
    agentName:  "Le Data Quality",
    score,
    scoreEmoji,
    fields: [
      { type: "mrkdwn", text: `*Records Scanned*\n${contacts.length} contacts · ${companies.length} companies` },
      { type: "mrkdwn", text: `*🔴 High*\n${high.length} issues` },
      { type: "mrkdwn", text: `*🟡 Medium*\n${medium.length} issues` },
      { type: "mrkdwn", text: `*🟢 Low*\n${low.length} issues` },
    ],
    summary,
    mode: "shadow",
  });

  if (process.env.SLACK_WEBHOOK_URL) {
    console.log("✓ Report posted to Slack\n");
  }
}

run().catch((err) => {
  console.error("Agent error:", err.message);
  process.exit(1);
});
