"use client";

import AvatarUpload from "@/components/common/avatar-upload";
import CrownIcon from "@/components/icons/crown-icon";
import { useState } from "react";
import toast from "react-hot-toast";

import General from "@/app/[lang]/dashboard/profile/components/general";
import Preferences from "@/app/[lang]/dashboard/profile/components/preferences";
import Security from "@/app/[lang]/dashboard/profile/components/security";
import Container from "@/components/layout/container";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { UserMetadata } from "@supabase/supabase-js";
import type { NextPage } from "next";
import { useTranslations } from "next-intl";

const Page: NextPage = () => {
  // Hooks
  const { user, setUser } = useUser((state) => state);
  const t = useTranslations();

  // State
  const [avatar, setAvatar] = useState(user.avatar);

  // Effects
  useUpdateEffect(() => {
    (async () => {
      try {
        await DB.auth.updateUser({
          data: {
            avatar,
          } as UserMetadata,
        });

        setUser({ ...user, avatar });

        toast.success(t("success.avatar_changed"));
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [avatar]);

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
            <p className="text-neutral-500">
              {t.rich("profile.your_plan_is basic", {
                b: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </p>
            <a
              className="button link-button w-40 mt-1"
              target="_blank"
              href={`/${user.preferred_locale}/subscription`}
            >
              <CrownIcon />
              {t("links.upgrade")}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
