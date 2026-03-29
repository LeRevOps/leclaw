# RevTown — Claude Code Context File

Read this at the start of every session. This is the single source of truth for where the project stands and how we communicate.

---

## What RevTown Is

**RevTown is an open-source community of AI agents purpose-built for Revenue Operations.**

Each agent is a citizen of RevTown — a specialist with deep domain expertise in one specific RevOps workflow. RevTown is not a platform. It's not a SaaS product. It's a place. A place with hustle and bustle, where real RevOps problems get solved by agents custom-built for the domain.

**One-liner:** RevTown is a growing town of AI agents that automate RevOps.

**The moat is not the framework. It's the encoded domain knowledge in the citizens.** Every contributed citizen encodes what "broken" looks like in a specific RevOps workflow. A BDR manager who contributes Le BDR adds institutional knowledge that runs in hundreds of CRMs. That knowledge compounds. The framework is MIT — anyone can take it. The encoded expertise is what builds the town.

The town has two citizens today. The population is growing.

```
Le Data Quality   ✅  Checks your HubSpot contacts for missing fields and duplicates
Le Stage Audit    ✅  Flags every deal with stage-skip violations and velocity problems
Le Témoin         ✅  Queues and applies write-backs (app layer only)
Le BDR            🔜  Follow-up SLA, unworked MQLs, bounce hygiene
Le Forecast       🔜  Commit accuracy, coverage ratio, at-risk deals
Le Plumber        📋  Routing gaps, unassigned leads, round robin health
Le Renewal        📋  Renewal risk, upcoming dates, health signals
Le Territory      📋  Coverage gaps, alignment, rep assignment
Le Commission     📋  Accuracy, dispute prevention, quota hygiene
Le QBR            📋  Automated QBR prep, trend analysis
Le Duplicates     📋  Identity resolution, merge candidates
Le Activities     📋  Meeting/call logging gaps, engagement hygiene
Le Deal Desk      📋  Discount hygiene, deal structure, approvals
```

**12 citizens = a full RevOps team. That is the goal.**

Every feature decision, every architecture choice, every session should move toward this. If it doesn't add citizens, enable the community to add citizens, or make Le Directeur smarter — deprioritize it.

**Live at:** https://revtown.io
**Dashboard:** https://app.revtown.io (leclaw-app repo)
**npm:** `@revtown/core` — see `package.json` for current version
**GitHub:** https://github.com/LeRevOps/leclaw
**Stack:** Node.js, TypeScript, Claude API, HubSpot API, Salesforce API, Slack API, Vercel, Supabase

---

## Brand Voice — How Claude Must Write and Speak

This section governs all content Claude generates for RevTown: copy, README sections, agent introductions, LinkedIn posts, website content, error states, and any user-facing strings. Read it before writing anything.

### The Voice

RevTown sounds like a friendly, slightly irreverent RevOps practitioner who actually does this work. Not a vendor. Not a thought leader. Not a developer advocate performing enthusiasm. Someone who has sat in the Salesforce trenches of manual work, dealt with broken lead routing, manually reconciled ARR in a spreadsheet, and decided to build agents to never do it again.

**Core voice traits:**

- **Practitioner-first.** Speak RevOps natively. Say "deal desk" not "transaction management." Say "territory carve" not "sales region assignment." If a RevOps manager wouldn't say it in a Slack message to their team, don't say it in copy.
- **Warm but not cute.** The town metaphor is charming, not precious. Agents are friendly because they solve real problems — not because they have cartoon avatars.
- **Confident but honest.** Know what the agents do well. Know they're early. Never oversell. "Le Data Quality checks your HubSpot contacts for missing fields and duplicates" — not "Le Data Quality revolutionizes your data hygiene strategy with AI-powered intelligence."
- **Builder energy.** RevTown is being built in public by a real person. The voice should feel like someone showing you around a town they're actively constructing — proud of what's here, honest about what's still scaffolding, excited about what's coming.

### The Town Metaphor — Rules

The town metaphor is not decoration. It is the product. Use it consistently.

| Real concept | RevTown language | Never say |
|---|---|---|
| AI agent | Citizen, resident, neighbor | Bot, tool, automation, workflow |
| Total live agents | Population | Agent count, number of agents |
| User | Mayor | User, customer, client |
| Le Directeur (orchestrator) | The Mayor's right hand, town coordinator | Orchestration layer, router, dispatcher |
| New agent shipped | New citizen moves to town | New feature, new release, new agent deployed |
| Agent's prompt/logic | Their expertise, what they know | System prompt, instructions, config |
| README | Welcome sign | Documentation |
| Contributors | Town builders | Contributors (ok in GitHub context only) |

**Where to use the metaphor:** Marketing copy, agent introductions, README sections, LinkedIn posts, website content, casual documentation.

**Where NOT to use it:** API documentation, TypeScript interfaces, npm package descriptions, error messages, CLI output, technical architecture docs. A developer reading a stack trace does not need to know they're in Pipeline Plaza. Technical contexts should be clean and precise.

### Tone by Context

| Context | Tone | Example |
|---|---|---|
| LinkedIn posts | Energetic, conversational, hook-driven | "RevTown just got a new citizen. Meet Le Deal Desk — she checks every open deal for missing fields so you don't have to." |
| Website / landing page | Confident, welcoming, clear | "Your keys. Your town. You're the Mayor of RevTown — and every mayor needs a right hand." |
| README | Direct, developer-friendly, minimal fluff | "RevTown agents run on your CLI or plug into your Claude Projects. Pick a citizen, connect your CRM, get a report." |
| Agent introductions | Personality-forward, brief | "Le Stage Audit doesn't trust your pipeline stages. Neither should you." |
| Technical docs | Clean, precise, zero metaphor | "Each agent implements the RevTownAgent interface and returns an AgentReport object." |
| Error / empty states | Helpful, light | "No agents running yet. Your town is quiet — pick a citizen to get started." |

### Words We Use

- "Automate the tedious" — core promise
- "Built for RevOps" — domain specificity is the edge
- "Your keys, your town" — user ownership, privacy, open source
- "Population: [n]" — every time we reference how many agents exist
- "Meet [agent name]" — every agent introduction starts this way
- "Run it in 2 minutes" — speed to value is sacred
- Names: Le Directeur, Le Data Quality, Le Stage Audit, Le Deal Desk, Le BDR — the "Le" prefix is part of the world

### Words We Never Use

- "AI-powered" as a selling point — everything is AI-powered now, it means nothing
- "Revolutionize" / "Transform" / "Reimagine" — vendor language
- "Cutting-edge" / "State-of-the-art" / "Next-generation" — empty superlatives
- "Leverage" — always replace with "use"
- "Solution" as a noun — we build agents, not solutions
- "Unlock" / "Supercharge" / "Turbocharge" — hype words with no substance
- "Empower" — we automate tasks; practitioners were already capable
- "Seamless" / "Frictionless" — nothing is seamless; be honest about tradeoffs
- "Enterprise-grade" — we're open source and early; own that

### Content Hierarchy

When writing any piece of RevTown content, lead in this order:

1. **What problem does this solve?** Always lead with the pain point.
2. **What does the agent actually do?** Specific, concrete, verifiable.
3. **How do I try it right now?** Command, link, or copy-paste — under 2 minutes.
4. **Why is this built this way?** Architecture, philosophy — only if the audience cares.

Never lead with technology. Never lead with architecture. Never lead with the founder story. Lead with the problem, always.

### The RevTown Test

Before publishing any content, check:
- Would a RevOps manager at a 200-person SaaS company understand this in 10 seconds?
- Does it sound like a practitioner wrote it, or like a marketing team wrote it?
- Is the town metaphor adding warmth or adding confusion? (If confusion, strip it.)
- Can someone go from reading this to running an agent in under 2 minutes?
- Did we say "population" instead of "agent count"?

If any answer is no, revise.

---

## The Three Paths

Every piece of RevTown marketing should make clear there are three ways to get started. Always present them in this order:

1. **Copy into Claude Projects** — Lowest friction. Each citizen's Claude Projects prompt lives at `/agents/[citizen-name]/PROMPT.md`. Copy it, paste it into your Claude Project, talk to the citizen. No install, no API keys, no CLI. This is the front door to RevTown.
2. **Hook up your CRM** — Highest value. Connect HubSpot or Salesforce, run agents against your real data, get reports delivered to Slack. This is where RevTown becomes indispensable.
3. **Fork it** — Developer path. Clone the repo, customize citizens, build your own. This is how GTM engineers make RevTown theirs.

The framing: "Any path makes you a new resident."

---

## Agent Introduction Template

Every new citizen gets introduced the same way. Use this formula exactly.

```
Meet Le [Domain Specialty].
[One-liner — what they do, said plainly, with personality.]

[The problem: one sentence from the practitioner's POV.]
[The fix: what the agent actually checks/does. Specific. No hand-waving.]

npx revtown-[agent-name] --hubspot-token=xxx
```

**Example:**

> Meet Le Deal Desk. She reviews every open opportunity for missing fields, broken approval workflows, and pricing exceptions that slipped through.
>
> `npx revtown-deal-desk --hubspot-token=xxx`

**Community attribution:** Contributors are named in the citizen's introduction — "Meet Le BDR — built by [name], BDR Manager at [company]." Attribution is the incentive. A contributed citizen is a running tool in your own CRM and a portfolio piece.

---

## Agent Report Format

Every citizen returns an `AgentReport`. This is the output. Define it, respect it, never deviate from it.

```typescript
interface AgentReport {
  score: number;          // 0–100. Lower is worse.
  issues: AgentIssue[];   // Flagged records
  summary: string;        // 2–3 sentences, plain English. Le Directeur uses this for synthesis.
}

interface AgentIssue {
  id: string;             // CRM record ID
  name: string;           // Human-readable record name
  reason: string;         // Why it was flagged — one sentence, practitioner language
  severity: 'high' | 'medium' | 'low';
}
```

**CLI rendering:** `summary` + top 5 issues by severity.
**Slack delivery:** `summary` as header, `issues[]` as a bulleted list — record name + reason.
**Le Directeur synthesis:** reads `summary` from each citizen, synthesizes across all of them into one answer.

**Shadow mode (free tier):** Citizens analyze and return an `AgentReport` in full. `applyPatch()` and `applyBatch()` throw in shadow mode — no writes to the CRM. Write-back (Le Témoin) requires Growth tier or above. Shadow mode is the safe default for users who don't trust the tool yet.

---

## Two Repos — Two Surfaces, One Framework

| Repo | Path | Purpose | Users |
|------|------|---------|-------|
| `leclaw` | `C:\Users\Benjamin\leclaw` | Open source framework + CLI (`@revtown/core` on npm) | GTM engineers, developers, town builders |
| `leclaw-app` | `C:\Users\Benjamin\leclaw-app` | Hosted SaaS dashboard (app.revtown.io) — Next.js + Supabase | RevOps analysts, managers, non-technical users |

**This CLAUDE.md is for the `leclaw` repo (open source framework).**
The `leclaw-app` repo has its own CLAUDE.md.

The same `@revtown/core` framework powers both. The split is intentional — open core, same as Supabase, PostHog, Metabase.

- **`leclaw` (public, MIT)** — anyone can clone, fork, run citizens against their own CRM, contribute new agents.
- **`leclaw-app` (private)** — the hosted product. Supabase auth, billing, multi-tenancy, dashboard UI, Le Témoin write-back queue. Contains secrets and business logic. Never public.

**Version compatibility:** `leclaw-app` must pin a specific `@revtown/core` version in its `package.json`. Never auto-update. After publishing a new core version, manually audit `runner.ts` and synthesis imports in the app before bumping.

### Execution Architecture

```
CLI (open source)                              DASHBOARD (hosted)
─────────────────────────────────              ────────────────────────────────────────
npx revtown                                     app.revtown.io
  └── Le Directeur REPL                          └── Ask Le Directeur
        └── routeQuestion()                            └── Next.js API route (Vercel)
        └── Docker available?                                └── runAgentForOrg()
              YES → runAgentInDocker()                             └── runAgent() ← @revtown/core
                     └── docker run --rm                                └── HubSpot / SFDC API
                           └── agent-runner.js                    └── onIssue() → Supabase
                                 └── runAgent() ← @revtown/core    └── Slack delivery
              NO  → runAgent() ← @revtown/core                     └── Le Témoin write-back queue

Le Directeur synthesis — IDENTICAL on both surfaces:
  Haiku per agent (summary) → Sonnet once (synthesis) → answer
```

**Le Directeur is CRM-agnostic.** Dispatches agents, collects reports, synthesizes. Whether the underlying citizen talks to HubSpot or Salesforce is an implementation detail Le Directeur doesn't care about.

**Docker is CLI-only.** Vercel serverless cannot run containers. Dashboard users only run RevTown's vetted citizens — Vercel's ephemeral isolation is sufficient. Docker matters for developers running custom/third-party agents. Resource-limited to 512MB RAM, 0.5 CPU, removed on exit.

**Docker fallback security:** The in-process fallback is safe for RevTown's vetted citizens only. Custom or third-party agents require Docker. The CLI should warn if Docker is unavailable when running non-vetted agents.

---

## Current State — `leclaw` (Open Source Framework)

**`@revtown/core` publish state:** v0.3.8 ✅ published | `leclaw-app` pinned to: `@revtown/core@0.3.8`
*(Update this line every session after a publish.)*

### What's Built
- ✅ Landing page (`index.html`) — deployed to revtown.io via Vercel
- ✅ `@revtown/core` — published to npm (see `package.json` for version)
- ✅ Le Data Quality (`agents/le-data-quality/`)
- ✅ Le Stage Audit (`agents/le-stage-audit/`)
- ✅ Le Directeur CLI (`npx revtown`) — interactive REPL, synthesizes across agents
- ✅ Setup wizard (`npx revtown setup`) — opens browser, verifies connections, writes .env, launches CLI
- ✅ Run history + trend awareness — synthesis includes 4-week score trajectory
- ✅ Write-back types — `WritebackPatch`, `applyPatch()`, `applyBatch()` in core

### What Does NOT Exist Here
- ❌ Dashboard — that's in `leclaw-app`
- ❌ Le Témoin UI — that's in `leclaw-app`
- ❌ Salesforce adapter — not yet built. **This is the largest revenue-gating gap.** RevOps teams at $50M+ ARR are almost exclusively on Salesforce. HubSpot only right now — the CLI, README, and any user-facing copy must be explicit about this.
- ❌ Le BDR, Le Forecast, Le Plumber (next citizens for this repo)
- ❌ Record metering — free tier limits (5,000 records) are defined in pricing but not yet enforced in code. P0 before growth.
- ❌ `PROMPT.md` files for Claude Projects path — each existing citizen needs one

---

## Architecture — `leclaw` (Open Source)

```
npx revtown
  └── cli/index.ts (Le Directeur)
        └── keyword router → selects agents
        └── runAgent() × N → Haiku summary per agent
        └── callClaude(Sonnet) → single synthesis answer

npx revtown setup
  └── setup.js
        └── opens HubSpot/Anthropic/Slack in browser
        └── verifies each connection
        └── writes .env → launches CLI

@revtown/core (npm)
  └── core/base.ts               — runAgent(), types, scoring, callClaude(), WritebackPatch
  └── core/hubspot-search.ts     — paginated targeted search (never full scans)
  └── core/hubspot-write.ts      — applyPatch(), applyBatch() for write-back
  └── core/hubspot-properties.ts — dynamic custom property discovery
  └── core/registry.ts           — agent registry
  └── core/routing.ts            — keyword router
  └── core/synthesis.ts          — Le Directeur synthesis prompts + run history/trends
```

---

## Citizens (Agent Roadmap)

The citizen library is the product. Ship citizens relentlessly.

| Priority | Citizen | Domain | Status |
|----------|---------|--------|--------|
| ✅ | Le Data Quality | Field completeness, relationship hygiene | Live |
| ✅ | Le Stage Audit | Deal velocity, pipeline health | Live |
| 🔜 | Le BDR | Follow-up SLA, unworked MQLs, bounce hygiene | Next |
| 🔜 | Le Forecast | Commit accuracy, coverage ratio, at-risk deals | Next |
| 📋 | Le Plumber | Routing gaps, unassigned leads, round robin health | Planned |
| 📋 | Le Renewal | Renewal risk, upcoming dates, health signals | Planned |
| 📋 | Le Territory | Coverage gaps, alignment, rep assignment | Planned |
| 📋 | Le Commission | Accuracy, dispute prevention, quota hygiene | Planned |
| 📋 | Le QBR | Automated QBR prep, trend analysis | Planned |
| 📋 | Le Duplicates | Identity resolution, merge candidates | Planned |
| 📋 | Le Activities | Meeting/call logging gaps, engagement hygiene | Planned |
| 📋 | Le Deal Desk | Discount hygiene, deal structure, approvals | Planned |

**Target cadence:** 1 new citizen per month. Each citizen requires ~2 weeks to build and test.

---

## Building a New Citizen

Start here when adding a new citizen to the town.

**Required files:**
```
agents/le-[name]/
  agent.ts      — implements RevTownAgent interface, returns AgentReport
  index.ts      — entry point
  PROMPT.md     — self-contained Claude Projects prompt (paste directly into Claude Projects)
```

**Steps:**
1. Copy from `examples/` template
2. Implement `agent.ts` — define your filterGroups checks and scoring logic
3. Write `PROMPT.md` — plain language, no install required, structured as: context + what you check + how to ask questions
4. Run `npm run build` to verify compilation
5. Test against a real HubSpot sandbox — never mock the CRM layer
6. Open a PR — include a sample `AgentReport` output in the PR description

**Contributor attribution:** Add your name to the citizen's introduction in `PROMPT.md` and `README.md`: "Built by [name], [role] at [company]."

---

## Important Technical Notes

- **Env var is `HUBSPOT_TOKEN`** — not `HUBSPOT_API_TOKEN`. Fixed Mar 2026.
- **Never full-scan the CRM** — all HubSpot fetches use search API with filterGroups. HubSpot private apps: 100 req/10s rate limit. Respect existing patterns in `hubspot-search.ts`.
- **Model cascade:** Haiku per agent → Sonnet once for synthesis. Rough cost per Le Directeur run: Haiku × [n agents] ≈ $0.01–0.05, Sonnet synthesis ≈ $0.05–0.15. Total: ~$0.10–$0.20 per run. Monitor at scale.
- **AI failure modes:** If `callClaude()` returns an unparseable response, agents must surface the raw error — never silently return empty results. No retry logic exists yet; this is known debt.
- **Naming convention:** Use `agent` in all code identifiers (`runAgent`, `RevTownAgent`, `AgentReport`). Use `citizen` in all user-facing strings, READMEs, and copy. Never mix.
- **`setup.js` is plain JS** — not compiled by tsc. Edit directly.
- **bin entry must not have `./` prefix** — `"leclaw": "cli/index.js"` not `"./cli/index.js"`. The `./` prefix silently breaks the npm binary on some platforms.
- **npm publish must run from `C:\Users\Benjamin\leclaw`** — not a parent directory.
- **Le Directeur synthesis is shared logic** — core exports `buildSynthesisPrompt()`. Both CLI and app import it. Never duplicate it.
- **npm package renames are blocking** — never update imports in leclaw-app before the renamed package exists on npm. Rename the code, publish, then update imports. Doing it in reverse breaks the Vercel build silently.
- **Open core tradeoff:** `buildSynthesisPrompt()` is MIT-licensed. The moat is not the synthesis logic — it is the encoded domain knowledge in each citizen's prompts and filterGroups. Those are also in the open repo. The hosted product's moat is ease of connection, Slack delivery, and write-back. Be clear-eyed about this.

---

## Environment Variables

```
HUBSPOT_TOKEN=         # HubSpot private app token (CRM scope)
ANTHROPIC_API_KEY=     # Anthropic API key
SLACK_WEBHOOK_URL=     # Slack incoming webhook URL (optional)
```

## Commands

```
npx revtown                      # Launch Le Directeur CLI
npx revtown setup                # First-time setup wizard
npm run build                    # Compile TypeScript
npm test                         # Run test suite (integration tests require .env.test with real HubSpot sandbox token)
npm publish --access public      # Publish to npm (requires OTP browser auth)
```

## File Structure

```
leclaw/
  agents/
    le-data-quality/    # Le Data Quality (TypeScript)
      agent.ts
      index.ts
      PROMPT.md         # Claude Projects prompt — TODO: create
    le-stage-audit/     # Le Stage Audit (TypeScript)
      agent.ts
      index.ts
      PROMPT.md         # Claude Projects prompt — TODO: create
  cli/index.ts          # Le Directeur REPL
  core/                 # Framework internals (@revtown/core)
  examples/             # New citizen template — start here
  setup.js              # Setup wizard (plain JS)
  index.html            # Landing page (revtown.io)
  package.json          # @revtown/core
```

---

## Business Context

**Why RevTown wins:** RevOps knowledge is tribal and practitioner-held. Nobody has built the canonical place where that knowledge becomes runnable code. n8n is infrastructure that requires engineers. Momentum and Attention are reactive alerting — they tell you what happened, not what's broken. Cargo is workflow execution, not pipeline inspection. None of them were built by someone who has done the job. RevTown is the first tool built by a RevOps practitioner for RevOps practitioners, where citizens encode what experienced operators actually know. That's the edge.

**Primary ICP:** Head of RevOps at a 50–200 person B2B SaaS company. 1–3 person team. Reports to the CRO. Owns pipeline reporting, CRM hygiene, and the board deck. Drowning in manual work they inherited and can't automate without engineering help.

**Secondary ICP:** GTM Engineers who want to encode domain knowledge and contribute to the hub.

**Activation event:** A user receives a report with at least one flagged issue that matches a real problem they already knew about. That's when RevTown becomes credible. Everything before that is setup cost.

**Pricing:**
- Free: 5,000 records, shadow mode only (read/report, no writes), 1 CRM
- Growth: $149/mo — 50k records, write-back enabled, 1 CRM
- Scale: $499/mo — unlimited, multi-CRM, team access
- Enterprise: Custom

**Business model:** Open core. Framework is MIT. Hosted product is freemium SaaS. Conversion bridge: CLI surfaces the dashboard CTA after a successful report — "Want this delivered to Slack automatically? → app.revtown.io"

**Competitors:**
- n8n (open source, requires engineers to configure)
- Momentum/Attention (reactive, not proactive)
- Cargo (YC S23, GTM workflow builder — execution not monitoring)
- Openprise/Syncari (enterprise, $50k+/yr)
- LeanData (routing only)
- LangChain Deep Agents (GTM reference impl, open-sourced March 2026) — emerging threat

---

## Ben's Background

- GTM Architect at Docker (Aug 2025–present)
- 3 years GTM/RevOps — lived the pain RevTown solves
- Strong Salesforce admin (CPQ, lead routing, territory, ARR)
- Python/SQL background
- Building RevTown as a practitioner building tools for practitioners — not a VC-backed startup
- In first-person content (LinkedIn, blog, README), the voice is Ben's: a RevOps professional who codes, not a developer who read about RevOps. Credibility comes from operational experience.

---

## Architectural Decisions (March 2026)

These are locked decisions. Do not relitigate them.

### Rebrand: LeClaw → RevTown (March 2026)
Product renamed from LeClaw to RevTown. One word. Le Directeur and all agent names with the "Le" prefix are unchanged — they are brand assets. All other French terminology ("rapport", "mission", etc.) has been removed from user-facing language. Do not suggest renaming Le Directeur or the agents. Do not reintroduce French vocabulary beyond the "Le" prefix.

### Brand Identity (March 2026)
- **Colors:** Warm white (`#FAF8F5`) background, terracotta (`#C85C38`) accent, dark clay (`#2A1A12`) for contrast sections. Wordmark: "Rev" in terracotta, "town" in ink.
- **Design direction:** Clean, developer-tool-adjacent — Cursor, Sigma, Replit. No cartoons. No stock photos. Illustrations as architectural sketches only.
- **Positioning line:** "Your keys. Your town. You're the Mayor of RevTown — and every mayor needs a right hand."

### Le Directeur (March 2026)
Le Directeur is the Mayor's right hand — the town coordinator. Always referred to by name in marketing contexts, never as "the orchestrator." Dispatches citizens based on natural language. Available through CLI and dashboard only — not in the Claude Projects path (that's direct citizen access without Le Directeur).

### Le Directeur Synthesis is Shared (March 2026)
`buildSynthesisPrompt()`, run history, and trend awareness live in `@revtown/core`. Both CLI and dashboard import it. Never duplicate synthesis logic.

### Docker for CLI Only (March 2026)
Each agent runs in its own container — 512MB RAM, 0.5 CPU, removed on exit. Falls back to in-process if Docker unavailable (vetted citizens only — see security note in Technical Notes). Vercel serverless cannot run containers — dashboard isolation handled by Vercel's ephemeral environment.

### Open Core Split (March 2026)
`leclaw` is public MIT. `leclaw-app` is private. `lib/agents/runner.ts` (75 lines) is the only app-layer addition — a Supabase persistence wrapper around core's `runAgent()`.

### Async Execution (March 2026)
Dashboard API routes return `{ run_id }` immediately. Agent runs in background via Next.js `after()`. Client polls `/api/runs/[runId]` every 2s. `maxDuration` raised to 300s.

---

## Session Startup Checklist
1. Read this file
2. Check memory: `~/.claude/projects/C--Users-Benjamin-leclaw/memory/`
3. Run `git log --oneline -10`
4. Update publish state line in Current State if a publish happened since last session
5. Ask Ben what he wants to build today

**Focus rule:** If it doesn't ship a citizen, improve Le Directeur's synthesis, or reduce time-to-first-report — it's a lower priority. Citizens first.
