import { fixtureApi } from "./fixtureApi";
import { realApi } from "./realApi";

const apiMode = import.meta.env.VITE_DEMO_API_MODE;

export const demoApi = apiMode === "real" ? realApi : fixtureApi;
