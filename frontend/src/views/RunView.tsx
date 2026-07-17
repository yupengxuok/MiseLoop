const timeline = [
  ["Context loaded", "Restaurant Context loaded from Nexla provider.", "complete"],
  ["Weather checked", "Rain probability is 82% for Saturday.", "complete"],
  ["Suppliers ranked", "Supplier B is first for tomatoes.", "complete"],
  ["Purchase plan drafted", "Pending manager approval before external write.", "approval"],
];

export function RunView() {
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
        <span className="status approval">Pending approval</span>
        <h3>Weekend purchase plan</h3>
        <p>Increase indoor comfort items, reduce patio-heavy prep, and switch tomato supplier.</p>
        <div className="impact-row">
          <strong>$143.50</strong>
          <span>estimated savings</span>
        </div>
      </aside>
    </div>
  );
}
