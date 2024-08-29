import type { Database } from "@/types/supabase.type";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    users: Database["public"]["Tables"]["users"]["Row"][];
  };
  console.log(body.users);

  // const app = admin.initializeApp({
  //   credential: applicationDefault(),
  // });

  // admin.messaging(app).send({
  //   token: body.users[0].fcm_token,
  //   notification: {
  //     title: "New course",
  //     body: "You have been assigned to a new course",
  //   },
  // });
  try {
    body.users.forEach(({ email }) => {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer re_M45Tzn9t_3U1p7qpA11qRbXqAJwrkcfjs`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: email,
          subject: "hello world",
          html: "<strong>it works!</strong>",
        }),
      })
        .then((r) => r.json())
        .then(console.log)
        .catch(console.error);
    });
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({});
}
