import { NextResponse } from "next/server";

export async function GET() {
  console.log("Hello World");

  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "service_w3mqma7",
      template_id: "template_bx89lrw",
      user_id: "RLJnaTuUBzdrR4Wub",
      accessToken: "OhZfj4KmxFlowUDZjfHA4",
      template_params: {
        to_email: "aihara-sama@mail.ru",
      },
    }),
  })
    .then((r) => r.text())
    .then((message) => {
      if (message !== "ok") console.error(message);
    });
  return NextResponse.json({
    status: "ok",
  });
}
