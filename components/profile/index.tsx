"use client";

import AvatarUpload from "@/components/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CrownIcon from "@/components/icons/crown-icon";
import Input from "@/components/input";
import { db } from "@/utils/supabase/client";
import { toCapitalCase } from "@/utils/to-capital-case";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Select from "@/components/common/select";
import type { Locale } from "@/i18n";
import { DEFAULT_LOCALE, locales } from "@/i18n";
import type { IUserMetadata } from "@/interfaces/user.interface";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface IProps {
  user: User;
}

const Profile: FunctionComponent<IProps> = ({ user }) => {
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations();

  const [avatar, setAvatar] = useState(
    (user.user_metadata as IUserMetadata).avatar
  );
  const [userName, setUserName] = useState(
    (user.user_metadata as IUserMetadata).name
  );
  const locale = locales.includes(pathName.split("/")[1] as Locale)
    ? pathName.split("/")[1]
    : DEFAULT_LOCALE;

  const redirectedPathName = (_locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments.splice(1, +(_locale === DEFAULT_LOCALE), _locale);
    return segments.join("/");
  };

  const handleRenameUser = async () => {
    const { error: usersError } = await db
      .from("users")
      .update({
        name: userName,
      })
      .eq("id", user.id);

    const { error: profileError } = await db.auth.updateUser({
      data: {
        name: userName,
      } as IUserMetadata,
    });

    if (usersError || profileError) toast.error("Something went wrong");
    else toast.success("Name changed");
  };

  useEffect(() => {
    (async () => {
      if (avatar !== (user.user_metadata as IUserMetadata).avatar) {
        const { error: usersError } = await db
          .from("users")
          .update({
            avatar,
          })
          .eq("id", user.id);

        const { error: profileError } = await db.auth.updateUser({
          data: {
            avatar,
          } as IUserMetadata,
        });

        if (usersError || profileError) toast.error("Something went wrong");
        else toast.success("Avatar changed");
      }
    })();
  }, [avatar]);

  return (
    <div>
      <div className="absolute left-0 right-0 top-[68px] h-40 bg-[url(/bubbled-bg.svg)] bg-cover bg-no-repeat bg-center">
        <div className="absolute top-[80px] sm:left-96 left-1/2 transform -translate-x-1/2 flex items-end gap-8 md:flex-row flex-col">
          <AvatarUpload avatar={avatar} onChange={setAvatar} />
          <div>
            <p className="text-2xl font-bold text-neutral-600">
              {(user.user_metadata as IUserMetadata).name}
            </p>
            <p className="text-neutral-500">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="md:mt-72 mt-[350px]">
        <hr />
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">{t("profile")}</p>
          <div className="flex mt-6 items-end gap-[4px]">
            <Input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              fullWIdth
              name="name"
              Icon={<AvatarIcon size="xs" />}
              label="Name"
              autoFocus
              className="mb-auto"
            />
            <button
              disabled={
                userName === (user.user_metadata as IUserMetadata).name ||
                !userName.length
              }
              className="primary-button w-[100px]"
              onClick={handleRenameUser}
            >
              Save
            </button>
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">Preferences</p>
          <div className="mt-8 flex gap-1">
            <Select
              options={locales.map((_locale: Locale) => ({
                title: toCapitalCase(
                  new Intl.DisplayNames([locale], {
                    type: "language",
                  }).of(_locale)
                ),
                id: toCapitalCase(_locale),
              }))}
              label="Language"
              onChange={({ id }) => {
                router.push(redirectedPathName(id.toLowerCase() as Locale));
              }}
              defaultValue={{
                title: toCapitalCase(
                  new Intl.DisplayNames([locale], {
                    type: "language",
                  }).of(locale)
                ),
                id: toCapitalCase(locale),
              }}
            />
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">Plan</p>
          <div className="mt-3">
            <p className="text-neutral-500">
              You plan is <span className="font-bold">Basic</span>
            </p>
            <a
              className="link-button w-40 mt-1"
              target="_blank"
              href={`/${locale}/subscription`}
            >
              <CrownIcon />
              Upgrade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
