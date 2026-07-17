"""Thin adapter around the existing Nexla-backed context builder."""

from __future__ import annotations

import json
import os
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.context.nexla_client import load_dotenv


DEFAULT_CONTEXT_ID = "ctx_001"
DEFAULT_CONTEXT_VERSION = "ctx_v001"


class NexlaContextProvider:
    """Return API-v3 context data without changing the context package.

    The provider first delegates to ``backend.context.build_context``. If local
    dependencies or Nexla configuration are not available, it uses the last
    generated context file as a cached response so the demo API stays runnable.
    """

    def __init__(self, output_path: str | Path | None = None) -> None:
        backend_root = Path(__file__).resolve().parents[1]
        self.output_path = Path(output_path or backend_root / "output" / "restaurant_context.json")

    def diagnostics(self) -> dict[str, Any]:
        load_dotenv()
        configured = {
            "api_key": bool(os.getenv("NEXLA_API_KEY")),
            "api_base": bool(os.getenv("NEXLA_API_BASE") or os.getenv("EXLA_API_BASE")),
            "pdf_resource_id": bool(os.getenv("NEXLA_PDF_RESOURCE_ID")),
            "xlsx_resource_id": bool(os.getenv("NEXLA_XLSX_RESOURCE_ID")),
        }
        return {
            "configured": all(configured.values()),
            "configured_parts": configured,
            "auth_mode": os.getenv("NEXLA_AUTH_MODE", "auto"),
            "records_path": os.getenv("NEXLA_RECORDS_PATH", "/data_sets/{id}/samples"),
            "timeout_seconds": float(os.getenv("NEXLA_TIMEOUT_SECONDS", "60")),
            "fallback": "cached context file, then deterministic fixture",
            "cached_context_available": self.output_path.exists(),
        }

    def build(self, requested_sources: list[dict[str, Any]] | None = None) -> dict[str, Any]:
        try:
            from backend.context import build_context

            context = build_context(write=True)
            mode = self._mode_from_context(context)
            note = None
        except Exception as exc:
            context = self._load_cached_context()
            if context is None:
                context = self._fixture_context(requested_sources)
                mode = "fixture"
                note = f"Nexla context unavailable; using fixture context: {exc!r}"
            else:
                mode = "cached"
                note = f"Nexla context unavailable; using cached context file: {exc!r}"

        return self._to_api_context(context, mode=mode, note=note)

    def _load_cached_context(self) -> dict[str, Any] | None:
        if not self.output_path.exists():
            return None
        return json.loads(self.output_path.read_text(encoding="utf-8"))

    def _to_api_context(
        self,
        context: dict[str, Any],
        *,
        mode: str,
        note: str | None,
    ) -> dict[str, Any]:
        generated_at = context.get("generated_at") or datetime.now(timezone.utc).isoformat()
        line_items = context.get("line_items", [])
        source_cards = self._source_cards(line_items, generated_at, context.get("validation", {}))
        freshness = {
            card["source_id"]: card["freshness"]
            for card in source_cards
        }

        return {
            "context_id": DEFAULT_CONTEXT_ID,
            "context_version": DEFAULT_CONTEXT_VERSION,
            "freshness": freshness,
            "restaurant_context": {
                "line_items": line_items,
                "validation": context.get("validation", {}),
                "extraction": context.get("extraction", {}),
                "external": {},
            },
            "source_cards": source_cards,
            "dependency_mode": {"nexla": mode},
            "provider_note": note,
            "integration_diagnostics": {"nexla": self.diagnostics()},
        }

    def _source_cards(
        self,
        line_items: list[dict[str, Any]],
        generated_at: str,
        validation: dict[str, Any],
    ) -> list[dict[str, Any]]:
        grouped: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
        for item in line_items:
            source_id = str(item.get("source_file") or "unknown_source")
            source_type = str(item.get("source_type") or "unknown")
            grouped[(source_type, source_id)].append(item)

        cards = []
        clean = bool(validation.get("clean", True))
        for (source_type, source_id), items in sorted(grouped.items()):
            backend_modes = sorted(
                {
                    str(item.get("extraction_backend"))
                    for item in items
                    if item.get("extraction_backend")
                }
            )
            cards.append(
                {
                    "type": source_type,
                    "source_id": source_id,
                    "status": "MAPPED" if clean else "NEEDS_REVIEW",
                    "mapped_fields": self._mapped_field_count(items),
                    "normalized_context_field": "restaurant_context.line_items",
                    "freshness": generated_at,
                    "line_items": len(items),
                    "extraction_backend": backend_modes[0] if len(backend_modes) == 1 else backend_modes,
                }
            )

        if cards:
            return cards

        return [
            {
                "type": "restaurant_context",
                "source_id": "empty_context",
                "status": "NEEDS_REVIEW",
                "mapped_fields": 0,
                "normalized_context_field": "restaurant_context.line_items",
                "freshness": generated_at,
                "line_items": 0,
                "extraction_backend": None,
            }
        ]

    def _mapped_field_count(self, items: list[dict[str, Any]]) -> int:
        if not items:
            return 0
        ignored = {"checks"}
        keys = {key for item in items for key, value in item.items() if value is not None}
        return len(keys - ignored)

    def _mode_from_context(self, context: dict[str, Any]) -> str:
        extraction = context.get("extraction", {})
        backends = [
            source.get("backend")
            for source in extraction.values()
            if isinstance(source, dict) and source.get("backend")
        ]
        if backends and all(backend == "nexla" for backend in backends):
            return "live"
        if any(backend == "nexla" for backend in backends):
            return "cached"
        return "fixture"

    def _fixture_context(self, requested_sources: list[dict[str, Any]] | None) -> dict[str, Any]:
        source_names = [source.get("source_id", source.get("type", "fixture")) for source in requested_sources or []]
        generated_at = datetime.now(timezone.utc).isoformat()
        return {
            "generated_at": generated_at,
            "source_files": source_names or ["fixture_context"],
            "extraction": {
                "fixture": {
                    "backend": "fixture",
                    "note": "Deterministic fallback context.",
                }
            },
            "line_items": [],
            "validation": {
                "total_line_items": 0,
                "unresolved_items": [],
                "unresolved_suppliers": [],
                "unresolved_grades": [],
                "total_check_failures": [],
                "clean": True,
            },
        }
