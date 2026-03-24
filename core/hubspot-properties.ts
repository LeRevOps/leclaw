/**
 * @leclaw/core — Dynamic property discovery
 *
 * Fetches the org's custom HubSpot properties and builds AgentChecks for them.
 * Agents call buildDynamicChecks() in their discoverChecks hook to automatically
 * flag custom fields that are commonly empty — without hardcoding field names.
 *
 * @example
 * export const myAgent: AgentDefinition = {
 *   name: "le-my-agent",
 *   checks: [...staticChecks],
 *   discoverChecks: (token) => buildDynamicChecks(token, "contacts"),
 *   summaryPrompt: (results) => `...`,
 * };
 */

import { AgentCheck, HubSpotRecord } from "./base.js";

interface HubSpotProperty {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  hubspotDefined: boolean;
  readOnlyValue: boolean;
  calculated: boolean;
  displayOrder: number;
}

export async function fetchCustomProperties(
  token: string,
  objectType: string
): Promise<HubSpotProperty[]> {
  const res = await fetch(
    `https://api.hubapi.com/crm/v3/properties/${objectType}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];

  const data = await res.json();
  const properties: HubSpotProperty[] = data.results ?? [];

  return properties.filter(
    (p) =>
      !p.hubspotDefined &&
      !p.readOnlyValue &&
      !p.calculated &&
      !p.name.startsWith("hs_") &&
      ["text", "number", "date", "phone_number", "email", "textarea"].includes(p.fieldType)
  );
}

export async function buildDynamicChecks(
  token: string,
  objectType: string
): Promise<AgentCheck[]> {
  const properties = await fetchCustomProperties(token, objectType);

  // Top 10 most prominent custom fields
  const top = properties
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 10);

  return top.map((prop) => ({
    id: `custom_missing_${prop.name}`,
    label: `${objectType} missing "${prop.label}"`,
    objectType,
    filterGroups: [
      { filters: [{ propertyName: prop.name, operator: "NOT_HAS_PROPERTY" as const }] },
    ],
    properties: [prop.name, "firstname", "lastname", "email", "name"].filter(Boolean),
    severity: "info" as const,
    fix: `Fill in "${prop.label}" — this is a custom field in your HubSpot`,
    getName: (r: HubSpotRecord) =>
      [r.properties.firstname, r.properties.lastname].filter(Boolean).join(" ") ||
      r.properties.email ||
      r.properties.name ||
      r.id,
  }));
}
