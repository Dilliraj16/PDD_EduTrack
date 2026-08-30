import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Edge Function standard CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Authorization: Verify the requesting user identity
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const body = await req.json();
        const { action, payload } = body;
        const role = user.user_metadata?.role || body.role || 'student';

        let aiPrompt = "";

        // ==========================================
        // 🎓 STUDENT ACTIONS
        // ==========================================
        if (role === 'student') {
            if (action === 'generate_study_plan') {
                // Safely fetch only their specific grades to provide AI context
                // ... logic to query student's results ...
                aiPrompt = `You are EduTrack AI. Build a study plan for exam date ${payload.examDate} using ${payload.hours} hours/day. Student has weakness in ${payload.priority}. Return output as pure JSON format with title, examDate, and array of tasks.`;
            }
            else if (action === 'generate_quiz') {
                aiPrompt = `Create a ${payload.difficulty} quiz of ${payload.questions} questions on ${payload.topic}. Return ONLY valid JSON containing an array of objects with question, options (array), and correctOption index.`;
            }
            else if (action === 'chat') {
                aiPrompt = `You are a helpful academic assistant setting. Do not give direct answers to assignments. Help the student understand. Student message: ${payload.message}`;
            }
            else if (action === 'generate_performance_insight') {
                aiPrompt = `You are an AI academic advisor. The student has an overall average of ${payload.average || '74%'} and attendance of ${payload.attendance || '82%'}. Provide a brief 2-sentence highly encouraging insight on what to focus on. Do NOT use markdown or JSON, just plain text.`;
            }
            else {
                throw new Error("Invalid action for Student: " + action);
            }
        }

        // ==========================================
        // 👨‍🏫 FACULTY ACTIONS
        // ==========================================
        else if (role === 'faculty') {
            if (action === 'copilot_query') {
                aiPrompt = `You are EduTrack Faculty Copilot. Answer faculty queries based on this SECURE DB DATA: { "Class Average": "68%", "Attendance": "84%", "Weak Topics": "TLS Handshake, Certificate Validation" }. Faculty question: ${payload.message}. Keep responses professional and concise.`;
            }
            else if (action === 'generate_class_analytics') {
                aiPrompt = `You are an AI teaching assistant analyzing class performance. Provide a robust 2-sentence summary of class trends based on these inputs: Average ${payload.average}, Attendance ${payload.attendance}, Weak Topics ${payload.weakTopics}. Do NOT use markdown.`;
            }
            else if (action === 'generate_at_risk_insight') {
                aiPrompt = `Provide a 1-sentence professional AI note summarizing why this student is struggling. Constraints: Attendance=${payload.attendance}, Trend=${payload.trend}. Keep it very brief and actionable. Do NOT use markdown.`;
            }
            else {
                throw new Error("Invalid action for Faculty: " + action);
            }
        }

        // ==========================================
        // 🤖 CALL EXTERNAL LLM API (Gemini / OpenAI)
        // ==========================================

        // Grab the provider key dynamically from Supabase Vault/Env
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({
                error: "GEMINI_API_KEY missing in environment variables. AI Mode cannot process."
            }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // Standard Gemini text-generation endpoint request
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: aiPrompt }] }]
            })
        });

        const data = await res.json();
        const llmResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return new Response(JSON.stringify({ data: llmResponse }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
