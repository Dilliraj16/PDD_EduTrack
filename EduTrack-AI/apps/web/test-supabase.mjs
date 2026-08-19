async function checkDB() {
    const url = "https://lkjspdberhsepgvktlzh.supabase.co/rest/v1/profiles?select=id&limit=1";
    const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxranNwZGJlcmhzZXBndmt0bHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTcyNDIsImV4cCI6MjEwMTY5MzI0Mn0.dkVoqiNCXHbiP7d332wI1sO-tB5ZZ1BFQRYWfcj6g7I";

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                "apikey": apikey,
                "Authorization": `Bearer ${apikey}`
            }
        });

        if (res.ok) {
            console.log("DB_STATUS: CONNECTED ✅");
            const data = await res.json();
            console.log("Response:", JSON.stringify(data));
            console.log("Supabase REST API is successfully responding with the Profiles table.");
        } else {
            console.log("DB_STATUS: FAILED ❌");
            console.log("Status:", res.status, res.statusText);
            const err = await res.text();
            console.log("Error details:", err);
        }
    } catch (err) {
        console.log("DB_STATUS: DISCONNECTED ❌");
        console.log("Exception:", err.message);
    }
}

checkDB();
