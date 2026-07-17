import type {
  DemoPhase,
  DemoState,
  IntakeId,
  IntakeUploadPayload,
  StageId,
} from "../demoState/demoState";

export type DependencyMode = "live" | "cached" | "fixture";

export type ApiEnvelope<TData> = {
  success: boolean;
  message: string;
  data: TData;
  meta: {
    request_id: string;
    dependency_mode?: DependencyMode | Partial<Record<string, DependencyMode>>;
    context_version?: string;
    fallback_available?: boolean;
  };
  timestamp: string;
};

export type ApiErrorEnvelope = ApiEnvelope<null> & {
  success: false;
  error_code: string;
};

export type DashboardResponse = ApiEnvelope<{
  restaurant: { id: string; name: string };
  dependency_mode: Partial<Record<"nexla" | "zero" | "workflow_generator", DependencyMode>>;
  context: {
    context_id?: string;
    version?: string;
    source_cards: unknown[];
    last_diff: unknown[];
  } | null;
  workflow: {
    workflow_id?: string;
    status: DemoPhase | "DRAFT" | "FAILED" | "RESOLVING_CAPABILITIES";
    missing_capabilities: string[];
    bound_capabilities: unknown[];
  };
  timeline: unknown[];
  recommendation: unknown;
  metrics: {
    capabilities_resolved: number;
    workflow_runs: number;
    self_corrections: number;
    estimated_cost_savings: number;
  };
}>;

export type HealthResponse = ApiEnvelope<{
  dependency_mode: Partial<Record<"nexla" | "zero" | "workflow_generator", DependencyMode>>;
}>;

export type DemoApi = {
  mode: "fixture" | "real";
  reset(): Promise<DemoState>;
  setStage(state: DemoState, stage: StageId): Promise<DemoState>;
  updateOwnerGoal(state: DemoState, ownerGoal: string): Promise<DemoState>;
  addIntakeSample(state: DemoState, intakeId: IntakeId): Promise<DemoState>;
  addIntakeUpload(
    state: DemoState,
    intakeId: IntakeId,
    payload: IntakeUploadPayload,
  ): Promise<DemoState>;
  advance(state: DemoState): Promise<DemoState>;
};
