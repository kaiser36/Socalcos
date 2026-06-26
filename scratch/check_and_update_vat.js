const supabaseUrl = "https://gdihldoashdkhjouhscd.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaWhsZG9hc2hka2hqb3Voc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NzMsImV4cCI6MjA5NDI1NDU3M30.dH3srU2jb3EOzO6GTkswOziruUzy9XktwxXNAgGd_lg";

async function run() {
  try {
    // 1. Fetch all products
    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      }
    });
    const products = await res.json();
    console.log("Total products fetched:", products.length);

    // Filter products that need update
    const toUpdate = products.filter(p => p.tax_rate === null || p.tax_rate === undefined || p.tax_rate === 0);
    console.log("Products needing VAT update:", toUpdate.length);

    if (toUpdate.length === 0) {
      console.log("All products already have a valid VAT!");
      return;
    }

    // Update in batches
    for (let i = 0; i < toUpdate.length; i++) {
      const p = toUpdate[i];
      const correctVat = p.category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23;
      
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${p.id}`, {
        method: "PATCH",
        headers: {
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tax_rate: correctVat })
      });
      
      if (updateRes.status !== 204 && updateRes.status !== 200) {
        console.error(`Failed to update product ${p.id}:`, updateRes.status);
      } else {
        if ((i + 1) % 50 === 0 || i === toUpdate.length - 1) {
          console.log(`Updated ${i + 1}/${toUpdate.length} products...`);
        }
      }
    }
    console.log("VAT migration completed successfully!");
  } catch (e) {
    console.error(e);
  }
}

run();
