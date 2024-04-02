import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer re_M45Tzn9t_3U1p7qpA11qRbXqAJwrkcfjs`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "aihara-sama@mail.ru",
        subject: "hello world",
        html: "<strong>it works!</strong>",
      }),
    });

    // const { name } = await req.json();
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
