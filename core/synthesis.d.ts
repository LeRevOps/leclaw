/**
 * @leclaw/core — Synthesis
 *
 * Builds prompts for Le Directeur's final synthesis.
 * Sonnet is only called once per question, after all agents have filed rapports.
 */
export interface RapportSummary {
    agentName: string;
    score: number;
    totalIssues: number;
    summary: string;
    topChecks: Array<{
        label: string;
        count: number;
        severity: string;
    }>;
}
export interface SynthesisPlan {
    intent: string;
    areasToInspect: string[];
    successCriteria: string;
}
export interface AgentRunHistory {
    agentName: string;
    /** Last up to 5 completed runs, oldest first */
    runs: Array<{
        score: number;
        date: string;
    }>;
    trend: "improving" | "declining" | "stable" | "new";
}
export type RunHistory = AgentRunHistory[];
/** Build RunHistory from raw Supabase rows, grouped by agent */
export declare function buildRunHistory(rows: Array<{
    agent_name: string;
    score: number;
    created_at: string;
}>, 
/** Exclude these run IDs (the current run) — pass agent names instead */
excludeAgentNames?: Set<string>): RunHistory;
export declare function buildSynthesisPrompt(question: string, rapports: RapportSummary[], plan?: SynthesisPlan, history?: RunHistory): string;
export declare function buildSynthesisPromptNoData(question: string): string;
