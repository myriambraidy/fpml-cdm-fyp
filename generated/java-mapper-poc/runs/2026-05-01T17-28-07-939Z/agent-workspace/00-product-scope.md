# Product Scope

Selected product family: fx-derivatives

Supported products for this run:
- To be selected by the planner from FX derivatives evidence.

Evidence folders:
- data/agent-cookbook/latest
- data/rosetta-source/latest
- data_to_learn_from/fpml/fx-derivatives
- data_to_learn_from/cdm_parallel/fx-derivatives

Candidate fixture paths:
- data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml
- data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml

Candidate expected CDM paths:
- data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json
- data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex03-fx-fwd.json

Rules:

- Use the whole allowed FX derivatives evidence folder for learning.
- Do not inspect or generate for non-FX derivative product families.
- Do not claim runtime support for a product unless the generated jar has a mapper and tests for it.
- Record observed but unsupported FX products in the accepted plan and reports.
