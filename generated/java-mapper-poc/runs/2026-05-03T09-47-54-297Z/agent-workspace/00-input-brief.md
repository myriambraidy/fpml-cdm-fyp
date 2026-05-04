# Input Brief

Run id: 2026-05-03T09-47-54-297Z
Product family: fx-derivatives

Role models:
- planner: qwen/qwen3-coder-30b-a3b-instruct, maxTokens=9000
- critic: qwen/qwen3-coder-next, maxTokens=5000
- critique-reviewer: qwen/qwen3-coder-next, maxTokens=5000
- implementer: minimax/minimax-m2.7, maxTokens=16000
- repair: minimax/minimax-m2.7, maxTokens=12000
- build-reviewer: qwen/qwen3-coder-next, maxTokens=4000

Goal:

Build an AI-native generator run for the FX derivatives family. Use the
precomputed product-scope guidance and evidence packet instead of discovering
product scope through broad search. Generate a Java Maven mapper project, run
gates, and repair failures. The shipped Java mapper runtime must not call an LLM
and must not read this agent workspace.
