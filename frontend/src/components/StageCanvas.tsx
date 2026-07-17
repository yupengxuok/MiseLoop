import type { StageId } from "../lib/demoState/demoState";
import { ConnectView } from "../views/ConnectView";
import { GenerateView } from "../views/GenerateView";
import { LearnView } from "../views/LearnView";
import { ResolveView } from "../views/ResolveView";
import { RunView } from "../views/RunView";

type StageCanvasProps = {
  actionLabel: string;
  kicker: string;
  stage: StageId;
  title: string;
};

export function StageCanvas({ actionLabel, kicker, stage, title }: StageCanvasProps) {
  return (
    <section className="main-canvas" aria-live="polite">
      <div className="canvas-header">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <button className="primary-button" type="button">
          {actionLabel}
        </button>
      </div>

      {stage === "connect" && <ConnectView />}
      {stage === "generate" && <GenerateView />}
      {stage === "resolve" && <ResolveView />}
      {stage === "run" && <RunView />}
      {stage === "learn" && <LearnView />}
    </section>
  );
}
