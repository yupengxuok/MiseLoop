# MiseLoop Frontend

React + Vite frontend for the MiseLoop P0 demo. The app can run fully from local fixtures or connect to the FastAPI backend in real API mode.

## What The UI Shows

- Connect view for restaurant input.
- Restaurant Context build step.
- Workflow JSON preview.
- Blocked workflow state with missing capabilities.
- Zero capability resolution.
- Workflow run result with manager approval recommendation.
- Learn view with context diff and patched recommendation.
- Inspector drawer with dependency modes and fallback notes for Nexla and Zero.

## Run Locally

Install dependencies:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop\frontend
npm install
```

Run with local fixtures:

```powershell
npm run dev
```

Run against the backend:

```powershell
$env:VITE_DEMO_API_MODE="real"
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm run dev
```

The dev server binds to `127.0.0.1`. If `5173` is already busy, Vite will print another local port.

## Build And Typecheck

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop\frontend
npm run typecheck
npm run build
```

Preview a production build:

```powershell
npm run preview
```

## Frontend Environment

```env
VITE_DEMO_API_MODE=real
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Modes:

- unset or any value other than `real`: use fixture API.
- `real`: use FastAPI through `VITE_API_BASE_URL`.

## Main Files

- `src/App.tsx`: App shell and demo flow orchestration.
- `src/lib/api/demoApi.ts`: Chooses fixture or real API mode.
- `src/lib/api/realApi.ts`: Calls FastAPI endpoints.
- `src/lib/api/fixtureApi.ts`: Local fixture API.
- `src/lib/api/dashboardMapper.ts`: Maps backend dashboard payloads into UI state.
- `src/lib/demoState/demoState.ts`: Demo state types and fixture progression.
- `src/components/InspectorDrawer.tsx`: API payload, dependency mode, and integration diagnostics display.
- `src/views/GenerateView.tsx`: Workflow JSON preview.
- `src/views/LearnView.tsx`: Context diff and patched recommendation.

## Demo Notes

The Inspector is important for the sponsor demo because it makes fallback behavior explicit. It shows:

- Nexla mode: live, cached, or fixture.
- Zero mode: live, cached, or fixture.
- Missing environment variables or CLI setup notes.
- Whether fixture fallback is available.

This is intentional: the app should remain demo-safe even when Nexla or Zero live dependencies are unavailable.
