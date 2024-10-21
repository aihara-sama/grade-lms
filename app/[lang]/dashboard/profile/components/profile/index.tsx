"use client";

import AvatarUpload from "@/components/common/avatar-upload";
import CrownIcon from "@/components/icons/crown-icon";
import type { FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import General from "@/app/[lang]/dashboard/profile/components/general";
import Preferences from "@/app/[lang]/dashboard/profile/components/preferences";
import Security from "@/app/[lang]/dashboard/profile/components/security";
import BasicModal from "@/components/common/modals/basic-modal";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import Container from "@/components/layout/container";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import type { getCanceledSubscription } from "@/db/client/subscription";
import { cancelSubscription } from "@/db/client/subscription";
import { updateUser } from "@/db/client/user";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  canceledSubscription: ResultOf<typeof getCanceledSubscription> | null;
}

const Profile: FunctionComponent<Props> = ({
  canceledSubscription: initCanceledSubscription,
}) => {
  // Hooks
  const { user, setUser } = useUser((state) => state);
  const t = useTranslations();

  // State
  const [avatar, setAvatar] = useState(user.avatar);

  const [canceledSubscription, setCanceledSubscription] = useState(
    initCanceledSubscription
  );

  const [isUpgradeToProModal, setIsUpgradeToProModal] = useState(false);
  const [isCancelSubscriptionModal, setIsCancelSubscriptionModal] =
    useState(false);

  const [isSubmittingCancelSubscription, setIsSubmittingCancelSubscription] =
    useState(false);

  // Handlers
  const submitCancelSubscription = async () => {
    setIsSubmittingCancelSubscription(true);

    try {
      setCanceledSubscription(await cancelSubscription());

      setIsCancelSubscriptionModal(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingCancelSubscription(false);
    }
  };

  // Effects
  useUpdateEffect(() => {
    (async () => {
      try {
        await updateUser({ id: user.id, avatar });

        setUser({ ...user, avatar });
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [avatar]);

  // View
  return (
    <div>
      <div className="mb-44 md:mb-24 relative h-40 bg-[url(/assets/svg/bubbled-bg.svg)] bg-cover bg-no-repeat bg-center">
        <div className="absolute top-[80px] md:left-96 left-1/2 transform -translate-x-1/2 flex items-end gap-8 md:flex-row flex-col">
          <AvatarUpload avatar={avatar} onChange={setAvatar} />
          <div>
            <p className="text-2xl font-bold text-neutral-600">{user.name}</p>
            <p className="text-neutral-500">{user.email}</p>
          </div>
        </div>
      </div>
      <Container>
        <hr />
        <General className="mt-16" />
        <Preferences className="mt-16" />
        <Security className="mt-16" />
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">
            {t("profile.plan")}
          </p>
          <div className="mt-3">
            <p className="text-neutral-600">
              {t.rich(
                `profile.${user.is_pro ? "your_plan_is_pro" : "your_plan_is_basic"}`,
                {
                  b: (chunks) => <span className="font-bold">{chunks}</span>,
                }
              )}
            </p>
            {!!canceledSubscription && (
              <p className="text-neutral-500 text-sm">
                Your subscription will remain active until{" "}
                <span className="font-bold">
                  {canceledSubscription.end_date}
                </span>
              </p>
            )}
            {user.is_pro && !canceledSubscription && (
              <button
                onClick={() => setIsCancelSubscriptionModal(true)}
                className="delete-button mt-1"
              >
                {t("buttons.cancel_subscription")}
              </button>
            )}
            {!user.is_pro && (
              <button
                onClick={() => setIsUpgradeToProModal(true)}
                className="link-button w-40 mt-1"
              >
                <span className="text-white">
                  <CrownIcon />
                </span>
                {t("buttons.upgrade")}
              </button>
            )}
          </div>
        </div>

        {isUpgradeToProModal && (
          <UpgradeToProModal
            onClose={() => setIsUpgradeToProModal(false)}
            onSubscribed={() => setIsUpgradeToProModal(false)}
          />
        )}

        {isCancelSubscriptionModal && (
          <BasicModal
            isFixedHeight={false}
            onClose={() => setIsCancelSubscriptionModal(false)}
            title={t("modal.titles.cancel_subscription")}
          >
            <p className="mb-4">{t("prompts.cancel_subscription")}</p>
            <p className="mb-4 text-neutral-500">
              {t("common.you_will_keep_your_plan_for_the_remaining_period")}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="outline-button"
                onClick={() => setIsCancelSubscriptionModal(false)}
              >
                {t("buttons.cancel")}
              </button>
              <button
                className="delete-button"
                onClick={submitCancelSubscription}
              >
                {isSubmittingCancelSubscription && <LoadingSpinner />}
                <span
                  className={`${clsx(isSubmittingCancelSubscription && "opacity-0")}`}
                >
                  {t("buttons.cancel_subscription")}
                </span>
              </button>
            </div>
          </BasicModal>
        )}
      </Container>
    </div>
  );
};

export default Profile;
