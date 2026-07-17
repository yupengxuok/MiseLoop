import { DependencyBadges } from "./DependencyBadges";
import type { DemoState } from "../lib/demoState/demoState";

type InspectorDrawerProps = {
  demoState: DemoState;
  isOpen: boolean;
  onToggle: () => void;
};

export function InspectorDrawer({ demoState, isOpen, onToggle }: InspectorDrawerProps) {
  const diagnostics = demoState.integrationDiagnostics;
  const nexla = diagnostics?.nexla;
  const zero = diagnostics?.zero;

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
          <h2>{demoState.responseTitle}</h2>
        </div>

        <section>
          <span className="summary-label">Demo phase</span>
          <div className="mode-stack">
            <span className="status phase">{demoState.phase}</span>
            {demoState.contextVersion && <span className="mode-pill fixture">{demoState.contextVersion}</span>}
          </div>
        </section>

        <section>
          <span className="summary-label">Dependency mode</span>
          <div className="mode-stack">
            <DependencyBadges dependencyMode={demoState.dependencyMode} />
          </div>
        </section>

        <section>
          <span className="summary-label">Sponsor integrations</span>
          <div className="integration-grid">
            <article className="integration-card">
              <div className="integration-card-top">
                <strong>Nexla ADK</strong>
                <span className={`mode-pill ${nexla?.mode ?? demoState.dependencyMode.nexla ?? "fixture"}`}>
                  {nexla?.mode ?? demoState.dependencyMode.nexla ?? "fixture"}
                </span>
              </div>
              <dl>
                <div>
                  <dt>Configured</dt>
                  <dd>{formatBoolean(nexla?.configured)}</dd>
                </div>
                <div>
                  <dt>Auth</dt>
                  <dd>{nexla?.auth_mode ?? "auto"}</dd>
                </div>
                <div>
                  <dt>Records</dt>
                  <dd>{nexla?.records_path ?? "/data_sets/{id}/samples"}</dd>
                </div>
                <div>
                  <dt>Timeout</dt>
                  <dd>{nexla?.timeout_seconds ? `${nexla.timeout_seconds}s` : "60s"}</dd>
                </div>
              </dl>
              <IntegrationNote text={nexla?.provider_note ?? nexla?.fallback} />
            </article>

            <article className="integration-card">
              <div className="integration-card-top">
                <strong>Zero</strong>
                <span className={`mode-pill ${zero?.mode ?? demoState.dependencyMode.zero ?? "fixture"}`}>
                  {zero?.mode ?? demoState.dependencyMode.zero ?? "fixture"}
                </span>
              </div>
              <dl>
                <div>
                  <dt>CLI</dt>
                  <dd>{zero?.cli_detected ? "detected" : "not found"}</dd>
                </div>
                <div>
                  <dt>Fallback</dt>
                  <dd>{zero?.fallback ?? "zero_capabilities.json"}</dd>
                </div>
                <div>
                  <dt>Ready</dt>
                  <dd>{formatBoolean(zero?.fallback_available)}</dd>
                </div>
              </dl>
              <IntegrationNote text={zero?.provider_note ?? zero?.setup_hint} />
            </article>
          </div>
        </section>

        <section>
          <span className="summary-label">Current mock response</span>
          <pre>{JSON.stringify(demoState.response, null, 2)}</pre>
        </section>
      </div>
    </aside>
  );
}

function formatBoolean(value: boolean | undefined): string {
  if (value === undefined) return "unknown";
  return value ? "yes" : "no";
}

function IntegrationNote({ text }: { text?: string | null }) {
  if (!text) return null;
  return <p className="integration-note">{text}</p>;
}
