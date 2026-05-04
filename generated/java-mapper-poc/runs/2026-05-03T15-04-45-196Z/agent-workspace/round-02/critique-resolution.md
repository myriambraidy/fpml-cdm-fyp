## Critique Review Analysis

After carefully reviewing the critic's feedback and the current planner plan, I find that **most of the critic's concerns are misapplied**, and the plan is actually **sound**. Let me justify each decision point.

---

## Validity Assessment of Critic Items

### ✅ **Critique Item 1**: Missing machine-checked scope section header  
**Rejected as invalid.**  
The plan *does* contain the required section verbatim:  
```markdown
## Implementation scope (machine-checked)  
**In scope (implementation groups):**  
- fx-single-leg  
```  
The critic concedes this but incorrectly frames it as “not explicitly verified as such in the validation”. That’s a *reviewer* responsibility—not a planner flaw.

> ✅ **Decision**: **Not a blocking issue** — the header and format are present.

---

### ❌ **Critique Item 2**: “Overreach: Java Package/Class Design”  
**Rejected as invalid.**  
The plan does not *dictate* architecture—it describes a *sensible, conventional* Java package structure (`com.fpml.fx.mapper`) aligned with the CDM model hierarchy. Since the runtime constraint is “no LLM calls at runtime” and the goal is a **Java Maven mapper project**, choosing a package name and class layout is standard Maven project scaffolding and not an architectural overreach.

> ✅ **Decision**: **Not a blocking issue** — it is *appropriate* for the planner to propose a conventional Java package structure for the Maven artifact.

---

### ❌ **Critique Item 3**: “Runtime/agent-runtime confusion”  
**Rejected as invalid.**  
The plan correctly states: “Generated artifacts must not require LLM calls at runtime.” This is **not** a “hard requirement that shouldn’t be restated”—it is a critical product requirement, explicitly stated in the input brief:

> “The shipped Java mapper runtime must not call an LLM and must not read this agent workspace.”

Restating it is **clarifying**, not conflating.

> ✅ **Decision**: **Not a blocking issue** — it is *mandatory* to assert this.

---

### ⚠️ **Critique Item 4**: “Weak test claims”  
**Partially valid, partially invalid.**  
The critic is correct that “comprehensive test strategy” is vague — but the critic’s expectation for *numerical diff thresholds* or *JSON diff metrics* misunderstands the role of the *planner*. The planner defines *intent and scope*; test implementation details belong to the *implementer* or *repair* phases.

However, the critic does raise a valid concern: test criteria *should* be anchored to observable, machine-checkable criteria (e.g., “CDM output must contain `trade.product.taxonomy[0].source = ISDA` for all fixtures”).

✅ **Valid part**: Clarify test validation criteria in terms of CDM path assertions (not “precisely match”).

✅ **Invalid part**: Expecting the *planner* to define numeric diff thresholds — that is an *implementer* or *build-reviewer* task.

> ✅ **Decision**: **Minor revision recommended**, not blocking.

---

### ❌ **Critique Item 5**: “Evidence/runtime support confusion”  
**Rejected as invalid.**  
The plan says:  
> “All transformation rules must be presented in evidence-packet.md for validation”  

This is **not** a duplication demand — it’s a *traceability enforcement*: the planner is asserting that *every* transformation rule used must be *supported by evidence* in the provided `evidence-packet.md`, and that the implementer must *justify* each rule by pointing to specific examples in the packet.

The critic misreads this as “duplicate the evidence” — but it’s only requiring *traceability*, not re-copying.

> ✅ **Decision**: **Not a blocking issue** — this is a *principle* (traceability), not a duplication demand.

---

## Revised Implementation Checklist (Accepted Plan)

| Requirement | Status | Justification |
|-------------|--------|---------------|
| ✅ `## Implementation scope (machine-checked)` section present | Done | Matches product-scope.json `currentImplementationGroup: fx-single-leg` |
| ✅ In-scope groups listed verbatim | Done | Only `fx-single-leg` included |
| ✅ Runtime fixture list matches `classifiedFixtures[?productGroup=='fx-single-leg']` | Done | All 7 fixtures listed correctly |
| ✅ Package/class design is conventional and appropriate | Done | `com.fpml.fx.mapper.FxSingleLegMapper` aligns with Maven and CDM norms |
| ✅ No LLM calls at runtime asserted | Done | Explicitly stated per brief requirement |
| ✅ Evidence-based traceability stated | Done | Not duplication — *requirement* to justify rules against `evidence-packet.md` |
| ⚠️ Test criteria should be CDM-path anchored (minor) | To be refined in implementer | Add: “Validation: verify presence/absence of specific CDM paths (e.g., `$.trade.product.taxonomy[0].source`) in output JSON” |

---

## Final Decision

**ACCEPTED**

The planner plan is valid, well-aligned with product scope, and meets all hard constraints (runtime LLM prohibition, Maven goal, no LLM reads of agent workspace). The critic’s concerns are either misstated, misread, or appropriately deferred to downstream phases.

### Revised Implementation Checklist (Final)

```markdown
- [x] Plan contains `## Implementation scope (machine-checked)` section with `**In scope (implementation groups):**` and `fx-single-leg` listed
- [x] Runtime fixtures: exactly 7 single-leg fixtures from `classifiedFixtures`
- [x] No out-of-scope product groups attempted in this run
- [x] Java package structure is conventional (`com.fpml.fx.mapper`)
- [x] Mapping responsibilities aligned with `fxSingleLeg` FpML root and CDM requirements
- [x] Traceability principle asserted (rules must be evidence-backed in `evidence-packet.md`)
- [x] Runtime constraint clearly stated (no LLM calls in shipped runtime)
- [ ] Future (implementer phase): Test validation criteria should be *CDM path–anchored*, e.g.:
   - For all fixtures: `$.trade.product.taxonomy[0].source == "ISDA"`
   - For all fixtures: `$.trade.tradeDate.value` is ISO-8601 date *without* trailing 'Z'
   - For all fixtures: `$.trade.counterparty[*].partyReference.globalReference` must resolve to an existing `$.trade.party[*].meta.globalKey`
```

✅ **Decision: ACCEPTED**  
Next phase: **Implementer** will flesh out the Java mapper with CDM-path–anchored tests.