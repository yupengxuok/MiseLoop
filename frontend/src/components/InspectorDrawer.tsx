type InspectorDrawerProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function InspectorDrawer({ isOpen, onToggle }: InspectorDrawerProps) {
  return (
    <aside className={isOpen ? "inspector" : "inspector collapsed"}>
      <button
        aria-expanded={isOpen}
        className="inspector-toggle"
        onClick={onToggle}
        type="button"
      >
        Inspector
      </button>
      <div className="inspector-content">
        <div className="inspector-header">
          <p className="eyebrow">Runtime evidence</p>
          <h2>Bound capability</h2>
        </div>

        <section>
          <span className="summary-label">Dependency mode</span>
          <div className="mode-stack">
            <span className="mode-pill live">Zero live</span>
            <span className="mode-pill fixture">Nexla fixture</span>
          </div>
        </section>

        <section>
          <span className="summary-label">Sample output</span>
          <pre>{`{
  "rain_probability": 82,
  "temperature_f": 58,
  "validation_status": "PASSED"
}`}</pre>
        </section>

        <section>
          <span className="summary-label">Output schema</span>
          <pre>{`{
  "rain_probability": "number",
  "temperature_f": "number"
}`}</pre>
        </section>
      </div>
    </aside>
  );
}
