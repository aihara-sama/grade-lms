import SelectLocale from "@/app/[lang]/dashboard/profile/components/preferences/select-locale";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import Switch from "@/components/common/switch";
import { toggleUserEmails, updateUser } from "@/db/client/user";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { PropsWithClassName } from "@/types/props.type";
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
  const [isUpgradeToProModal, setIsUpgradeToProModal] = useState(false);

  const [pushNotificationsState, setPushNotificationsState] = useState(
    user.push_notifications_state
  );

  // Handlers
  const submitToggleUserEmails = async () => {
    try {
      await toggleUserEmails();
      setUser({ ...user, is_emails_on: !user.is_emails_on });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubscribed = () => {
    setIsUpgradeToProModal(false);
    submitToggleUserEmails();
  };

  // Effects
  useUpdateEffect(() => {
    (async () => {
      if (pushNotificationsState === "on") enablePushNotifications();
      if (pushNotificationsState === "off") {
        try {
          await updateUser({
            push_notifications_state: "off",
            id: user.id,
          });

          setUser({
            ...user,
            push_notifications_state: "off",
          });
        } catch (error: any) {
          toast.error(error.message);
        }
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
          <Switch
            isChecked={user.is_emails_on}
            setIsChecked={() => {
              if (user.is_pro) submitToggleUserEmails();
              else setIsUpgradeToProModal(true);
            }}
          />
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
      {isUpgradeToProModal && (
        <UpgradeToProModal
          onClose={() => setIsUpgradeToProModal(false)}
          onSubscribed={onSubscribed}
        />
      )}
    </div>
  );
};

export default Preferences;
