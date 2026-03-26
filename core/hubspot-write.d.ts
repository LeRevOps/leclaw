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
import type { WritebackPatch } from "./base.js";
export interface WritebackResult {
    patch: WritebackPatch;
    success: boolean;
    error?: string;
}
/**
 * Apply a single WritebackPatch to HubSpot.
 * Use for approval-gated writes where one record is confirmed at a time.
 */
export declare function applyPatch(token: string, patch: WritebackPatch): Promise<WritebackResult>;
/**
 * Apply up to 100 WritebackPatches in a single HubSpot batch call.
 * All patches must target the same objectType.
 * Use for automated (non-approval) writes after a mission run.
 */
export declare function applyBatch(token: string, objectType: string, patches: WritebackPatch[]): Promise<WritebackResult[]>;
