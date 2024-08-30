import { db } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
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
      .catch(console.error);
  }

  return NextResponse.json({
    status: "OK",
    users,
  });
}
