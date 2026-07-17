# MiseLoop

MiseLoop is an autonomous decision loop for restaurant supply chain and operations. The current repo is a P0 demo implementation of the PRD v3 / API v3 concept: connect restaurant data, build restaurant context, generate a workflow, resolve missing capabilities, run the workflow, detect a context diff, and patch the recommendation.

## What Works Now

- Frontend demo flow: Connect -> Build Context -> Generate Workflow -> Resolve Capabilities -> Run -> Learn / Patch Recommendation.
- Backend API shell with a unified success envelope: `success`, `message`, `data`, `meta`, `timestamp`.
- Real API mode from the frontend through FastAPI, with fixture fallback available.
- Nexla context adapter with live/cached/fixture diagnostics.
- Zero capability provider with CLI detection boundary and fixture fallback.
- Deterministic workflow generator and runner for a reliable hackathon demo.
- Inspector panel showing dependency modes and fallback notes for Nexla, Zero, workflow generator, and workflow runner.

## Repo Layout

```text
MiseLoop/
  backend/       FastAPI app, context providers, workflow services, Zero provider
  frontend/      React + Vite demo application
  data/          Local demo input data
  prd/           Product/API reference material
  tests/         Backend smoke test for the P0 flow
```

## Quick Start

Install Python dependencies:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop
python -m pip install -r requirements.txt
```

Install frontend dependencies:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop\frontend
npm install
```

Start the backend:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Start the frontend in real API mode:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop\frontend
$env:VITE_DEMO_API_MODE="real"
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm run dev
```

Open the Vite URL printed by the terminal, usually `http://127.0.0.1:5173`.

## Environment

Copy `.env.example` to `.env` and fill only the values you need. `.env` is ignored by git.

Important variables:

```env
NEXLA_API_KEY=
NEXLA_API_BASE=https://dataops.nexla.io/nexla-api
EXLA_API_BASE=
NEXLA_TIMEOUT_SECONDS=60
NEXLA_AUTH_MODE=auto
NEXLA_RECORDS_PATH=/data_sets/{id}/samples
NEXLA_PDF_RESOURCE_ID=
NEXLA_XLSX_RESOURCE_ID=

ZERO_CLI_PATH=
ZERO_CLI_TIMEOUT_SECONDS=12
ZERO_CLI_SEARCH_COMMAND_TEMPLATE=
```

If Nexla cannot connect, the backend falls back to cached/local fixture context. If Zero CLI is not installed or no live search command is configured, the backend falls back to the fixture capability catalog.

## API Surface

Current P0 endpoints:

- `GET /api/health`
- `POST /api/demo/reset`
- `GET /api/dashboard`
- `POST /api/context/build`
- `POST /api/context/update`
- `POST /api/agents/generate`
- `POST /api/workflows/{workflow_id}/resolve-capabilities`
- `POST /api/workflows/{workflow_id}/run`
- `POST /api/workflows/{workflow_id}/rerun`

Planned P1 endpoints:

- `GET /api/workflows/{workflow_id}/timeline`
- `POST /api/actions/{action_id}/approve`

## Verification

Backend smoke test:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop
python -m pytest
```

Frontend typecheck and production build:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop\frontend
npm run typecheck
npm run build
```

## Current PRD / API Status

P0 demo contract is mostly complete. API v3 strictness is still partial.

Known gaps:

- `restaurant_context` still uses the current demo mapping and is not fully normalized to the final `sales / inventory / supplier_price / external` document shape.
- Request/response Pydantic models and JSON schema validation are not fully formalized.
- Error envelope is not yet system-wide for all failure cases.
- Nexla live mode depends on valid environment variables and reachable resource ids.
- Zero has CLI detection and fallback, but still needs the final live resolver command contract.
- P1 timeline and approval endpoints are not implemented yet.

For a hackathon demo, the strongest path is to show the dependency modes clearly in the Inspector and keep the fixture fallback visible as intentional resilience.
