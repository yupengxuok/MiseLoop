const steps = [
  { label: "Load Nexla Restaurant Context", state: "done" },
  { label: "Check weather forecast", state: "blocked" },
  { label: "Check local event calendar", state: "blocked" },
  { label: "Rank suppliers", state: "" },
  { label: "Draft purchase plan", state: "" },
];

export function GenerateView() {
  return (
    <div className="stage-panel active">
      <div className="goal-box">
        <span className="status ready">Owner goal</span>
        <h3>Create a weekend prep agent for this Friday.</h3>
        <p>Recommendation only for purchase orders. Manager approval required for external writes.</p>
      </div>
      <div className="workflow-list">
        {steps.map((step) => (
          <div className={["workflow-step", step.state].filter(Boolean).join(" ")} key={step.label}>
            <span />
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
