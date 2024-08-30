import console from "console";
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
  "grade-lms"
);

export async function GET() {
  console.log({ app });

  admin.messaging(app).send({
    token:
      "fsm9j2MqHcnntdIzgWBu60:APA91bFvs6dD-Yw8yQJu6VRsRLZiZB09HGqrNv8cymqFc3yPPAHQ_XRSprG0dvaTKR06YdbeMuMTf_I7xaZ9HNQeGofAhZL-PSZRb3PAcL1XjeH2TnwQem9Y5sxGMXLIsqATeTG4F2UI",
    notification: {
      title: "New course",
      body: "You have been assigned to a new course",
    },
  });

  return NextResponse.json({});
}
