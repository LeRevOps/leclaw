/**
 * LeClaw — Custom agent example
 *
 * This is the minimal template for building a new LeClaw agent.
 * Copy this file, rename the agent, define your checks, and run it.
 *
 * To run:
 *   HUBSPOT_TOKEN=xxx ANTHROPIC_API_KEY=xxx npx ts-node index.ts
 */

import { runAgent, buildDynamicChecks } from "@leclaw/core";
import type { AgentDefinition, AgentCheck } from "@leclaw/core";

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── Static checks ──────────────────────────────────────────────────────────────
// Each check defines what "broken" means for a specific CRM condition.

const checks: AgentCheck[] = [
  // ── Basic missing field check ──────────────────────────────────────────────
  {
    id: "contact_missing_phone",
    label: "Contacts missing phone number",
    objectType: "contacts",
    filterGroups: [
      { filters: [{ propertyName: "phone", operator: "NOT_HAS_PROPERTY" }] },
    ],
    properties: ["firstname", "lastname", "email", "phone"],
    severity: "warning",
    fix: "Add a phone number to this contact",
    getName: (r) =>
      [r.properties.firstname, r.properties.lastname].filter(Boolean).join(" ") ||
      r.properties.email ||
      r.id,
    writeback: {
      description: "Cannot auto-fix — phone must be sourced externally",
      requiresApproval: true,
      automated: false,
    },
  },

  // ── Relationship check (association-aware) ─────────────────────────────────
  {
    id: "deal_no_contact",
    label: "Deals with no associated contact",
    objectType: "deals",
    filterGroups: [
      { filters: [{ propertyName: "associations.contact", operator: "NOT_HAS_PROPERTY" }] },
    ],
    properties: ["dealname", "amount", "dealstage", "closedate"],
    severity: "critical",
    fix: "Associate a contact with this deal",
    getName: (r) => r.properties.dealname || r.id,
  },

  // ── Time-based check (function syntax — timestamps computed fresh each run) ─
  {
    id: "contact_inactive_90d",
    label: "Contacts with no activity in 90 days",
    objectType: "contacts",
    filterGroups: () => [
      {
        filters: [
          {
            propertyName: "notes_last_updated",
            operator: "LT",
            value: String(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ],
    properties: ["firstname", "lastname", "email", "notes_last_updated"],
    severity: "info",
    fix: "Log a note or activity for this contact",
    getName: (r) =>
      [r.properties.firstname, r.properties.lastname].filter(Boolean).join(" ") ||
      r.properties.email ||
      r.id,
  },

  // ── Escalation check (severity bumps when additional context matches) ───────
  {
    id: "deal_missing_amount",
    label: "Deals missing amount",
    objectType: "deals",
    filterGroups: [
      { filters: [{ propertyName: "amount", operator: "NOT_HAS_PROPERTY" }] },
    ],
    properties: ["dealname", "amount", "dealstage", "closedate"],
    severity: "warning",
    fix: "Add a deal value",
    getName: (r) => r.properties.dealname || r.id,
    escalateIf: {
      description: "Deal is in late stage with no amount — forecast is overstated",
      filterGroups: [
        {
          filters: [
            { propertyName: "amount", operator: "NOT_HAS_PROPERTY" },
            { propertyName: "dealstage", operator: "EQ", value: "closedwon" },
          ],
        },
      ],
      escalatedSeverity: "critical",
    },
  },
];

// ── Agent definition ───────────────────────────────────────────────────────────

const myAgent: AgentDefinition = {
  name: "le-custom-agent",
  checks,

  // Optional: auto-discover custom fields from this org's HubSpot
  discoverChecks: (token) => buildDynamicChecks(token, "contacts"),

  summaryPrompt: (results) => {
    const lines = results
      .filter((r) => r.count > 0)
      .map((r) => `- ${r.check.label}: ${r.count} records${r.escalatedCount > 0 ? ` (${r.escalatedCount} escalated)` : ""}`)
      .join("\n");

    return `You are a RevOps analyst. Summarize these CRM issues in 2-3 sentences.
Focus on business impact. Be direct. No bullet points.

Issues found:
${lines || "No issues found."}`;
  },
};

// ── Run ────────────────────────────────────────────────────────────────────────

const rapport = await runAgent(myAgent, {
  hubspotToken: HUBSPOT_TOKEN,
  anthropicKey: ANTHROPIC_KEY,
  onIssue: async (issue) => {
    // Do whatever you want with each broken record:
    // - Write to a database
    // - Post to Slack
    // - Log to a file
    // - Send an email
    console.log(`[${issue.severity}] ${issue.objectType}/${issue.objectId} — ${issue.issueType}`);
  },
});

console.log("\n── Rapport ─────────────────────────────────────────────");
console.log(`Agent:       ${rapport.agentName}`);
console.log(`Score:       ${rapport.score}/100`);
console.log(`Issues:      ${rapport.totalIssues}`);
console.log(`Summary:     ${rapport.summary}`);
console.log("\nChecks:");
for (const check of rapport.checks) {
  if (check.count > 0) {
    console.log(`  ${check.label}: ${check.count}${check.escalatedCount > 0 ? ` (${check.escalatedCount} critical)` : ""}`);
  }
}
