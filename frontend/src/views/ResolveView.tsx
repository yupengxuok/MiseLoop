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

type ResolveViewProps = {
  phase: DemoPhase;
};

export function ResolveView({ phase }: ResolveViewProps) {
  const resolved = ["READY", "RUNNING", "COMPLETED_WITH_RECOMMENDATION", "PATCHED_RECOMMENDATION"].includes(
    phase,
  );

  return (
    <div className="stage-panel active">
      <div className="blocked-banner">
        <div>
          <span className={resolved ? "status ready" : "status blocked"}>
            {resolved ? "Ready" : "Blocked"}
          </span>
          <h3>{resolved ? "Capabilities bound by Zero" : "Missing capabilities detected"}</h3>
        </div>
        <p>
          {resolved
            ? "weather_forecast and local_event_calendar passed sample validation."
            : "weather_forecast and local_event_calendar are not in the local registry."}
        </p>
      </div>
      <div className="resolve-grid">
        {capabilities.map((capability) => (
          <article className="capability-row" key={capability.name}>
            <div>
              <span className="mode-pill live">Zero</span>
              <h3>{capability.name}</h3>
              <p>{capability.reason}</p>
            </div>
            <span className={resolved ? "status ready" : "status approval"}>
              {resolved ? "Passed" : "Pending"}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
import type { DemoPhase } from "../lib/demoState/demoState";
