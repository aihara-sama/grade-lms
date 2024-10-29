import admin from "npm:firebase-admin";
import { adminDB } from "../_shared/admin-db.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { firebaseAdminApp } from "../_shared/firebase-admin-app.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  console.log("starting");

  try {
    const { data: users, error: usersError } = await adminDB.rpc(
      "get_upcoming_lessons_users"
    );

    console.log({ users, usersError });

    if (usersError) throw new Error(usersError.message);

    for (const user of users) {
      try {
        if (user.is_emails_on) {
          const sendEmailResult = await fetch(
            Deno.env.get("EMAILJS_SEND_ENDPOINT"),
            {
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
            }
          );
          if ((await sendEmailResult.text()) !== "OK") throw new Error(message);
        }

        if (user.push_notifications_state === "on") {
          await admin.messaging(firebaseAdminApp).send({
            token: user.fcm_token,
            notification: {
              title: "Your lessons starts soon",
              body: "Your lesson starts soon",
            },
          });
        }

        if (user.is_emails_on || user.push_notifications_state === "on") {
          const { error } = await adminDB.from("announcements").insert({
            user_id: user.id,
            lesson_id: user.lesson_id,
          });

          if (error) throw new Error(error.message);
        }
      } catch (err: any) {
        console.error(err);
      }
    }

    return new Response(JSON.stringify({ users, error: usersError }), {
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
