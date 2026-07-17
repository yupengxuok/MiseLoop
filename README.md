# MiseLoop

MiseLoop is an autonomous decision loop for restaurant supply chain and operations.

Restaurants make hundreds of tiny operational decisions every week: what to prep, what to buy, when to switch suppliers, whether weather or local events will change demand, and how to react when prices move. Most of those decisions are trapped between messy receipts, spreadsheets, manager instinct, and tools that do not talk to each other.

MiseLoop turns that chaos into a live operating loop. It connects restaurant data, builds a structured Restaurant Context, generates an agent workflow, resolves missing capabilities, runs the workflow, watches for context changes, and patches the recommendation when the world changes. The demo focuses on one very real moment: Friday weekend prep, supplier price movement, and a manager-ready recommendation.

## Why It Matters

Restaurant operators do not need another dashboard that waits to be interpreted. They need a system that notices the meaningful change, understands the business context, and brings back an action with evidence.

MiseLoop is designed around that idea:

- Context first: raw restaurant inputs become an operational memory layer.
- Agentic workflows: the system generates the steps needed to make a decision, not just a static report.
- Capability resolution: if the workflow needs weather, events, supplier lookup, or another service, it can identify and bind that missing capability.
- Human approval: external writes and purchase decisions stay manager-controlled.
- Learning loop: when supplier prices or context change, the workflow reruns and explains the diff.

The result is a restaurant operations copilot that feels less like software you operate and more like a loop that keeps the business awake.

## Demo Flow

```text
Connect restaurant data
  -> Build Restaurant Context
  -> Generate weekend prep workflow
  -> Detect missing capabilities
  -> Resolve capabilities through Zero
  -> Run workflow
  -> Produce recommendation
  -> Detect supplier price change
  -> Rerun and patch recommendation
```

The frontend shows this as a guided product demo, while the backend exposes the API v3-style endpoints behind the flow.

## Sponsor Tools

MiseLoop uses sponsor tools where they make the product stronger, not just as stickers on the stack.

- Nexla: powers the context ingestion layer. MiseLoop attempts to read restaurant source data through Nexla, then surfaces whether the context came from live, cached, or fixture mode. This makes the data layer demo-safe while still showing a path to real data operations.
- Zero: powers capability discovery and binding. The backend includes a Zero CLI detection boundary and a live resolver hook, then falls back to a fixture capability catalog when the live resolver is unavailable. This keeps the agent workflow resilient while showing how missing services can be discovered at runtime.
- LLM providers: the architecture supports Claude, OpenAI, and Gemini configuration for future live workflow generation. The P0 demo currently uses a deterministic generator so the main demo path stays reliable.

The Inspector panel makes these dependency modes visible during the demo: `live`, `cached`, or `fixture`, with fallback notes. That transparency is intentional. Real operations systems need graceful degradation, not mystery failures.

## What Works Now

- Frontend demo flow from connect to patched recommendation.
- Backend FastAPI shell with API v3-style response envelopes.
- Real API mode from the frontend through FastAPI.
- Fixture mode for local-only demos.
- Nexla adapter with live/cached/fixture diagnostics.
- Zero provider with CLI detection boundary and fixture fallback.
- Deterministic workflow generator and runner for a stable P0 demo.
- Context diff and recommendation update in the Learn step.

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
