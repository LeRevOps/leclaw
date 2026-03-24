# Contributing to LeClaw

LeClaw is an open-source RevOps agent framework. Contributions are welcome — especially new agents, CRM adapter improvements, and bug fixes.

---

## Ways to Contribute

- **New agent** — build a specialist agent for a RevOps domain not yet covered
- **New CRM adapter** — add support for Salesforce, Pipedrive, or other CRMs
- **Improve an existing agent** — add checks, fix edge cases, improve scoring
- **Bug fix** — fix something broken
- **Documentation** — clarify how the framework works

---

## Building a New Agent

Every agent follows the same pattern. Read `agents/le-data-quality/` as the reference implementation.

### Agent spec

An agent exports an object conforming to `AgentDefinition`:

```js
{
  name: string,           // kebab-case, prefixed with "le-": "le-my-agent"
  checks: AgentCheck[],   // array of check definitions (see below)
  discoverChecks?: async (token) => AgentCheck[],  // optional: runtime-discovered checks
  summaryPrompt: (results) => string,  // builds the prompt sent to Claude
}
```

### Check spec

A check fetches only the broken records matching a specific problem:

```js
{
  id: string,                    // snake_case: "missing_email"
  label: string,                 // human-readable: "Contacts missing email"
  objectType: string,            // "contacts" | "companies" | "deals" | "tickets"
  filterGroups: FilterGroup[] | () => FilterGroup[],  // what makes a record "broken"
  properties: string[],          // HubSpot property names to fetch on matching records
  severity: "critical" | "warning" | "info",
  fix: string,                   // actionable fix suggestion shown to the user
  getName: (record) => string,   // how to get a display name from the record

  // Optional: escalate severity when broken record also matches additional context
  escalateIf?: {
    description: string,
    filterGroups: FilterGroup[] | () => FilterGroup[],
    escalatedSeverity: "critical" | "warning",
  },

  // Optional: describe how this issue would be auto-fixed (write-back tier)
  writeback?: {
    description: string,
    requiresApproval: boolean,
    automated: boolean,
  },
}
```

### Naming conventions

- Agent names: `le-{domain}` — `le-routing`, `le-forecast`, `le-bdr`
- Check IDs: `{object}_{problem}` — `missing_email`, `no_company_association`, `deal_stuck_30_days`
- Severity guidelines:
  - `critical` — blocks revenue or corrupts data (missing email on a deal contact, duplicate records)
  - `warning` — degrades reporting or workflow quality (missing company association, no close date)
  - `info` — nice to have, segmentation or enrichment gap (missing industry, missing job title)

### Checklist before submitting

- [ ] Agent name starts with `le-` and is kebab-case
- [ ] All checks use `NOT_HAS_PROPERTY` / `HAS_PROPERTY` filters — no full CRM scans
- [ ] Time-based checks use a function for `filterGroups` (not a hardcoded timestamp)
- [ ] `getName` returns a human-readable string, not just an ID
- [ ] `fix` is actionable — describes what to do, not just what's wrong
- [ ] `summaryPrompt` gives Claude only counts and labels — no raw records
- [ ] Agent is added to the agent table in `README.md`
- [ ] Script added to `package.json`

---

## Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b agent/le-my-agent`
3. Build your agent following the spec above
4. Test it against a real HubSpot instance (or use the mock in `examples/`)
5. Open a PR with:
   - What the agent checks and why
   - Which HubSpot object types it touches
   - Example output

---

## Code Style

- ES modules (`import`/`export`)
- No TypeScript required for agents — plain JS is fine
- No external dependencies beyond what's in `package.json`
- Comments on non-obvious logic only

---

## Questions

Open an issue or start a discussion on GitHub.
