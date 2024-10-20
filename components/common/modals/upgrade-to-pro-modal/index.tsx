import SubscribeButtons from "@/components/common/buttons/subscribe-buttons";
import BasicModal from "@/components/common/modals/basic-modal";
import CheckIcon from "@/components/icons/check-icon";
import CrownIcon from "@/components/icons/crown-icon";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  onClose: () => void;
  onSubscribed: () => void;
}

const UpgradeToProModal: FunctionComponent<Props> = ({
  onClose,
  onSubscribed,
}) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <BasicModal
      isFixedHeight={false}
      onClose={() => onClose()}
      title={t("modal.titles.upgrade_to_pro")}
    >
      <div className="flex justify-center text-neutral-500">
        <CrownIcon />
      </div>
      <p className="text-center text-xl font-bold my-1">Upgrade to Pro</p>
      <p className="text-center text-neutral-500 mb-4">
        Get access to all features
      </p>

      <p className="text-lg mb-1">What you get</p>
      <div className="flex items-center gap-2 mb-2">
        <CheckIcon size="xs" />
        <p className="text-sm">Unlimited courses</p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <CheckIcon size="xs" />
        <p className="text-sm">Up to 20 users</p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <CheckIcon size="xs" />
        <p className="text-sm">
          Personal emails remainders for upcoming lessons
        </p>
      </div>
      <hr className="my-3" />
      <SubscribeButtons onSubscribed={onSubscribed} />
    </BasicModal>
  );
};
export default UpgradeToProModal;
