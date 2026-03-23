/**
 * LeClaw — AI Layer
 * Handles all Claude API calls for agents.
 * Routes to cheapest model that can handle the task.
 */

import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Cascade: use Haiku for summaries, Sonnet for complex reasoning
export async function summarize(prompt, complexity = "low") {
  const model = complexity === "high"
    ? "claude-sonnet-4-6"
    : "claude-haiku-4-5-20251001";

  const message = await getClient().messages.create({
    model,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text;
}

export async function analyze(prompt) {
  const message = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text;
}
