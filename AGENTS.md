All agents must follow the rules below:

1. **Plan-First Workflow**  
   Before performing any action, the agent must generate an explicit plan.  
   The plan must clearly describe the intended steps, the reasoning behind them, and any assumptions or dependencies.  
   The agent may not execute the task until the plan is fully produced.

2. **Reference to `docs/`**  
   Whenever additional context, specifications, or definitions are required, the agent must consult the relevant materials under the `docs/` directory.  
   Any referenced documents should be explicitly mentioned in the plan.

3. **Execution After Planning**  
   After producing the plan, the agent proceeds to execution.  
   Execution must follow the planned steps, and any deviations must be justified.

4. **Output Format**  
   All outputs must be written in Markdown unless otherwise specified.
