const supabaseUrl = "https://gdihldoashdkhjouhscd.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaWhsZG9hc2hka2hqb3Voc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NzMsImV4cCI6MjA5NDI1NDU3M30.dH3srU2jb3EOzO6GTkswOziruUzy9XktwxXNAgGd_lg";

async function tryInsert(payload) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    console.log("Insert status:", res.status);
    console.log("Insert response:", json);
  } catch (err) {
    console.error("Insert error:", err);
  }
}

async function run() {
  console.log("Trying to insert with a random email...");
  await tryInsert({
    customer_name: "Test User",
    customer_email: "test_random_123@example.com",
    customer_phone: "123456789",
    address: "Test Address",
    city: "Test City",
    postal_code: "1234-567",
    country: "Portugal",
    total: 100,
    status: "pending"
  });
}

run();
