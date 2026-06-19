const supabaseUrl = "https://gdihldoashdkhjouhscd.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaWhsZG9hc2hka2hqb3Voc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NzMsImV4cCI6MjA5NDI1NDU3M30.dH3srU2jb3EOzO6GTkswOziruUzy9XktwxXNAgGd_lg";

async function authRequest(endpoint, payload) {
  const res = await fetch(`${supabaseUrl}/auth/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return { status: res.status, data: await res.json() };
}

async function insertOrder(token, email) {
  const payload = {
    customer_name: "Test Authenticated User",
    customer_email: email,
    customer_phone: "912345678",
    address: "Rua do Port, 123",
    city: "Porto",
    postal_code: "4000-000",
    country: "Portugal",
    total: 150.0,
    status: "pending"
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(payload)
  });
  return { status: res.status, data: await res.json() };
}

async function run() {
  const email = `test_rls_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log(`Step 1: Signing up test user: ${email}...`);
  let auth = await authRequest("signup", { email, password });
  
  if (auth.status !== 200 && auth.status !== 201) {
    console.log("Signup failed, trying login instead...", auth.data);
    auth = await authRequest("token?grant_type=password", { email, password });
  }

  const token = auth.data.access_token;
  if (!token) {
    console.error("Could not obtain auth token:", auth.data);
    return;
  }
  console.log("Successfully authenticated! Obtained JWT token.");

  console.log("\nStep 2: Testing insert with MATCHING email...");
  const insert1 = await insertOrder(token, email);
  console.log("Insert 1 status:", insert1.status);
  console.log("Insert 1 response:", insert1.data);

  console.log("\nStep 3: Testing insert with NON-MATCHING email...");
  const insert2 = await insertOrder(token, "different_email@example.com");
  console.log("Insert 2 status:", insert2.status);
  console.log("Insert 2 response:", insert2.data);
}

run();
