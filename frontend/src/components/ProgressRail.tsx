import { getStageStatus, STAGES, type DemoPhase, type StageId } from "../lib/demoState/demoState";

type ProgressRailProps = {
  activeStage: StageId;
  demoPhase: DemoPhase;
  onStageChange: (stage: StageId) => void;
};

export function ProgressRail({ activeStage, demoPhase, onStageChange }: ProgressRailProps) {
  return (
    <nav className="progress-rail" aria-label="Demo progress">
      {STAGES.map((stage) => {
        const status = getStageStatus(demoPhase, stage.id);
        return (
          <button
            className={[
              "step",
              activeStage === stage.id ? "active" : "",
              status === "complete" ? "complete" : "",
              status === "blocked" ? "blocked" : "",
              status === "pending" ? "pending" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={stage.id}
            onClick={() => onStageChange(stage.id)}
            type="button"
          >
            <span>{stage.number}</span>
            {stage.label}
          </button>
        );
      })}
    </nav>
  );
}
