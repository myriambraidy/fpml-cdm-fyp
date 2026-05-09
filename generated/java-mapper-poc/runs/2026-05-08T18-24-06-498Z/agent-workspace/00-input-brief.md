# Input Brief

Run id: 2026-05-08T18-24-06-498Z
Product family: fx-derivatives

Role models:
- planner: qwen/qwen3-coder-30b-a3b-instruct, maxTokens=9000
- critic: qwen/qwen3-coder-next, maxTokens=5000
- critique-reviewer: qwen/qwen3-coder-next, maxTokens=5000
- implementer: minimax/minimax-m2.7, maxTokens=16000
- repair: qwen/qwen3-coder-next, maxTokens=12000
- build-reviewer: qwen/qwen3-coder-next, maxTokens=4000

Goal:

Build an AI-native generator run for the FX derivatives family. Use the
precomputed product-scope guidance and evidence packet instead of discovering
product scope through broad search. Generate a Java Maven mapper project, run
gates, and repair failures. The shipped Java mapper runtime must not call an LLM
and must not read this agent workspace.

Runtime fixtures for this run:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml
