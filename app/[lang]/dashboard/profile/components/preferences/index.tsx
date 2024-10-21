import SelectLocale from "@/app/[lang]/dashboard/profile/components/preferences/select-locale";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import Switch from "@/components/common/switch";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { toggleUserEmails, updateUser } from "@/db/client/user";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import type { PropsWithClassName } from "@/types/props.type";
import type { Database } from "@/types/supabase.type";
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
  const [isSubmittingToggleUserEmails, setIsSubmittingToggleUserEmails] =
    useState(false);
  const [
    isSubmittingTogglePushNotificationsState,
    setIsSubmittingTogglePushNotificationsState,
  ] = useState(false);
  console.log({ isSubmittingTogglePushNotificationsState });

  // Handlers
  const submitToggleUserEmails = async () => {
    setIsSubmittingToggleUserEmails(true);

    try {
      await toggleUserEmails();
      setUser({ ...user, is_emails_on: !user.is_emails_on });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingToggleUserEmails(false);
    }
  };
  const submitTogglePushNotificationsState = async (
    state: Database["public"]["Enums"]["push_notifications_state"]
  ) => {
    setIsSubmittingTogglePushNotificationsState(true);

    if (state === "on") await enablePushNotifications();
    if (state === "off") {
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

    setIsSubmittingTogglePushNotificationsState(false);
  };

  const onSubscribed = () => {
    setIsUpgradeToProModal(false);
    submitToggleUserEmails();
  };

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
          {isSubmittingToggleUserEmails && (
            <div className="relative size-6">
              <LoadingSpinner />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Switch
            isChecked={user.push_notifications_state === "on"}
            setIsChecked={(checked) =>
              submitTogglePushNotificationsState(checked ? "on" : "off")
            }
          />
          <span>{t("profile.enable_disable_browser_notifications")}</span>
          {isSubmittingTogglePushNotificationsState && (
            <div className="relative size-6">
              <LoadingSpinner />
            </div>
          )}
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
