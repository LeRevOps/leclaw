/**
 * LeClaw — HubSpot CRM Adapter
 * Handles all HubSpot API communication for agents.
 * Add new fetch methods here as agents require them.
 */

const BASE_URL = "https://api.hubapi.com";

async function hubspotFetch(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json();
}

export async function getContacts(token, properties = [
  "firstname", "lastname", "email", "phone",
  "company", "jobtitle", "hs_lead_status",
  "createdate", "lastmodifieddate"
]) {
  const data = await hubspotFetch(
    `/crm/v3/objects/contacts?limit=100&properties=${properties.join(",")}`,
    token
  );
  return data.results;
}

export async function getCompanies(token, properties = [
  "name", "domain", "industry", "phone",
  "city", "state", "country", "numberofemployees", "annualrevenue"
]) {
  const data = await hubspotFetch(
    `/crm/v3/objects/companies?limit=100&properties=${properties.join(",")}`,
    token
  );
  return data.results;
}

export async function getDeals(token, properties = [
  "dealname", "amount", "dealstage", "closedate",
  "pipeline", "hubspot_owner_id", "createdate", "lastmodifieddate"
]) {
  const data = await hubspotFetch(
    `/crm/v3/objects/deals?limit=100&properties=${properties.join(",")}`,
    token
  );
  return data.results;
}

export async function updateContact(token, contactId, properties) {
  const res = await fetch(`${BASE_URL}/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    throw new Error(`HubSpot update error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function updateCompany(token, companyId, properties) {
  const res = await fetch(`${BASE_URL}/crm/v3/objects/companies/${companyId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    throw new Error(`HubSpot update error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
