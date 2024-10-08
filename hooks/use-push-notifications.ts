import { createFcmToken, getFcmToken } from "@/db/client/fcm-token";
import type { getNotification } from "@/db/client/notification";
import { useUser } from "@/hooks/use-user";
import { messaging } from "@/lib/firebase/messaging";
import { DB } from "@/lib/supabase/db";
import type { ResultOf } from "@/types/utils.type";
import type { UserMetadata } from "@supabase/supabase-js";
import { getToken } from "firebase/messaging";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const usePushNotifications = () => {
  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const { user, setUser } = useUser((state) => state);

  // Handlers
  const enablePushNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const data = await getFcmToken();

        if (!data) {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          });
          await createFcmToken(token);
        }

        const { error } = await DB.auth.updateUser({
          data: {
            push_notifications_state: "On",
          } as UserMetadata,
        });

        if (error) throw new Error(t("error.something_went_wrong"));

        setUser({ ...user, push_notifications_state: "On" });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const firePushNotification = (
    notification: ResultOf<typeof getNotification>
  ) => {
    const title = t(`notifications.${notification.type}.title`);
    const href = t(`notifications.${notification.type}.href`, {
      courseId: notification.course?.id,
      lessonId: notification.lesson?.id,
    });
    const body = t(`notifications.${notification.type}.body`, {
      course: notification.course?.title || t("deleted"),
      assignment: notification.assignment?.title || t("deleted"),
      lesson: notification.lesson?.title || t("deleted"),
    });

    const pushNotification = new Notification(title, {
      body,
      icon: "/favicon.ico",
    });

    pushNotification.addEventListener("click", () => {
      router.push(href);
    });
  };

  return { enablePushNotifications, firePushNotification };
};
