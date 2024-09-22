"use client";

import tz from "timezones-list";

import type { InputType as UserInputType } from "@/actions/update-user-action/types";
import AvatarUpload from "@/components/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import EmailIcon from "@/components/icons/email-icon";
import SecurityIcon from "@/components/icons/security-icon";
import Input from "@/components/input";
import Tabs from "@/components/tabs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import Select from "@/components/common/select";
import Skeleton from "@/components/skeleton";
import { getUser, updateUser } from "@/db/user";
import { Role } from "@/enums/role.enum";
import type { SelectItem } from "@/interfaces/select.interface";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";

interface Props {
  userId: string;
  onClose: (mutated?: boolean) => void;
}

const CreateUserModal: FunctionComponent<Props> = ({ onClose, userId }) => {
  const [userDetails, setUserDetails] = useState<UserInputType>();
  const [timezones, setTimezones] = useState<SelectItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations();

  const fetchUser = async () => {
    setIsLoading(true);

    try {
      setUserDetails(await getUser(userId));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditUser = async () => {
    setIsSubmitting(true);
    try {
      await updateUser({
        avatar: userDetails.avatar,
        email: userDetails.email,
        id: userDetails.id,
        name: userDetails.name,
        timezone: userDetails.timezone,
        ...(userDetails.password?.length
          ? { password: userDetails.password }
          : {}),
      });
      onClose(true);
      toast.success(t("user_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTimezoneChange = (timezone: SelectItem) =>
    setUserDetails((_) => ({ ..._, timezone: timezone.title }));

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserDetails((_) => ({ ..._, [e.target.name]: e.target.value }));

  const onAvatarChange = (avatar: string) =>
    setUserDetails((_) => ({ ..._, avatar }));

  useEffect(() => {
    setTimezones(tz.map(({ tzCode }) => ({ id: tzCode, title: tzCode })));
  }, []);
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <BaseModal isExpanded={false} onClose={() => onClose()} title="Edit user">
      {isLoading ? (
        <Skeleton />
      ) : (
        <form noValidate>
          <Tabs
            tabs={[
              {
                title: "General",
                Icon: <OverviewIcon />,
                content: (
                  <>
                    <Input
                      onChange={onInputChange}
                      value={userDetails.name}
                      fullWidth
                      name="name"
                      StartIcon={<AvatarIcon size="xs" />}
                      label="Name"
                      autoFocus
                    />
                    <Input
                      onChange={onInputChange}
                      value={userDetails.email}
                      StartIcon={<EmailIcon size="xs" />}
                      label="Email"
                      type="email"
                      name="email"
                      fullWidth
                    />
                    <Input
                      onChange={onInputChange}
                      value={userDetails.password}
                      name="password"
                      StartIcon={<SecurityIcon size="xs" />}
                      label="Password"
                      type="password"
                      fullWidth
                    />
                    <div>
                      <p className="mb-1 text-sm font-bold text-neutral-500">
                        Timezone
                      </p>
                      <Select
                        popperProps={{
                          placement: "top",
                          popperClassName: "h-[251px]",
                        }}
                        label=""
                        options={timezones}
                        fullWidth
                        defaultValue={{
                          id: userDetails.timezone,
                          title: userDetails.timezone,
                        }}
                        onChange={onTimezoneChange}
                      />
                    </div>
                  </>
                ),
                tier: [Role.Teacher],
              },
              {
                title: "Avatar",
                Icon: <CameraIcon />,
                content: (
                  <div className="flex justify-center mx-[0] my-[23.5px]">
                    <AvatarUpload
                      onChange={onAvatarChange}
                      avatar={userDetails.avatar}
                    />
                  </div>
                ),
                tier: [Role.Teacher],
              },
            ]}
          />
          <hr className="mb-4" />
          <div className="flex justify-end gap-3">
            <button
              className="primary-button"
              type="button"
              onClick={submitEditUser}
            >
              {isSubmitting && (
                <img
                  className="loading-spinner"
                  src="/assets/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span className={`${clsx(isSubmitting && "opacity-0")}`}>
                Save
              </span>
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default CreateUserModal;
