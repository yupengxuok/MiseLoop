import type { DemoState, RunTimelineItem } from "../lib/demoState/demoState";

type RunViewProps = {
  demoState: DemoState;
};

function getTimelineClass(status: RunTimelineItem["status"]) {
  if (status === "PENDING_APPROVAL") return "approval";
  if (status === "COMPLETED") return "complete";
  return "pending";
}

export function RunView({ demoState }: RunViewProps) {
  const completed =
    demoState.phase === "COMPLETED_WITH_RECOMMENDATION" ||
    demoState.phase === "PATCHED_RECOMMENDATION";
  const recommendation = demoState.recommendation;

  return (
    <div className="stage-panel active run-panel">
      <section className="run-timeline-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Execution timeline</p>
            <h3>{completed ? "Workflow completed" : "Ready to execute validated steps"}</h3>
          </div>
          <span className={completed ? "status ready" : "status approval"}>
            {completed ? "COMPLETED" : "READY"}
          </span>
        </div>

        <div className="timeline">
          {demoState.runTimeline.map((item) => (
            <div className={`timeline-item ${getTimelineClass(item.status)}`} key={item.id}>
              <span />
              <div>
                <div className="timeline-item-top">
                  <strong>{item.label}</strong>
                  <small>{item.status}</small>
                </div>
                <p>{item.summary}</p>
                <em>{item.evidence}</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="recommendation">
        <span className={completed ? "status approval" : "status ready"}>
          {completed ? "Pending approval" : "Recommendation not created"}
        </span>
        <h3>{recommendation.title}</h3>
        <p>{recommendation.summary}</p>

        <div className="impact-grid">
          <div className="impact-row">
            <strong>${recommendation.expectedImpact.estimatedCostSavings.toFixed(2)}</strong>
            <span>estimated savings</span>
          </div>
          <div className="impact-row">
            <strong>{Math.round(recommendation.expectedImpact.stockoutRiskReduction * 100)}%</strong>
            <span>stockout risk reduction</span>
          </div>
          <div className="impact-row">
            <strong>{Math.round(recommendation.expectedImpact.prepWasteReduction * 100)}%</strong>
            <span>prep waste reduction</span>
          </div>
        </div>

        <div className="plan-list">
          {recommendation.planItems.map((item) => (
            <article className="plan-item" key={item.item}>
              <strong>{item.item}</strong>
              <span>{item.action}</span>
              <p>{item.reason}</p>
            </article>
          ))}
        </div>

        <div className="approval-gate">
          <span className="summary-label">Approval policy</span>
          <strong>{recommendation.approvalStatus}</strong>
          <p>Purchase order remains recommendation only; no supplier write is executed in P0.</p>
        </div>
      </aside>
    </div>
  );
}
