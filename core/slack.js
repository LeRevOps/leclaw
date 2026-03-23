/**
 * LeClaw — Slack Delivery Adapter
 * Handles all Slack message formatting and delivery for agents.
 */

export async function postReport({ webhook, agentName, score, scoreEmoji, fields, summary, mode = "shadow" }) {
  if (!webhook) return;

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `🦀 LeClaw — ${agentName}` },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Health Score*\n${scoreEmoji} ${score}/100` },
        ...fields,
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
        {
          type: "mrkdwn",
          text: `${mode === "shadow" ? "Shadow mode: ON · No changes written to CRM" : "Write-back: ON · Changes applied"} · ${new Date().toLocaleDateString()}`,
        },
      ],
    },
  ];

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    throw new Error(`Slack delivery error: ${res.status}`);
  }
}

export async function postAlert({ webhook, title, message, severity = "info" }) {
  if (!webhook) return;

  const emoji = { info: "ℹ️", warning: "⚠️", critical: "🔴" }[severity] || "ℹ️";

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `${emoji} *${title}*\n${message}`,
    }),
  });
}
