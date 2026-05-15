import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function checkFavorites() {
  console.log('Checking favorite products in DB...');
  const { data, error } = await supabase
    .from('products')
    .select('name, is_favorite, published')
    .eq('is_favorite', true);
  
  if (error) {
    console.error('Error fetching favorites:', error.message);
  } else {
    console.log('Found', data?.length, 'favorites in DB:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkFavorites();
