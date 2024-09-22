import { createFcmToken, getFcmToken } from "@/db/fcm-token";
import { useUser } from "@/hooks/use-user";
import { messaging } from "@/lib/firebase/messaging";
import { DB } from "@/lib/supabase/db";
import type { UserMetadata } from "@supabase/supabase-js";
import { getToken } from "firebase/messaging";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const usePushNotifications = () => {
  const t = useTranslations();
  const { user, setUser } = useUser();

  const enablePushNotifications = async () => {
    try {
      const data = await getFcmToken();

      if (!data) {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });
        await createFcmToken(token);
      }

      const { error } = await DB.auth.updateUser({
        data: {
          is_push_notifications_on: true,
        } as UserMetadata,
      });

      if (error) throw new Error(t("something_went_wrong"));

      setUser({ ...user, is_push_notifications_on: true });

      toast.success("Notifications enabled!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (!user.is_push_notifications_on) {
        try {
          const permission = await Notification.requestPermission();

          if (permission === "granted") enablePushNotifications();
        } catch (err: any) {
          console.error(err.message);
        }
      }
    })();
  }, []);
};
