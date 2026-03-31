import { createClient } from '@supabase/supabase-js';

const url = 'https://noxzmygnsccjudxbnuqc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veHpteWduc2NjanVkeGJudXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODA3MTQsImV4cCI6MjA5MDQ1NjcxNH0.KGhcq1O4jZmkMKVQYs8ZCqwV2CcvRs1wdeVRv_aAcNA';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('users').insert([{ name: 'test', email: 'test@example.com', role: 'student', status: 'Active' }]).select();
  console.log('Insert Data:', data);
  console.log('Insert Error:', error);
}

test();
