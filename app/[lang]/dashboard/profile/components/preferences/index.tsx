import SelectLocale from "@/app/[lang]/dashboard/profile/components/preferences/select-locale";
import Switch from "@/components/common/switch";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { PropsWithClassName } from "@/types/props.type";
import type { UserMetadata } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Preferences: FunctionComponent<PropsWithClassName> = ({
  className = "",
}) => {
  // Hooks
  const t = useTranslations();
  const { user, setUser } = useUser((state) => state);
  const { enablePushNotifications } = usePushNotifications();

  // State
  const [isEmailsOn, setIsEmailsOn] = useState(user.is_emails_on);
  const [pushNotificationsState, setPushNotificationsState] = useState(
    user.push_notifications_state
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
        if (pushNotificationsState === "on") enablePushNotifications();
        if (pushNotificationsState === "off") {
          await DB.auth.updateUser({
            data: {
              push_notifications_state: "off",
            } as UserMetadata,
          });

          setUser({
            ...user,
            push_notifications_state: "off",
          });
        }
      } catch (err: any) {
        console.error(err.message);
      }
    })();
  }, [pushNotificationsState]);

  useUpdateEffect(() => {
    setPushNotificationsState(user.push_notifications_state);
  }, [user.push_notifications_state]);

  // View
  return (
    <div className={className}>
      <p className="text-2xl font-bold text-neutral-600">
        {t("profile.preferences")}
      </p>
      <div className="flex flex-col gap-2 mt-3 mb-8">
        <div className="flex items-center gap-3">
          <Switch isChecked={isEmailsOn} setIsChecked={setIsEmailsOn} />
          <span>{t("profile.enable_disable_emails")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            isChecked={pushNotificationsState === "on"}
            setIsChecked={(checked) =>
              setPushNotificationsState(checked ? "on" : "off")
            }
          />
          <span>{t("profile.enable_disable_browser_notifications")}</span>
        </div>
      </div>
      <SelectLocale />
    </div>
  );
};

export default Preferences;
