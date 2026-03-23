#!/usr/bin/env node
/**
 * LeClaw Setup
 * Interactive setup wizard — creates your .env file in under 2 minutes.
 * Run: npm run setup
 */

import readline from "readline";
import fs from "fs";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const askSecret = (question) =>
  new Promise((resolve) => {
    process.stdout.write(question);
    let value = "";

    const onData = (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        process.stdin.removeListener("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(value.trim());
      } else if (char === "\u0003") {
        process.exit();
      } else if (char === "\u007f") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(question + "*".repeat(value.length));
        }
      } else {
        value += char;
        process.stdout.write("*");
      }
    };

    // Fall back to plain input if TTY not available (CI, piped input)
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", onData);
    } else {
      rl.question(question, resolve);
    }
  });

const dim   = (s) => `\x1b[2m${s}\x1b[0m`;
const bold  = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red   = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan  = (s) => `\x1b[36m${s}\x1b[0m`;

async function testHubSpot(token) {
  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, count: data.total };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testAnthropic(key) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [{ role: "user", content: "hi" }],
      }),
    });
    return { ok: res.ok };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testSlack(webhook) {
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "🦀 LeClaw connected successfully." }),
    });
    return { ok: res.ok };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log("\n" + cyan("🦀 LeClaw Setup"));
  console.log(dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(dim("This will create your .env file and verify each connection.\n"));

  const env = {};

  // ── CRM ─────────────────────────────────────────────────────────────────────
  console.log(bold("Step 1: Connect your CRM\n"));

  const crmChoice = await ask("Which CRM are you using?\n  1) HubSpot\n  2) Salesforce\n\nEnter 1 or 2: ");

  if (crmChoice.trim() === "1") {
    console.log(dim("\nCreate a private app at: app.hubspot.com → Settings → Integrations → Private Apps"));
    console.log(dim("Required scopes: crm.objects.contacts.read, crm.objects.companies.read\n"));

    const token = await askSecret("Paste your HubSpot API token: ");
    process.stdout.write("  Verifying... ");

    const result = await testHubSpot(token.trim());
    if (result.ok) {
      console.log(green(`✓ Connected — ${result.count?.toLocaleString() ?? "?"} contacts found`));
      env.HUBSPOT_API_TOKEN = token.trim();
    } else {
      console.log(red(`✗ Failed — ${result.error}`));
      console.log(dim("  Check your token and try again. Setup will continue but HubSpot won't work.\n"));
    }

  } else if (crmChoice.trim() === "2") {
    console.log(dim("\nYou'll need an OAuth2 access token from your Salesforce connected app."));
    console.log(dim("See: docs/salesforce-setup.md for instructions.\n"));

    const token       = await askSecret("Paste your Salesforce access token: ");
    const instanceUrl = await ask("Paste your Salesforce instance URL (e.g. https://yourorg.salesforce.com): ");

    env.SALESFORCE_ACCESS_TOKEN  = token.trim();
    env.SALESFORCE_INSTANCE_URL  = instanceUrl.trim();
    console.log(green("✓ Salesforce credentials saved"));
  }

  console.log();

  // ── ANTHROPIC ────────────────────────────────────────────────────────────────
  console.log(bold("Step 2: Connect AI (Anthropic)\n"));
  console.log(dim("Get your key at: console.anthropic.com\n"));

  const anthropicKey = await askSecret("Paste your Anthropic API key: ");
  process.stdout.write("  Verifying... ");

  const aiResult = await testAnthropic(anthropicKey.trim());
  if (aiResult.ok) {
    console.log(green("✓ Connected"));
    env.ANTHROPIC_API_KEY = anthropicKey.trim();
  } else {
    console.log(red("✗ Failed — check your key"));
    env.ANTHROPIC_API_KEY = anthropicKey.trim();
  }

  console.log();

  // ── SLACK ────────────────────────────────────────────────────────────────────
  console.log(bold("Step 3: Connect Slack (optional)\n"));
  console.log(dim("Create a webhook at: api.slack.com/apps → Incoming Webhooks\n"));

  const slackAnswer = await ask("Do you want Slack reports? (y/n): ");

  if (slackAnswer.trim().toLowerCase() === "y") {
    const webhook = await askSecret("Paste your Slack webhook URL: ");
    process.stdout.write("  Sending test message... ");

    const slackResult = await testSlack(webhook.trim());
    if (slackResult.ok) {
      console.log(green("✓ Test message sent — check your Slack channel"));
      env.SLACK_WEBHOOK_URL = webhook.trim();
    } else {
      console.log(red("✗ Failed — check your webhook URL"));
    }
  } else {
    console.log(dim("  Skipped — you can add SLACK_WEBHOOK_URL to .env later"));
  }

  console.log();

  // ── WRITE .ENV ───────────────────────────────────────────────────────────────
  const envPath = path.join(process.cwd(), ".env");
  const envContent = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n";

  const exists = fs.existsSync(envPath);
  if (exists) {
    const overwrite = await ask(".env already exists. Overwrite? (y/n): ");
    if (overwrite.trim().toLowerCase() !== "y") {
      console.log(dim("\nSetup cancelled — existing .env kept.\n"));
      rl.close();
      return;
    }
  }

  fs.writeFileSync(envPath, envContent);

  // ── DONE ─────────────────────────────────────────────────────────────────────
  console.log(dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(green("✓ Setup complete — .env created\n"));
  console.log("Run your first agent:");
  console.log(cyan("\n  npm run data-quality\n"));

  rl.close();
}

main().catch((err) => {
  console.error(red("\nSetup error: " + err.message));
  rl.close();
  process.exit(1);
});
