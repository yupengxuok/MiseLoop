

from __future__ import annotations

_ITEM_ALIASES: dict[str, str] = {
    "nordic fjord king salmon": "salmon",
    "atlantic salmon fillet": "salmon",
    "salmon": "salmon",
}

_SUPPLIER_ALIASES: dict[str, str] = {
    "sunny farm organic produce": "Sunny Farm",
    "sunny farm": "Sunny Farm",
    "bay produce": "Bay Produce",
    "bay produce co": "Bay Produce",
}


def _norm(raw: str) -> str:
   
    return " ".join(raw.split()).lower()


def _resolve(raw: str, table: dict[str, str]) -> dict:
 
    if not raw or not str(raw).strip():
        return {"raw": raw, "canonical": raw, "entity_resolved": False}
    canonical = table.get(_norm(raw))
    if canonical is None:
       
        return {"raw": raw, "canonical": raw, "entity_resolved": False}
    return {"raw": raw, "canonical": canonical, "entity_resolved": True}


def resolve_item(raw: str) -> dict:

    return _resolve(raw, _ITEM_ALIASES)


def resolve_supplier(raw: str) -> dict:
 
    return _resolve(raw, _SUPPLIER_ALIASES)
