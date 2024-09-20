import type en from "@/public/messages/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}

  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_APP_NAME;
      FIREBASE_CLIENT_EMAIL: string;
      NEXT_PUBLIC_VAPID_KEY: string;
      NEXT_PUBLIC_MEASUREMENT_ID: string;
      NEXT_PUBLIC_APP_ID: string;
      NEXT_PUBLIC_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_STORAGE_BUCKET: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_AUTH_DOMAIN: string;
      NEXT_PUBLIC_API_KEY: string;
      EMAILJS_USER_ID: string;
      EMAILJS_SERVICE_ID: string;
      EMAILJS_TEMPLATE_ID: string;
      EMAILJS_PRIVATE_KEY: string;
      EMAILJS_SEND_ENDPOINT: string;
      FIREBASE_PRIVATE_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SEND_EMAIL_LAMBDA_ENDPOINT: string;
      NEXT_PUBLIC_PAYPAL_PLAN_ID: string;
      PAYPAL_CLIENT_ID: string;
      NEXT_PUBLIC_DEFAULT_AVATAR: string;
    }
  }
}
