import { db } from "@/utils/supabase/client";
import * as admin from "firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const app =
    admin.apps.find((item) => item.name === process.env.FIREBASE_APP_NAME) ||
    admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      },
      process.env.FIREBASE_APP_NAME
    );
  const { data: users, error: usersError } = await db.rpc(
    "get_upcoming_lessons_users"
  );

  if (usersError) throw new Error("Failed to get lessons' users");

  for (const user of users) {
    fetch(process.env.EMAILJS_SEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
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
          .messaging(app)
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

  return NextResponse.json({
    status: "OK",
    users,
  });
}
