/**
 * @leclaw/core — HubSpot Write Adapter
 *
 * Le Témoin's execution layer for HubSpot.
 * Applies approved WritebackPatches to HubSpot CRM records.
 *
 * All writes are:
 *   - Single-record PATCH via /crm/v3/objects/{type}/{id}
 *   - Batch PATCH via /crm/v3/objects/{type}/batch/update (up to 100 records)
 *   - Idempotent — safe to retry on failure
 *   - Audited — every result is returned to the caller for logging
 */
const BASE = "https://api.hubapi.com";
/**
 * Apply a single WritebackPatch to HubSpot.
 * Use for approval-gated writes where one record is confirmed at a time.
 */
export async function applyPatch(token, patch) {
    try {
        const res = await fetch(`${BASE}/crm/v3/objects/${patch.objectType}/${patch.objectId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ properties: patch.properties }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            return { patch, success: false, error: body.message ?? `HTTP ${res.status}` };
        }
        return { patch, success: true };
    }
    catch (err) {
        return { patch, success: false, error: err instanceof Error ? err.message : String(err) };
    }
}
/**
 * Apply up to 100 WritebackPatches in a single HubSpot batch call.
 * All patches must target the same objectType.
 * Use for automated (non-approval) writes after a mission run.
 */
export async function applyBatch(token, objectType, patches) {
    if (patches.length === 0)
        return [];
    if (patches.length > 100)
        throw new Error("Batch limit is 100 records per call");
    const inputs = patches.map((p) => ({ id: p.objectId, properties: p.properties }));
    try {
        const res = await fetch(`${BASE}/crm/v3/objects/${objectType}/batch/update`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            const error = body.message ?? `HTTP ${res.status}`;
            return patches.map((patch) => ({ patch, success: false, error }));
        }
        // Batch succeeded — map results back by objectId
        const data = await res.json();
        const succeededIds = new Set(data.results.map((r) => r.id));
        return patches.map((patch) => ({
            patch,
            success: succeededIds.has(patch.objectId),
            error: succeededIds.has(patch.objectId) ? undefined : "Not in batch response",
        }));
    }
    catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        return patches.map((patch) => ({ patch, success: false, error }));
    }
}
