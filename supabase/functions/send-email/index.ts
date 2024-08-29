import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const body = await req.json();
  try {
    for (const user of body.users) {
      fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: Deno.env.get("EMAILJS_SERVICE_ID"),
          template_id: Deno.env.get("EMAILJS_TEMPLATE_ID"),
          user_id: Deno.env.get("EMAILJS_USER_ID"),
          accessToken: Deno.env.get("EMAILJS_PRIVATE_KEY"),
          template_params: {
            to_email: user.email,
          },
        }),
      })
        .then((r) => r.text())
        .then((message) => {
          if (message !== "ok") console.error(message);
        });
    }

    // const { name } = await req.json();

    return new Response(JSON.stringify({}), {
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
