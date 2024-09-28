import SelectLocale from "@/components/profile/preferences/select-locale";
import Switch from "@/components/switch";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { PropsWithClassName } from "@/types/props.type";
import type { UserMetadata } from "@supabase/supabase-js";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Preferences: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const { user, setUser } = useUser((state) => state);
  const { enablePushNotifications } = usePushNotifications();

  // State
  const [isEmailsOn, setIsEmailsOn] = useState(user.is_emails_on);
  const [isPushNotificationsOn, setIsPushNotificationsOn] = useState(
    user.is_push_notifications_on
  );

  // Effects
  useUpdateEffect(() => {
    (async () => {
      try {
        await DB.auth.updateUser({
          data: {
            is_emails_on: isEmailsOn,
          },
        });
        setUser({ ...user, is_emails_on: true });
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [isEmailsOn]);
  useUpdateEffect(() => {
    (async () => {
      try {
        if (isPushNotificationsOn) {
          const permission = await Notification.requestPermission();

          if (permission === "granted") enablePushNotifications();
        } else {
          await DB.auth.updateUser({
            data: {
              is_push_notifications_on: false,
            } as UserMetadata,
          });
        }

        setUser({ ...user, is_push_notifications_on: isPushNotificationsOn });
      } catch (err: any) {
        console.error(err.message);
      }
    })();
  }, [isPushNotificationsOn]);

  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600">Preferences</p>
      <div className="flex flex-col gap-2 mt-3 mb-8">
        <div className="flex items-center gap-3">
          <Switch isChecked={isEmailsOn} setIsChecked={setIsEmailsOn} />
          <span>Enable/Disable emails</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            isChecked={isPushNotificationsOn}
            setIsChecked={setIsPushNotificationsOn}
          />
          <span>Enable/Disable push notifications</span>
        </div>
      </div>
      <SelectLocale />
    </div>
  );
};

export default Preferences;
