import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function setup() {
  console.log('Checking site_settings table...');
  const { data, error } = await supabase.from('site_settings').select('*');
  
  if (error) {
    console.log('Table site_settings might not exist:', error.message);
  } else {
    console.log('Current settings:', data);
  }
}

setup();





