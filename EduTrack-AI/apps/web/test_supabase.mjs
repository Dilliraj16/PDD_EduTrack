import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing .env variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log("Testing connection to:", supabaseUrl);

    // Test 1: Check if the students table exists and fetch data
    const { data, error } = await supabase.from('students').select('*').limit(5);

    if (error) {
        if (error.code === '42P01') {
            console.log("❌ CONNECTION FAILED: The tables don't exist yet. You haven't run the SQL schemas!");
        } else {
            console.log("❌ CONNECTION ERROR:", error.message);
        }
    } else {
        console.log("✅ CONNECTION SUCCESSFUL!");
        console.log(`Schema is applied. Found ${data.length} students in the database.`);
        if (data.length > 0) {
            console.log("Data sample:", data);
        } else {
            console.log("The database is currently empty (which is normal if you just created the tables).");
        }
    }
}

testConnection();
