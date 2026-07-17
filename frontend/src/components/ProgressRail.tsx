import { STAGES, type StageId } from "../lib/demoState/demoState";

type ProgressRailProps = {
  activeStage: StageId;
  onStageChange: (stage: StageId) => void;
};

export function ProgressRail({ activeStage, onStageChange }: ProgressRailProps) {
  return (
    <nav className="progress-rail" aria-label="Demo progress">
      {STAGES.map((stage) => (
        <button
          className={[
            "step",
            activeStage === stage.id ? "active" : "",
            stage.flagged ? "blocked" : "",
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
      ))}
    </nav>
  );
}
