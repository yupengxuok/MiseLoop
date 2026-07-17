"""Zero capability provider boundary.

P0 uses a fixture catalog with the same shape the API needs from Zero. A later
Zero CLI adapter can replace the catalog lookup without changing the store or
API contract.
"""

from __future__ import annotations

import json
import os
import shutil
import shlex
import subprocess
from copy import deepcopy
from pathlib import Path
from typing import Any

from backend.context.nexla_client import load_dotenv


class ZeroCapabilityProvider:
    def __init__(self, catalog_path: str | Path | None = None) -> None:
        backend_root = Path(__file__).resolve().parents[1]
        self.catalog_path = Path(
            catalog_path or backend_root / "data" / "fixtures" / "zero_capabilities.json"
        )
        self.last_cli_attempt: dict[str, Any] | None = None

    def diagnostics(self) -> dict[str, Any]:
        load_dotenv()
        cli_path = os.getenv("ZERO_CLI_PATH") or shutil.which("zero")
        return {
            "cli_detected": bool(cli_path),
            "cli_path": cli_path,
            "cli_timeout_seconds": float(os.getenv("ZERO_CLI_TIMEOUT_SECONDS", "12")),
            "live_search_configured": bool(os.getenv("ZERO_CLI_SEARCH_COMMAND_TEMPLATE")),
            "last_cli_attempt": deepcopy(self.last_cli_attempt),
            "setup_hint": "npm i -g @zeroxyz/cli; zero init; zero auth login",
            "fallback": str(self.catalog_path.name),
            "fallback_available": self.catalog_path.exists(),
        }

    def search(self, requirement: dict[str, Any] | str) -> list[dict[str, Any]]:
        name = requirement if isinstance(requirement, str) else requirement.get("name")
        if not name:
            return []
        live_candidates = self._search_zero_cli(name)
        if live_candidates:
            return live_candidates
        return [
            deepcopy(capability)
            for capability in self._load_catalog()
            if capability.get("name") == name
        ]

    def sample_test(self, capability: dict[str, Any]) -> dict[str, Any]:
        sample_output = deepcopy(capability.get("sample_output") or {})
        output_schema = capability.get("output_schema") or {}
        missing_fields = [
            field for field in output_schema if field not in sample_output
        ]
        validation_status = "FAILED" if missing_fields else "PASSED"
        return {
            "capability": capability.get("name"),
            "provider": capability.get("provider", "fixture"),
            "capability_id": capability.get("capability_id"),
            "validation_status": validation_status,
            "sample_input": deepcopy(capability.get("sample_input") or {}),
            "sample_output": sample_output,
            "input_schema": deepcopy(capability.get("input_schema") or {}),
            "output_schema": deepcopy(output_schema),
            "missing_output_fields": missing_fields,
            "source": "zero_capabilities.json",
        }

    def bind(self, workflow: dict[str, Any], capability: dict[str, Any]) -> dict[str, Any]:
        bound_workflow = deepcopy(workflow)
        capability_name = capability.get("name")
        for step in bound_workflow.get("steps", []):
            if step.get("type") == "capability" and step.get("capability") == capability_name:
                step["provider"] = capability.get("provider", "fixture")
                step["capability_id"] = capability.get("capability_id")
                step["validation_status"] = "PASSED"
        return bound_workflow

    def resolve_workflow(
        self,
        workflow_id: str,
        workflow: dict[str, Any],
        requirements: list[dict[str, Any] | str],
    ) -> dict[str, Any]:
        resolution_events = []
        bound_capabilities = []
        bound_workflow = deepcopy(workflow)

        for requirement in requirements:
            candidates = self.search(requirement)
            if not candidates:
                resolution_events.append(self._missing_event(requirement))
                continue

            capability = candidates[0]
            event = self.sample_test(capability)
            resolution_events.append(event)
            if event["validation_status"] != "PASSED":
                continue

            bound_workflow = self.bind(bound_workflow, capability)
            bound_capabilities.append(
                {
                    "name": capability["name"],
                    "provider": capability.get("provider", "fixture"),
                    "capability_id": capability["capability_id"],
                    "input_schema": deepcopy(capability.get("input_schema") or {}),
                    "output_schema": deepcopy(capability.get("output_schema") or {}),
                    "validation_status": event["validation_status"],
                    "sample_result": deepcopy(event["sample_output"]),
                    "source": "zero_capabilities.json",
                }
            )

        status_after = "READY" if len(bound_capabilities) == len(requirements) else "BLOCKED"
        return {
            "workflow_id": workflow_id,
            "status_before": "BLOCKED",
            "status_after": status_after,
            "resolution_events": resolution_events,
            "bound_capabilities": bound_capabilities,
            "bound_workflow": bound_workflow,
            "dependency_mode": {"zero": self._dependency_mode(bound_capabilities)},
            "provider_note": self._provider_note(),
            "integration_diagnostics": {"zero": self.diagnostics()},
        }

    def _load_catalog(self) -> list[dict[str, Any]]:
        data = json.loads(self.catalog_path.read_text(encoding="utf-8"))
        return data.get("capabilities", [])

    def _dependency_mode(self, capabilities: list[dict[str, Any]]) -> str:
        if capabilities and all(capability.get("provider") == "zero" for capability in capabilities):
            return "live"
        return "fixture"

    def _provider_note(self) -> str:
        diagnostics = self.diagnostics()
        last_attempt = diagnostics.get("last_cli_attempt") or {}
        if last_attempt.get("status") == "succeeded":
            return "Zero CLI live search succeeded; bound returned capability payload."
        if diagnostics["cli_detected"]:
            reason = last_attempt.get("reason") or "live search command is not configured"
            return f"Zero CLI detected, but live search fell back to fixture catalog: {reason}."
        return "Zero CLI not detected; using zero_capabilities.json fixture catalog."

    def _search_zero_cli(self, capability_name: str) -> list[dict[str, Any]] | None:
        load_dotenv()
        cli_path = os.getenv("ZERO_CLI_PATH") or shutil.which("zero")
        if not cli_path:
            self.last_cli_attempt = {
                "capability": capability_name,
                "status": "skipped",
                "reason": "zero CLI not detected",
            }
            return None

        command_template = os.getenv("ZERO_CLI_SEARCH_COMMAND_TEMPLATE")
        timeout = float(os.getenv("ZERO_CLI_TIMEOUT_SECONDS", "12"))
        if not command_template:
            self.last_cli_attempt = self._probe_zero_cli(cli_path, capability_name, timeout)
            return None

        command = shlex.split(command_template.format(query=capability_name))
        if command and command[0] == "zero":
            command[0] = cli_path
        try:
            completed = subprocess.run(
                command,
                capture_output=True,
                check=False,
                text=True,
                timeout=timeout,
            )
        except Exception as exc:
            self.last_cli_attempt = {
                "capability": capability_name,
                "status": "failed",
                "reason": f"{type(exc).__name__}: {exc}",
            }
            return None

        if completed.returncode != 0:
            self.last_cli_attempt = {
                "capability": capability_name,
                "status": "failed",
                "reason": completed.stderr.strip() or f"exit {completed.returncode}",
            }
            return None

        try:
            payload = json.loads(completed.stdout)
        except json.JSONDecodeError as exc:
            self.last_cli_attempt = {
                "capability": capability_name,
                "status": "failed",
                "reason": f"non-json output: {exc}",
            }
            return None

        candidates = payload if isinstance(payload, list) else payload.get("capabilities", [])
        if not isinstance(candidates, list):
            self.last_cli_attempt = {
                "capability": capability_name,
                "status": "failed",
                "reason": "json output did not contain a capabilities list",
            }
            return None

        normalized = [self._normalize_cli_capability(candidate, capability_name) for candidate in candidates]
        self.last_cli_attempt = {
            "capability": capability_name,
            "status": "succeeded",
            "reason": f"{len(normalized)} candidate(s) returned",
        }
        return normalized

    def _probe_zero_cli(
        self,
        cli_path: str,
        capability_name: str,
        timeout: float,
    ) -> dict[str, Any]:
        try:
            completed = subprocess.run(
                [cli_path, "--help"],
                capture_output=True,
                check=False,
                text=True,
                timeout=timeout,
            )
        except Exception as exc:
            return {
                "capability": capability_name,
                "status": "failed",
                "reason": f"{type(exc).__name__}: {exc}",
            }
        return {
            "capability": capability_name,
            "status": "probed",
            "reason": "CLI responded; set ZERO_CLI_SEARCH_COMMAND_TEMPLATE to enable live search"
            if completed.returncode == 0
            else completed.stderr.strip() or f"exit {completed.returncode}",
        }

    def _normalize_cli_capability(
        self,
        candidate: dict[str, Any],
        capability_name: str,
    ) -> dict[str, Any]:
        return {
            "name": candidate.get("name") or capability_name,
            "provider": "zero",
            "capability_id": candidate.get("capability_id") or candidate.get("id") or capability_name,
            "input_schema": deepcopy(candidate.get("input_schema") or {}),
            "output_schema": deepcopy(candidate.get("output_schema") or {}),
            "sample_input": deepcopy(candidate.get("sample_input") or {}),
            "sample_output": deepcopy(candidate.get("sample_output") or candidate.get("sample_result") or {}),
        }

    def _missing_event(self, requirement: dict[str, Any] | str) -> dict[str, Any]:
        name = requirement if isinstance(requirement, str) else requirement.get("name")
        return {
            "capability": name,
            "provider": "fixture",
            "capability_id": None,
            "validation_status": "FAILED",
            "sample_output": {},
            "input_schema": {},
            "output_schema": {},
            "missing_output_fields": [],
            "source": "zero_capabilities.json",
        }
