import {
  isActionDisabled,
  type DemoState,
  type IntakeId,
  type IntakeUploadPayload,
  type StageId,
} from "../lib/demoState/demoState";
import { ConnectView } from "../views/ConnectView";
import { GenerateView } from "../views/GenerateView";
import { LearnView } from "../views/LearnView";
import { ResolveView } from "../views/ResolveView";
import { RunView } from "../views/RunView";

type StageCanvasProps = {
  actionLabel: string;
  demoState: DemoState;
  kicker: string;
  onIntakeSample: (intakeId: IntakeId) => void;
  onIntakeUpload: (intakeId: IntakeId, payload: IntakeUploadPayload) => void;
  onOwnerGoalChange: (ownerGoal: string) => void;
  onPrimaryAction?: () => void;
  stage: StageId;
  title: string;
};

export function StageCanvas({
  actionLabel,
  demoState,
  kicker,
  onIntakeSample,
  onIntakeUpload,
  onOwnerGoalChange,
  onPrimaryAction,
  stage,
  title,
}: StageCanvasProps) {
  return (
    <section className="main-canvas" aria-live="polite">
      <div className="canvas-header">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <button
          className="primary-button"
          disabled={isActionDisabled(demoState.phase) || !onPrimaryAction}
          onClick={onPrimaryAction}
          type="button"
        >
          {actionLabel}
        </button>
      </div>

      {stage === "connect" && (
        <ConnectView
          demoState={demoState}
          onIntakeSample={onIntakeSample}
          onIntakeUpload={onIntakeUpload}
        />
      )}
      {stage === "generate" && (
        <GenerateView demoState={demoState} onOwnerGoalChange={onOwnerGoalChange} />
      )}
      {stage === "resolve" && <ResolveView demoState={demoState} />}
      {stage === "run" && <RunView demoState={demoState} />}
      {stage === "learn" && <LearnView demoState={demoState} />}
    </section>
  );
}
