import { useState } from "react";
import { InspectorDrawer } from "./components/InspectorDrawer";
import { ProgressRail } from "./components/ProgressRail";
import { Sidebar } from "./components/Sidebar";
import { StageCanvas } from "./components/StageCanvas";
import { STAGE_COPY, type StageId } from "./lib/demoState/demoState";

export function App() {
  const [stage, setStage] = useState<StageId>("connect");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const copy = STAGE_COPY[stage];

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">MiseLoop Demo Kitchen</p>
            <h1>Weekend Prep Agent</h1>
          </div>
          <div className="topbar-actions">
            <span className="mode-pill live">Zero live</span>
            <span className="mode-pill fixture">Nexla fixture</span>
            <button className="ghost-button" type="button">
              Reset
            </button>
          </div>
        </header>

        <ProgressRail activeStage={stage} onStageChange={setStage} />

        <section className={inspectorOpen ? "content-grid inspector-open" : "content-grid"}>
          <StageCanvas
            actionLabel={copy.action}
            kicker={copy.kicker}
            stage={stage}
            title={copy.title}
          />
          <InspectorDrawer
            isOpen={inspectorOpen}
            onToggle={() => setInspectorOpen((current) => !current)}
          />
        </section>
      </section>
    </main>
  );
}
