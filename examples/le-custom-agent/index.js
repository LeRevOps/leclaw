/**
 * LeClaw — Custom Agent Example
 *
 * The minimal template for building a new LeClaw agent.
 * Copy this file, rename it, define your checks, and run it.
 *
 * This example checks for contacts missing a phone number.
 * Replace the checks array with whatever your CRM needs.
 */

import * as dotenv from "dotenv";
import { runAgent } from "../../lib/base.js";

dotenv.config();

// ── Define your agent ─────────────────────────────────────────────────────────

const leCustomAgent = {
  name: "le-custom-agent",

  checks: [
    {
      id: "missing_phone",
      label: "Contacts missing phone number",
      objectType: "contacts",

      // HubSpot search filters — only broken records are fetched.
      // NOT_HAS_PROPERTY means this field is null or empty.
      filterGroups: [
        { filters: [{ propertyName: "phone", operator: "NOT_HAS_PROPERTY" }] }
      ],

      // Which HubSpot properties to return on each matching record
      properties: ["firstname", "lastname", "email", "phone"],

      // How bad is this problem?
      severity: "warning", // "critical" | "warning" | "info"

      // What should the user do to fix it?
      fix: "Add phone number — required for outbound sequencing",

      // How to extract a display name from the record
      getName: (r) =>
        [r.properties.firstname, r.properties.lastname].filter(Boolean).join(" ") ||
        r.properties.email ||
        r.id,
    },

    // Add more checks here. Each check is an independent HubSpot search.
    // Examples:
    //
    // Time-based check (function keeps timestamp fresh each run):
    // {
    //   id: "deal_stuck",
    //   label: "Deals stuck in stage 30+ days",
    //   objectType: "deals",
    //   filterGroups: () => [{
    //     filters: [{
    //       propertyName: "hs_lastmodifieddate",
    //       operator: "LT",
    //       value: String(Date.now() - 30 * 24 * 60 * 60 * 1000)
    //     }]
    //   }],
    //   properties: ["dealname", "dealstage"],
    //   severity: "warning",
    //   fix: "Review deal — no activity in 30+ days",
    //   getName: (r) => r.properties.dealname || r.id,
    // },
    //
    // Relationship check:
    // {
    //   id: "no_company",
    //   label: "Contacts not associated with a company",
    //   objectType: "contacts",
    //   filterGroups: [{ filters: [{ propertyName: "associations.company", operator: "NOT_HAS_PROPERTY" }] }],
    //   properties: ["firstname", "lastname", "email"],
    //   severity: "warning",
    //   fix: "Associate with a company record",
    //   getName: (r) => r.properties.email || r.id,
    // },
  ],

  // Claude only sees counts and labels — never raw records
  summaryPrompt: (results) => {
    const lines = results
      .filter((r) => r.count > 0)
      .map((r) => `- ${r.check.label}: ${r.count} records`)
      .join("\n");
    const total = results.reduce((sum, r) => sum + r.count, 0);

    return `You are a RevOps analyst. Summarize this CRM audit in 2 sentences. Be direct and actionable.

Issues found:
${lines || "No issues found."}
Total: ${total}

Write the summary:`;
  },
};

// ── Run ───────────────────────────────────────────────────────────────────────

runAgent(leCustomAgent, {
  token: process.env.HUBSPOT_API_TOKEN,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  slackWebhook: process.env.SLACK_WEBHOOK_URL,
});
