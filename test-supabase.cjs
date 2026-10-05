const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://invalid.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid');
async function run() {
  const { data, error } = await supabase.from('road_segments').select('id').eq('code', '123').single();
  console.log('Error:', error);
  console.log('Error Code:', error?.code);
}
run();
