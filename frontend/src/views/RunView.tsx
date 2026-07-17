import type { DemoPhase } from "../lib/demoState/demoState";

const timeline = [
  ["Context loaded", "Restaurant Context loaded from Nexla provider.", "complete"],
  ["Weather checked", "Rain probability is 82% for Saturday.", "complete"],
  ["Suppliers ranked", "Supplier B is first for tomatoes.", "complete"],
  ["Purchase plan drafted", "Pending manager approval before external write.", "approval"],
];

type RunViewProps = {
  phase: DemoPhase;
};

export function RunView({ phase }: RunViewProps) {
  const completed = phase === "COMPLETED_WITH_RECOMMENDATION" || phase === "PATCHED_RECOMMENDATION";

  return (
    <div className="stage-panel active run-panel">
      <div className="timeline">
        {timeline.map(([title, copy, state]) => (
          <div className={`timeline-item ${state}`} key={title}>
            <span />
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          </div>
        ))}
      </div>

      <aside className="recommendation">
        <span className={completed ? "status approval" : "status ready"}>
          {completed ? "Pending approval" : "Ready to run"}
        </span>
        <h3>Weekend purchase plan</h3>
        <p>Increase indoor comfort items, reduce patio-heavy prep, and switch tomato supplier.</p>
        <div className="impact-row">
          <strong>{completed ? "$143.50" : "$0.00"}</strong>
          <span>estimated savings</span>
        </div>
      </aside>
    </div>
  );
}
