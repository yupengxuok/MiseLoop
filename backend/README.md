# MiseLoop Backend

FastAPI backend for the MiseLoop API v3 demo contract. It owns the restaurant context build, workflow generation, capability resolution, workflow run/rerun, dashboard state, and integration diagnostics.

## Responsibilities

- Build restaurant context from Nexla when configured, with cached/local fallback.
- Generate the weekend prep workflow through a deterministic P0 generator.
- Resolve missing workflow capabilities through Zero provider boundary logic.
- Run and rerun the workflow through a deterministic runner.
- Return dashboard-ready state for the frontend.
- Expose dependency mode metadata: `live`, `cached`, or `fixture`.

## Run Locally

From the project root:

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/api/health
```

Interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## Environment

The backend reads `.env` from the project root.

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

Nexla behavior:

- If `NEXLA_API_KEY` and resource ids are present, the provider attempts live reads.
- If live reads fail or are incomplete, it falls back to cached/local context.
- Diagnostics are surfaced through `/api/dashboard` and the context build response.

Zero behavior:

- If `ZERO_CLI_PATH` is set, it is used first.
- Otherwise the provider checks whether `zero` exists on `PATH`.
- If `ZERO_CLI_SEARCH_COMMAND_TEMPLATE` is empty, the provider only probes the CLI boundary and falls back to the fixture catalog.
- If a live command is configured and fails, the provider records the failure note and falls back without breaking the demo.

## API Endpoints

```text
GET  /api/health
POST /api/demo/reset
GET  /api/dashboard
POST /api/context/build
POST /api/context/update
POST /api/agents/generate
POST /api/workflows/{workflow_id}/resolve-capabilities
POST /api/workflows/{workflow_id}/run
POST /api/workflows/{workflow_id}/rerun
```

All successful responses use:

```json
{
  "success": true,
  "message": "Human-readable status.",
  "data": {},
  "meta": {
    "request_id": "req_example",
    "dependency_mode": {
      "nexla": "fixture"
    },
    "context_version": "ctx_v1"
  },
  "timestamp": "..."
}
```

## Main Modules

- `backend/main.py`: FastAPI route definitions.
- `backend/services/demo_store.py`: In-memory demo orchestration and dashboard state.
- `backend/services/nexla_context_provider.py`: Context build provider and Nexla diagnostics.
- `backend/context/nexla_client.py`: Nexla API client.
- `backend/services/zero_capability_provider.py`: Zero CLI boundary and fixture capability fallback.
- `backend/services/workflow_generator.py`: Deterministic workflow generator.
- `backend/services/workflow_runner.py`: Deterministic workflow run/rerun outputs.

## Tests

```powershell
cd C:\Users\yupen\Documents\MiseLoop\MiseLoop
python -m pytest
```

The smoke test covers the full P0 flow:

```text
reset -> dashboard -> context/build -> agents/generate -> resolve-capabilities -> run -> context/update -> rerun
```

## Known Gaps

- Formal Pydantic request/response models are still incomplete.
- Error responses are not yet normalized across every exception path.
- `restaurant_context` is demo-compatible but not fully normalized to the final API v3 `sales / inventory / supplier_price / external` shape.
- Workflow generation and execution are deterministic fixtures by design for demo stability.
