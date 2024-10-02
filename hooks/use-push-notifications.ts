import { createFcmToken, getFcmToken } from "@/db/client/fcm-token";
import { useUser } from "@/hooks/use-user";
import { messaging } from "@/lib/firebase/messaging";
import { DB } from "@/lib/supabase/db";
import type { UserMetadata } from "@supabase/supabase-js";
import { getToken } from "firebase/messaging";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export const usePushNotifications = () => {
  const t = useTranslations();
  const { user, setUser } = useUser((state) => state);

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

      if (error) throw new Error(t("error.something_went_wrong"));

      setUser({ ...user, is_push_notifications_on: true });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return { enablePushNotifications };
};