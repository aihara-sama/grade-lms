import { db } from "@/utils/supabase/client";
import * as admin from "firebase-admin";
import { NextResponse } from "next/server";

export async function POST() {
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
    admin
      .messaging(app)
      .send({
        token: user.fcm_token,
        notification: {
          title: "Your lessons starts soon ",
          body: "Your lesson starts soon",
        },
      })
      .catch(console.error);
  }

  return NextResponse.json({
    status: "OK",
    users,
  });
}
