import type { DemoState } from "../lib/demoState/demoState";

type LearnViewProps = {
  demoState: DemoState;
};

export function LearnView({ demoState }: LearnViewProps) {
  const patched = demoState.phase === "PATCHED_RECOMMENDATION";

  return (
    <div className="stage-panel active">
      <div className="diff-view">
        <div className="diff-column">
          <span className="summary-label">Before</span>
          <h3>Vendor A</h3>
          <p>Tomatoes at $2.10, reliable 2-day delivery.</p>
        </div>
        <div className="diff-arrow">to</div>
        <div className="diff-column after">
          <span className="summary-label">After</span>
          <h3>{patched ? "Vendor B" : "Waiting for update"}</h3>
          <p>
            {patched
              ? "Vendor A rose to $2.85. Loop patched the plan automatically."
              : "Apply a supplier price update to trigger the rerun and recommendation diff."}
          </p>
        </div>
      </div>

      <div className="context-summary">
        <div>
          <span className="summary-label">New context</span>
          <strong>{demoState.contextVersion ?? "ctx_v001"}</strong>
        </div>
        <div>
          <span className="summary-label">Self corrections</span>
          <strong>{demoState.metrics.selfCorrections}</strong>
        </div>
        <div>
          <span className="summary-label">Workflow status</span>
          <strong>{patched ? "PATCHED" : demoState.phase}</strong>
        </div>
      </div>
    </div>
  );
}
