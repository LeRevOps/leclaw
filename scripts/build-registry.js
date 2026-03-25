#!/usr/bin/env node
/**
 * build-registry.js
 *
 * Scans each agents/[name]/agent.json and writes registry.json.
 * Run: npm run registry
 *
 * Contributors never edit registry.json directly.
 * They own their agent.json, this script owns the index.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const agentsDir = join(root, "agents");
const registryPath = join(root, "registry.json");

// Read existing registry for _meta and any planned agents not yet in a folder
const existing = JSON.parse(readFileSync(registryPath, "utf8"));
const existingByName = Object.fromEntries(existing.agents.map((a) => [a.name, a]));

// Scan agent folders for agent.json
const contributed = [];
for (const folder of readdirSync(agentsDir, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  const manifestPath = join(agentsDir, folder.name, "agent.json");
  if (!existsSync(manifestPath)) continue;

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    contributed.push(manifest);
  } catch (err) {
    console.error(`  ✗ Failed to parse ${manifestPath}: ${err.message}`);
    process.exit(1);
  }
}

const contributedNames = new Set(contributed.map((a) => a.name));

// Merge: contributed agents (source of truth) + planned agents from existing registry
// that don't have a folder yet (roadmap stubs)
const roadmapStubs = existing.agents.filter(
  (a) => !contributedNames.has(a.name)
);

// Sort: live first, then beta, then soon, then planned — alphabetical within each group
const statusOrder = { live: 0, beta: 1, soon: 2, planned: 3 };
const all = [...contributed, ...roadmapStubs].sort((a, b) => {
  const sa = statusOrder[a.status] ?? 4;
  const sb = statusOrder[b.status] ?? 4;
  if (sa !== sb) return sa - sb;
  return a.name.localeCompare(b.name);
});

const registry = {
  _meta: {
    ...existing._meta,
    updatedAt: new Date().toISOString().split("T")[0],
    agentCount: all.length,
    liveCount: all.filter((a) => a.status === "live" || a.status === "beta").length,
  },
  agents: all,
};

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log(`✓ registry.json updated`);
console.log(`  ${contributed.length} agent(s) from folders`);
console.log(`  ${roadmapStubs.length} roadmap stub(s) from existing registry`);
console.log(`  ${all.filter((a) => a.status === "live").length} live, ${all.filter((a) => a.status === "soon").length} soon, ${all.filter((a) => a.status === "planned").length} planned`);
