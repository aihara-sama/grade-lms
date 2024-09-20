import { config } from "@/lib/firebase/config";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const messaging =
  typeof window !== "undefined"
    ? getMessaging(initializeApp(config))
    : undefined;
