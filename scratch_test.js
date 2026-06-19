const supabaseUrl = "https://gdihldoashdkhjouhscd.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaWhsZG9hc2hka2hqb3Voc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NzMsImV4cCI6MjA5NDI1NDU3M30.dH3srU2jb3EOzO6GTkswOziruUzy9XktwxXNAgGd_lg";

async function checkColumn(col) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/orders?select=${col}&limit=1`, {
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`
      }
    });
    const json = await res.json();
    console.log(`Column ${col} check status:`, res.status);
    console.log(`Column ${col} check response:`, json);
  } catch (err) {
    console.error(`Column ${col} check error:`, err);
  }
}

async function run() {
  await checkColumn("user_id");
  await checkColumn("customer_id");
  await checkColumn("customer_email");
}

run();
