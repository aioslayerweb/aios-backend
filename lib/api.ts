const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://aios-backend-4.onrender.com";

export async function getExecutiveOverview() {
  const response = await fetch(
    `${API_BASE}/api/v1/executive/overview`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Executive Overview");
  }

  return response.json();
}

export async function getCompanyMemory() {
  const response = await fetch(
    `${API_BASE}/api/v1/memory/company`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Company Memory");
  }

  return response.json();
}

export async function getCustomerMemory() {
  const response = await fetch(
    `${API_BASE}/api/v1/memory/customers`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Customer Memory");
  }

  return response.json();
}

export async function getDecisionMemory() {
  const response = await fetch(
    `${API_BASE}/api/v1/memory/decisions`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Decision Memory");
  }

  return response.json();
}