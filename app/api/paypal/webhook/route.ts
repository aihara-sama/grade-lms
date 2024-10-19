import { getServerDB } from "@/lib/supabase/db/get-server-db";
import crc32 from "buffer-crc32";
import crypto from "crypto";

const {
  SUPABASE_BUCKET = "paypal-certs",
  WEBHOOK_ID = "WH-19973937YW279670F-02S63370HL636500Y",
} = process.env;

async function downloadAndCache(url: string, cacheKey?: string) {
  const DB = getServerDB();

  if (!cacheKey) {
    cacheKey = url.replace(/\W+/g, "-");
  }

  // Check if cached file exists in Supabase Storage
  const { data: cachedData, error: cachedError } = await DB.storage
    .from(SUPABASE_BUCKET)
    .download(cacheKey);

  if (cachedData && !cachedError) {
    const cachedText = await cachedData.text(); // Convert the Blob to text
    return cachedText;
  }

  // Download the file if not cached
  const response = await fetch(url);
  const data = await response.text();
  console.log("cache data", { data });

  // Store the file in Supabase Storage
  const { error: uploadError } = await DB.storage
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
  const { headers } = req;

  const body = await req.json();

  console.log({ paypaltransmissionid: headers.get("paypal-transmission-id") });
  console.log({ paypalcerturl: headers.get("paypal-cert-url") });
  console.log({
    paypaltransmissiontime: headers.get("paypal-transmission-time"),
  });
  console.log({
    paypaltransmissionsig: headers.get("paypal-transmission-sig"),
  });
  console.log(`headers`, headers);
  console.log(`parsed json`, JSON.stringify(body, null, 2));
  console.log(`raw event: ${body}`);

  const isSignatureValid = await verifySignature(JSON.stringify(body), headers);

  if (isSignatureValid) {
    console.log("Signature is valid.");

    // Successful receipt of webhook, do something with the webhook data here to process it, e.g. write to database
    console.log(`Received event`, JSON.stringify(body, null, 2));
  } else {
    console.log(
      `Signature is not valid for ${body?.id} ${headers.get("correlation-id")}`
    );
    // Reject processing the webhook event. May wish to log all headers+data for debug purposes.
  }

  // Return a 200 response to mark successful webhook delivery
  return Response.json({ status: "ok" });
}
