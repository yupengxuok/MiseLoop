const intakeItems = [
  { label: "Files", detail: "CSV, XLSX, PDF", status: "Ready" },
  { label: "Email", detail: "Vendor update", status: "Parsed" },
  { label: "Receipt Photo", detail: "Invoice image", status: "Mapped" },
  { label: "Voice Note", detail: "Manager note", status: "Queued" },
];

const sources = [
  {
    icon: "S",
    tone: "tomato",
    title: "Sales last year",
    copy: "Weekend item demand, daypart patterns, comparable period.",
    fields: "8 fields",
    freshness: "Fresh 10:00 AM",
  },
  {
    icon: "I",
    tone: "green",
    title: "Inventory",
    copy: "On-hand stock, reorder threshold, spoilage risk.",
    fields: "7 fields",
    freshness: "Fresh 10:05 AM",
  },
  {
    icon: "P",
    tone: "amber",
    title: "Supplier prices",
    copy: "Delivery speed, reliability, certifications, item price.",
    fields: "6 fields",
    freshness: "Fresh 10:10 AM",
  },
];

export function ConnectView() {
  return (
    <div className="stage-panel active">
      <div className="intake-tray">
        {intakeItems.map((item) => (
          <article className="intake-chip" key={item.label}>
            <span className="status mapped">{item.status}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="source-grid">
        {sources.map((source) => (
          <article className="source-card" key={source.title}>
            <div className="source-top">
              <span className={`source-icon ${source.tone}`}>{source.icon}</span>
              <span className="status mapped">Mapped</span>
            </div>
            <h3>{source.title}</h3>
            <p>{source.copy}</p>
            <div className="metric-row">
              <strong>{source.fields}</strong>
              <span>{source.freshness}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="context-summary">
        <div>
          <span className="summary-label">Context version</span>
          <strong>ctx_v001</strong>
        </div>
        <div>
          <span className="summary-label">Normalized records</span>
          <strong>1,654</strong>
        </div>
        <div>
          <span className="summary-label">Demo confidence</span>
          <strong>Stable fallback</strong>
        </div>
      </div>
    </div>
  );
}
