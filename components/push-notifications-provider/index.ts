"use client";

import { messaging } from "@/lib/firebase/messaging";
import { onMessage } from "firebase/messaging";
import type { FunctionComponent } from "react";
import { useEffect } from "react";

const PushNotificationsProvider: FunctionComponent = () => {
  useEffect(() => {
    onMessage(
      messaging,
      (payload) =>
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        })
    );
  }, []);

  return null;
};

export default PushNotificationsProvider;
