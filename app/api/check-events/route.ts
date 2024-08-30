import { db } from "@/utils/supabase/client";
import * as admin from "firebase-admin";
import { NextResponse } from "next/server";

const app = admin.initializeApp(
  {
    credential: admin.credential.cert(
      JSON.parse(
        Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, "base64").toString(
          "utf8"
        )
      )
    ),
  },
  process.env.FIREBASE_APP_NAME
);

export async function GET() {
  const { data: users, error: usersError } = await db.rpc(
    "get_upcoming_lessons_users"
  );

  if (usersError) throw new Error("Failed to get lessons' users");

  console.log(users);

  if (users.length)
    await admin.messaging(app).sendEach(
      users.map((user) => ({
        token: user.fcm_token,
        notification: {
          title: "New course",
          body: "You have been assigned to a new course",
        },
      }))
    );
  return NextResponse.json({
    status: "OK",
    users,
  });
}
