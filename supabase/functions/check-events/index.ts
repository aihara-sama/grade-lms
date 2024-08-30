import admin from "npm:firebase-admin";
import { corsHeaders } from "../_shared/cors.ts";
import { db } from "../_shared/db.ts";
import { firebaseAdminApp } from "../_shared/firebase-admin-app.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { data: users, error: usersError } = await db.rpc(
      "get_upcoming_lessons_users"
    );

    if (usersError) throw new Error(usersError.message);

    for (const user of users) {
      fetch(Deno.env.get("EMAILJS_SEND_ENDPOINT"), {
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
          if (message !== "OK") throw new Error(message);
        })
        .then(async () => {
          const { error } = await db.from("sent_notifications").insert({
            user_id: user.id,
            lesson_id: user.lesson_id,
          });

          if (error) throw new Error(error.message);
        })
        .then(() => {
          admin
            .messaging(firebaseAdminApp)
            .send({
              token: user.fcm_token,
              notification: {
                title: "Your lessons starts soon",
                body: "Your lesson starts soon",
              },
            })
            .catch(console.error);
        })
        .catch(console.error);
    }

    return new Response(JSON.stringify({ users }), {
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
