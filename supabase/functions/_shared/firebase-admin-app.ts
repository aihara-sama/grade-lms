import admin from "npm:firebase-admin";

export const firebaseAdminApp =
  admin.apps.find((item) => item.name === Deno.env.get("FIREBASE_APP_NAME")) ||
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
        clientEmail: Deno.env.get("FIREBASE_CLIENT_EMAIL"),
        privateKey: Deno.env.get("FIREBASE_PRIVATE_KEY"),
      }),
    },
    Deno.env.get("FIREBASE_APP_NAME")
  );
