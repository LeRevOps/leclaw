export {
  runAgent,
  callClaude,
  calculateScore,
} from "./base.js";

export type {
  AgentDefinition,
  AgentCheck,
  AgentCheck as Check,
  CheckResult,
  RunOptions,
  Rapport,
  Issue,
  OrgConfig,
  WritebackPatch,
  HubSpotRecord,
  HubSpotFilterGroup,
} from "./base.js";

export { searchHubSpot } from "./hubspot-search.js";
export { applyPatch, applyBatch } from "./hubspot-write.js";
export type { WritebackResult } from "./hubspot-write.js";
export type { HubSpotFilter } from "./hubspot-search.js";

export { buildDynamicChecks, fetchCustomProperties } from "./hubspot-properties.js";

export { routeQuestion } from "./routing.js";
export { buildSynthesisPrompt, buildSynthesisPromptNoData, buildRunHistory } from "./synthesis.js";
export type { RapportSummary, SynthesisPlan, RunHistory, AgentRunHistory } from "./synthesis.js";

