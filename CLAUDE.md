# LeClaw — Claude Code Context File

Read this at the start of every session. This is the single source of truth for where the project stands.

---

## What LeClaw Is

**LeClaw is the open-source GTM agent hub.**

The canonical collection of revenue operations agents — community-built, CRM-native, deployable in two minutes. Think OpenClaw for CRMs and RevOps: a hub where practitioners encode domain knowledge as agents, and Le Directeur is the orchestrator that deploys any of them against your stack.

This is not a tool that helps your RevOps team. It is the infrastructure for an autonomous RevOps layer — every repeatable, processable task that should never require a human to do manually.

**The hub is the product. Le Directeur is the orchestrator.**

```
Data quality audits       → Le Data Quality    ✅
Pipeline reviews          → Le Stage Audit     ✅
BDR follow-up enforcement → Le BDR             🔜
Forecast integrity        → Le Forecast        🔜
Lead routing QA           → Le Plumber         📋
Territory coverage        → Le Territory       📋
Renewal risk              → Le Renewal         📋
Commission accuracy       → Le Commission      📋
QBR prep                  → Le QBR             📋
Write-back / fixing       → Le Témoin          ✅ (app layer)
```

Every feature decision, every architecture choice, every session should move toward this. If it doesn't add agents, enable the community to add agents, or make existing agents run better — deprioritize it.

**The community flywheel:** LeClaw's moat is encoded domain knowledge from RevOps practitioners. A BDR manager knows what SLA failure looks like. A CSM knows renewal risk. The framework makes it easy to contribute an agent (filterGroups checks + a summary prompt) — they don't need to be engineers. Every contributed agent is institutional RevOps knowledge that runs in hundreds of CRMs.

**Positioning:** "Native agents are features inside a single product. LeClaw is the open-source GTM agent hub — agents for every domain, deployable against any CRM."

**ICP:** Any B2B company with a sales team and a CRM. Primary: Head of RevOps / VP Sales Ops at Series B–C SaaS, $10–50M ARR. Secondary: GTM engineers and RevOps practitioners who want to encode their own domain knowledge and contribute to the hub.

**Open source and forkable by design.** The framework is MIT licensed. GTM engineers can clone it, run it against their own CRM, fork it, and contribute agents back. The open source repo is the top of funnel. The hosted dashboard is the monetization layer.

**Live at:** https://leclaw.io
**Dashboard:** https://app.leclaw.io (leclaw-app repo)
**npm:** `@leclaw/core` (current version: 0.3.6)
**GitHub:** https://github.com/LeRevOps/leclaw
**Stack:** Node.js, TypeScript, Claude API, HubSpot API, Slack API, Vercel, Supabase

---

## Two Repos — Two Different Users, One Framework

| Repo | Path | Purpose | Users |
|------|------|---------|-------|
| `leclaw` | `C:\Users\Benjamin\leclaw` | Open source framework + CLI (`@leclaw/core` on npm) | GTM engineers, developers, contributors |
| `leclaw-app` | `C:\Users\Benjamin\leclaw-app` | Hosted SaaS dashboard (app.leclaw.io) — Next.js + Supabase | RevOps managers, non-technical users |

**This CLAUDE.md is for the `leclaw` repo (open source framework).**
The `leclaw-app` repo has its own CLAUDE.md.

### Why two repos

The same `@leclaw/core` framework powers both. The split is intentional — open core business model, same as Supabase, PostHog, Metabase.

- **`leclaw` (public, MIT)** — anyone can clone, fork, run agents against their own CRM, contribute new agents. This is the community and the top of funnel. Developers find it on GitHub, GTM engineers fork it, companies evaluate it. No terminal skills required for basic use (`npx leclaw`).
- **`leclaw-app` (private)** — the hosted product. Supabase auth, billing, multi-tenancy, dashboard UI. Contains secrets, business logic, and infrastructure config. Never public.

### Execution architecture — two flows, one framework

```
DEVELOPER / GTM ENGINEER (open source)        NON-TECHNICAL REVOPS (hosted dashboard)
────────────────────────────────────           ────────────────────────────────────────
npx leclaw                                     app.leclaw.io
  └── Le Directeur REPL                          └── clicks "Run Mission"
        └── routeQuestion()                            └── Next.js API route (Vercel)
        └── Docker available?                                └── runAgentForOrg()
              YES → runAgentInDocker()                             └── runAgent() ← @leclaw/core
                     └── docker run --rm                                └── HubSpot API
                           └── agent-runner.js                    └── onIssue() → Supabase
                                 └── runAgent() ← @leclaw/core    └── Slack delivery
              NO  → runAgent() ← @leclaw/core
```

**Docker is CLI-only.** Vercel serverless cannot run containers. Dashboard users get Vercel's own ephemeral isolation — sufficient because they only run LeClaw's vetted agents, never custom code. Docker matters for developers because they may run custom or third-party agents on their own machine. Resource-limited to 512MB RAM, 0.5 CPU, removed on exit. Falls back to in-process automatically if Docker is unavailable.

**Key insight:** The `leclaw-app` dashboard is the delivery mechanism for the agent library to non-technical users. The open source CLI is the delivery mechanism for developers and contributors. Same agents, different runtime targets.

---

## Current State — `leclaw` (Open Source Framework)

### What's Built
- ✅ Landing page (`index.html`) — deployed to leclaw.io via Vercel
- ✅ `@leclaw/core` v0.3.4 — published to npm
- ✅ Le Data Quality agent (`agents/le-data-quality/`)
- ✅ Le Stage Audit agent (`agents/le-stage-audit/`)
- ✅ Le Directeur CLI (`npx leclaw`) — interactive REPL
- ✅ Setup wizard (`npx leclaw setup`) — opens browser, verifies connections, writes .env, launches CLI

### What Does NOT Exist Here
- ❌ Dashboard — that's in `leclaw-app`
- ❌ Write-back / Le Témoin
- ❌ Le Plumber, Le Lead Router, Le Forecast (next agents for this repo)

---

## Architecture — `leclaw` (Open Source)

```
npx leclaw
  └── cli/index.ts (Le Directeur)
        └── keyword router → selects agents
        └── runAgent() × N → Haiku summary per agent
        └── callClaude(Sonnet) → single synthesis answer

npx leclaw setup
  └── setup.js
        └── opens HubSpot/Anthropic/Slack in browser
        └── verifies each connection
        └── writes .env → launches CLI

@leclaw/core (npm)
  └── core/base.ts             — runAgent(), types, scoring, callClaude()
  └── core/hubspot-search.ts   — paginated targeted search (never full scans)
  └── core/hubspot-properties.ts — dynamic custom property discovery
  └── core/registry.ts         — agent registry
  └── core/routing.ts          — keyword router
  └── core/synthesis.ts        — Le Directeur synthesis prompts
```

---

## Agent Roadmap

The agent library is the product. Ship agents relentlessly. Every agent added moves LeClaw from "tool" toward "autonomous RevOps team."

| Priority | Agent | Domain | Status |
|----------|-------|--------|--------|
| ✅ | Le Data Quality | Field completeness, relationship hygiene | Built |
| ✅ | Le Stage Audit | Deal velocity, pipeline health | Built |
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

**10 agents = a RevOps team. That is the goal.**

---

## Important Technical Notes

- **Env var is `HUBSPOT_TOKEN`** — not `HUBSPOT_API_TOKEN`. Fixed Mar 2026.
- **Never full-scan the CRM** — all HubSpot fetches use search API with filterGroups.
- **Model cascade:** Haiku per agent → Sonnet once for synthesis.
- **`setup.js` is plain JS** — not compiled by tsc. Edit directly.
- **bin entry must not have `./` prefix** — `"leclaw": "cli/index.js"` not `"./cli/index.js"`.
- **npm publish must run from `C:\Users\Benjamin\leclaw`** — not a parent directory.

## Environment Variables
```
HUBSPOT_TOKEN=         # HubSpot private app token (CRM scope)
ANTHROPIC_API_KEY=     # Anthropic API key
SLACK_WEBHOOK_URL=     # Slack incoming webhook URL (optional)
```

## Commands
```
npx leclaw                      # Launch Le Directeur CLI
npx leclaw setup                # First-time setup wizard
npm run build                   # Compile TypeScript
npm publish --access public     # Publish to npm (requires OTP browser auth)
```

## File Structure
```
leclaw/
  agents/
    le-data-quality/    # Le Data Quality agent (TypeScript)
    le-stage-audit/     # Le Stage Audit agent (TypeScript)
  cli/index.ts          # Le Directeur REPL
  core/                 # Framework internals
  examples/             # Custom agent template
  setup.js              # Setup wizard (plain JS)
  index.html            # Landing page (leclaw.io)
  package.json          # @leclaw/core v0.3.4
```

---

## Business Context

**ICP:** Head of RevOps or VP Sales Ops at Series B B2B SaaS, $5-50M ARR, 50-300 employees.

**Pricing:**
- Free: 5,000 records, shadow mode only, 1 CRM
- Growth: $149/mo — 50k records, write-back, 1 CRM
- Scale: $499/mo — unlimited, multi-CRM, team access
- Enterprise: Custom

**Business model:** Open core. Framework is MIT. Hosted product is freemium SaaS.

**Competitors:**
- n8n (open source, requires engineers)
- Momentum/Attention (reactive, not proactive)
- Openprise/Syncari (enterprise, $50k+/yr)
- LeanData (routing only)
- LangChain Deep Agents (GTM reference impl, open-sourced March 2026) ← emerging threat

**Core insight:** RevOps teams fear being blindsided in front of the CRO. LeClaw catches problems before they become someone else's problem. The moat is not the framework — it is the encoded domain knowledge in the agents. Anyone can build a framework. Only practitioners who lived the pain know what broken looks like across the full revenue motion.

**Every session should move toward the agent library goal. If a decision doesn't add agents, enable others to add agents, or make agents run better — it is a lower priority.**

---

## Benjamin's Background
- Senior Sales Ops Analyst at Docker (Aug 2025-present)
- 3 years GTM/RevOps — lived the pain LeClaw solves
- Strong Salesforce admin (CPQ, lead routing, territory, ARR)
- Python/SQL background
- Targeting GTM Engineer roles ($175k+)
- LeClaw: portfolio project + potential product

---

## Major Decisions (March 2026)

These are architectural and strategic decisions made in prior sessions. Do not relitigate them.

### Docker for CLI (not dashboard)
Added Docker container isolation to the CLI in v0.3.5. Each agent runs in its own container (`leclaw/runner:0.3.5`) — 512MB RAM, 0.5 CPU, removed on exit, no host filesystem access. Credentials passed as env vars. Falls back to in-process if Docker unavailable.

**Why CLI only:** Vercel serverless can't run containers. Dashboard users only run LeClaw's vetted agents — Vercel's ephemeral isolation is sufficient. Docker matters for developers running custom/third-party agents on their own machine. Benjamin works at Docker — this is deliberate product alignment.

**What's missing:** Credential proxy (credentials currently passed as env vars, visible in `docker inspect`). Post-MVP.

### Open core split
`leclaw` is public MIT. `leclaw-app` is private. Same `@leclaw/core` framework powers both. leclaw-app previously duplicated ~900 lines of framework code — refactored in March 2026 to import from npm. `lib/agents/runner.ts` (75 lines) is the only app-layer addition — Supabase persistence wrapper around core's `runAgent()`.

### Async execution (March 2026)
Dashboard API routes previously waited synchronously for agent completion — would time out on large HubSpot portals (Vercel 60s limit). Fixed using Next.js `after()`: routes return `{ run_id }` immediately, agent runs in background, client polls `/api/runs/[runId]` every 2s. `maxDuration` raised to 300s.

### The mission
Decided: LeClaw is not a CRM audit tool. It is a RevOps team that runs 24/7. Two agents is a proof of concept. Ten agents is a RevOps team. Every session moves toward the agent library goal.

---

## Session Startup Checklist
1. Read this file
2. Check memory: `~/.claude/projects/C--Users-Benjamin-leclaw/memory/`
3. Run `git log --oneline -10`
4. Ask Benjamin what he wants to build today
