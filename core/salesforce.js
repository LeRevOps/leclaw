/**
 * LeClaw — Salesforce CRM Adapter
 * Handles all Salesforce API communication for agents.
 * Uses OAuth2 access token — see docs/salesforce-setup.md for auth setup.
 */

async function sfFetch(instanceUrl, path, token) {
  const res = await fetch(`${instanceUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Salesforce API error: ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json();
}

async function sfQuery(instanceUrl, token, soql) {
  const encoded = encodeURIComponent(soql);
  const data = await sfFetch(
    instanceUrl,
    `/services/data/v59.0/query?q=${encoded}`,
    token
  );
  return data.records;
}

export async function getContacts(token, instanceUrl) {
  return sfQuery(instanceUrl, token, `
    SELECT Id, FirstName, LastName, Email, Phone,
           Title, AccountId, LeadSource,
           CreatedDate, LastModifiedDate
    FROM Contact
    LIMIT 100
  `);
}

export async function getAccounts(token, instanceUrl) {
  return sfQuery(instanceUrl, token, `
    SELECT Id, Name, Website, Industry, Phone,
           BillingCity, BillingState, BillingCountry,
           NumberOfEmployees, AnnualRevenue,
           OwnerId, ParentId
    FROM Account
    LIMIT 100
  `);
}

export async function getOpportunities(token, instanceUrl) {
  return sfQuery(instanceUrl, token, `
    SELECT Id, Name, Amount, StageName, CloseDate,
           Probability, OwnerId, AccountId,
           CreatedDate, LastModifiedDate, ForecastCategory
    FROM Opportunity
    WHERE IsClosed = false
    LIMIT 100
  `);
}

export async function getLeads(token, instanceUrl) {
  return sfQuery(instanceUrl, token, `
    SELECT Id, FirstName, LastName, Email, Phone,
           Company, Title, Status, LeadSource,
           OwnerId, CreatedDate, LastModifiedDate,
           IsConverted
    FROM Lead
    WHERE IsConverted = false
    LIMIT 100
  `);
}

export async function updateRecord(token, instanceUrl, objectType, recordId, fields) {
  const res = await fetch(
    `${instanceUrl}/services/data/v59.0/sobjects/${objectType}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }
  );

  if (!res.ok && res.status !== 204) {
    throw new Error(`Salesforce update error: ${res.status} ${res.statusText}`);
  }

  return true;
}
