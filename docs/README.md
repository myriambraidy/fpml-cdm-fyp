# Documentation

**Purpose:** Permanent documentation for AI agents working on this codebase.

**Committed to git:** Yes - this is living knowledge about the system.

---

## Core Documents

### `design.md`
**Problem statement and approach:**
- Why we're building this (analyst productivity)
- Chosen approach (skill-augmented copilot)
- Success criteria (70%+ approval rate)
- Constraints and premises

**For:** Understanding project goals and constraints

---

### `architecture.md`
**System architecture and implementation:**
- Tech stack (TypeScript + Bun + Hono + Zod)
- Component design (parser, skills, agent, API)
- Data flow diagrams
- 6-week timeline
- Directory structure

**For:** Building or extending the system

---

## Skill Documentation

### `skills-status.md`
**Current state of the 6 generated skills:**
- Which TODOs are resolved (8 of 22)
- Which remain (14 non-blocking)
- Confidence levels
- What's validated vs what needs testing

**For:** Agents working on skills or orchestration

---

### `mapping-rules.md`
**FPML→CDM mapping knowledge:**
- Validated party role rules (premium payer = buyer, etc.)
- Currency and unit expansions
- Research findings from CDM documentation
- Mapping decisions with confidence levels

**For:** Agents working on skills, parser, or orchestrator

---

### `schemas/`
**FPML 5.12 + CDM 5.35.0 structure analysis:**

- **cdm-structure.md** - CDM types (Party, Payout, Product)
- **fpml-structure.md** - FPML patterns (party roles, products, temporal fields)
- **mapping-domains.md** - 12 mapping domains identified, skill clustering

**For:** Agents needing deep schema knowledge

---

## What's in plan/ (Ephemeral, Not Committed)

**Task plans and reviews** (don't commit to git):
- Code reviews
- Skill generation process docs
- TODO guides and checklists
- Planning summaries

**These are scratch work** - useful during development, not permanent knowledge.

---

## When to Update This

**Update `skills-status.md` when:**
- You resolve more TODOs
- Skills are refactored
- New skills are added

**Update `mapping-rules.md` when:**
- You discover new mapping patterns
- Confidence thresholds change
- New currencies/units are added

**Update `schemas/` when:**
- FPML or CDM versions change
- New product types are added
- Schema structure changes

---

## For AI Agents

**When working on this codebase, read in order:**
1. Root `README.md` (project overview)
2. `docs/design.md` (problem statement, approach)
3. `docs/architecture.md` (system architecture, tech stack)
4. `docs/skills-status.md` (skill readiness)
5. `docs/mapping-rules.md` (FPML→CDM mapping knowledge)
6. `docs/schemas/` (deep schema reference if needed)

**Don't read `plan/`** - That's ephemeral scratch work, not committed to git.
