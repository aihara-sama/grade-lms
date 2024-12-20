import { createFcmToken, getFcmToken } from "@/db/client/fcm-token";
import type { getNotification } from "@/db/client/notification";
import { updateUser } from "@/db/client/user";
import { useUser } from "@/hooks/use-user";
import { messaging } from "@/lib/firebase/messaging";
import type { ResultOf } from "@/types/utils.type";
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

        await updateUser({
          push_notifications_state: "on",
          id: user.id,
        });

        setUser({ ...user, push_notifications_state: "on" });
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
      course: notification.course?.title || t("common.deleted"),
      assignment: notification.assignment?.title || t("common.deleted"),
      lesson: notification.lesson?.title || t("common.deleted"),
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
