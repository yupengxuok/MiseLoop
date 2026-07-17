export function LearnView() {
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
          <h3>Vendor B</h3>
          <p>Vendor A rose to $2.85. Loop patched the plan automatically.</p>
        </div>
      </div>

      <div className="context-summary">
        <div>
          <span className="summary-label">New context</span>
          <strong>ctx_v002</strong>
        </div>
        <div>
          <span className="summary-label">Self corrections</span>
          <strong>1</strong>
        </div>
        <div>
          <span className="summary-label">Workflow status</span>
          <strong>PATCHED</strong>
        </div>
      </div>
    </div>
  );
}
