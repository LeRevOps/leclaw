# Changelog

All notable changes to LeClaw are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-03-24

### Added
- `le-stage-audit` — deal pipeline agent: stuck deals, missing close dates, past close dates, no contact association, high-value escalation
- `lib/hubspot-search.js` — targeted search utility using HubSpot's search API. Agents now fetch only broken records — clean records are never touched
- `lib/hubspot-properties.js` — dynamic custom property discovery via HubSpot Properties API
- `lib/base.js` — shared agent runner with lifecycle management, scoring, Le Retrait error handling
- `filterGroups` as function support — time-based checks compute timestamps fresh on each run
- Relationship checks — association filters for cross-object problems (contacts with no company, deals with no contact)
- Escalation — broken records with additional CRM context (open deals, high value) escalate to higher severity
- Write-back stubs — each check documents how it would be auto-fixed when write-back is enabled
- `CONTRIBUTING.md` — full guide for building and submitting new agents
- `LICENSE` — MIT

### Changed
- `le-data-quality` refactored to use targeted search — no longer scans the full CRM
- All broken record IDs now stored in issues table (previously capped at 20 samples)
- Architecture naming: Le Directeur, Le Témoin, une mission, un rapport, Le Retrait

### Architecture
- Agent base pattern established — all future agents inherit targeted fetching, relationship awareness, dynamic discovery, and write-back readiness

---

## [0.1.0] — 2025-11-01

### Added
- `le-data-quality` — first agent: contact and company field completeness, duplicate detection, stale records
- `core/hubspot.js` — HubSpot API adapter
- `core/salesforce.js` — Salesforce API adapter
- `core/slack.js` — Slack report delivery
- `core/ai.js` — Claude API integration (Haiku for summaries)
- `setup.js` — interactive setup wizard with masked credential input
- `SECURITY.md` — documents what data LeClaw accesses and stores
- Initial README and landing page
