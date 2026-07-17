const capabilities = [
  {
    name: "weather_forecast",
    reason: "Rain changes patio demand and prep mix.",
  },
  {
    name: "local_event_calendar",
    reason: "Nearby events lift expected weekend foot traffic.",
  },
];

export function ResolveView() {
  return (
    <div className="stage-panel active">
      <div className="blocked-banner">
        <div>
          <span className="status blocked">Blocked</span>
          <h3>Missing capabilities detected</h3>
        </div>
        <p>weather_forecast and local_event_calendar are not in the local registry.</p>
      </div>
      <div className="resolve-grid">
        {capabilities.map((capability) => (
          <article className="capability-row" key={capability.name}>
            <div>
              <span className="mode-pill live">Zero</span>
              <h3>{capability.name}</h3>
              <p>{capability.reason}</p>
            </div>
            <span className="status ready">Passed</span>
          </article>
        ))}
      </div>
    </div>
  );
}
