import { adminDB } from "@/lib/supabase/db/admin-db";
import crc32 from "buffer-crc32";
import crypto from "crypto";
import fetch from "node-fetch";

const { SUPABASE_BUCKET = "paypal-certs", WEBHOOK_ID = "6HN15449TD174563T" } =
  process.env;

async function downloadAndCache(url: string, cacheKey?: string) {
  if (!cacheKey) {
    cacheKey = url.replace(/\W+/g, "-");
  }

  // Check if cached file exists in Supabase Storage
  const { data: cachedData, error: cachedError } = await adminDB.storage
    .from(SUPABASE_BUCKET)
    .download(cacheKey);

  if (cachedData && !cachedError) {
    const cachedText = await cachedData.text(); // Convert the Blob to text
    return cachedText;
  }

  // Download the file if not cached
  const response = await fetch(url);
  const data = await response.text();

  // Store the file in Supabase Storage
  const { error: uploadError } = await adminDB.storage
    .from(SUPABASE_BUCKET)
    .upload(cacheKey, new Blob([data]), { contentType: "text/plain" });

  if (uploadError) {
    console.error("Error uploading to Supabase Storage:", uploadError);
  }

  return data;
}

async function verifySignature(event: string, headers: Headers) {
  const transmissionId = headers.get("paypal-transmission-id");
  const timeStamp = headers.get("paypal-transmission-time");

  /* eslint-disable-next-line radix */
  const crc = parseInt(`0x${crc32(event).toString("hex")}`); // hex crc32 of raw event data, parsed to decimal form

  const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`;
  console.log(`Original signed message ${message}`);

  const certPem = await downloadAndCache(headers.get("paypal-cert-url"));
  console.log({ certPem });

  // Create buffer from base64-encoded signature
  const signatureBuffer = Buffer.from(
    headers.get("paypal-transmission-sig"),
    "base64"
  );

  // Create a verification object
  const verifier = crypto.createVerify("SHA256");

  // Add the original message to the verifier
  verifier.update(message);

  return verifier.verify(certPem, signatureBuffer);
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const body = await req.json();
  const { headers } = req;

  const isSignatureValid = await verifySignature(rawBody, headers);

  if (isSignatureValid) {
    console.log("Signature is valid.");

    // Successful receipt of webhook, do something with the webhook data here to process it, e.g. write to database
    console.log(`Received event`, body);

    if (body.event_type === "BILLING.SUBSCRIPTION.CREATED") {
      const { error } = await adminDB.from("subscriptions").insert({
        subscription_id: body.resource.id,
        user_id: body.resource.custom_id,
      });

      if (error) {
        return Response.json({}, { status: 500 });
      }
    }

    if (body.event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
      console.log("billing_info", body.resource.billing_info);

      // const { error } = await adminDB.from("subscriptions").delete({
      //   subscription_id: body.resource.id,
      //   user_id: body.resource.custom_id,
      // });

      // if (error) {
      //   return Response.json({}, { status: 500 });
      // }
    }
  } else {
    console.log(
      `Signature is not valid for ${JSON.parse(rawBody)?.id} ${headers.get("correlation-id")}`
    );
    // Reject processing the webhook event. May wish to log all headers+data for debug purposes.
    return Response.json({}, { status: 400 });
  }

  // Return a 200 response to mark successful webhook delivery
  return Response.json({});
}
