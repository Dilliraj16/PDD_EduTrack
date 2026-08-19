import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Edge function to dispatch push notifications (FCM/APNS) for realtime Database webhook events
serve(async (req) => {
    // Enable CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        });
    }

    try {
        const payload = await req.json();

        // This is triggered by Supabase Webhooks when public.notifications receives an INSERT
        const record = payload.record;

        if (record && record.user_id && record.title) {
            // Mock Dispatching Push Notification
            console.log(`Sending Push Notification to user ${record.user_id} - ${record.title}`);
        }

        return new Response(JSON.stringify({ success: true, message: 'Push notification dispatched' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
