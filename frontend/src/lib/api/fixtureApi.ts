import {
  advanceDemoState,
  addIntakeSource,
  addUploadedIntakeSource,
  createInitialDemoState,
  resetDemoState,
  setDemoStage,
  updateOwnerGoal,
} from "../demoState/demoState";
import type { DemoApi } from "./contracts";

function withTimestamp<TState extends { response: unknown }>(state: TState): TState {
  if (!state.response || typeof state.response !== "object" || Array.isArray(state.response)) {
    return state;
  }

  return {
    ...state,
    response: {
      ...state.response,
      timestamp: new Date().toISOString(),
    },
  };
}

export const fixtureApi: DemoApi = {
  mode: "fixture",
  async reset() {
    return withTimestamp(resetDemoState());
  },
  async setStage(state, stage) {
    return setDemoStage(state, stage);
  },
  async updateOwnerGoal(state, ownerGoal) {
    return withTimestamp(updateOwnerGoal(state, ownerGoal));
  },
  async addIntakeSample(state, intakeId) {
    return withTimestamp(addIntakeSource(state, intakeId));
  },
  async addIntakeUpload(state, intakeId, payload) {
    return withTimestamp(addUploadedIntakeSource(state, intakeId, payload));
  },
  async advance(state) {
    return withTimestamp(advanceDemoState(state));
  },
};

export function createFixtureInitialState() {
  return withTimestamp(createInitialDemoState());
}
