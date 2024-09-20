"use client";

import AvatarUpload from "@/components/avatar-upload";
import AvatarIcon from "@/components/icons/avatar-icon";
import CrownIcon from "@/components/icons/crown-icon";
import Input from "@/components/input";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Select from "@/components/common/select";
import SecurityIcon from "@/components/icons/security-icon";
import Switch from "@/components/switch";
import useUpdateEffect from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { Locale } from "@/i18n";
import { DEFAULT_LOCALE, locales } from "@/i18n";
import { type IUserMetadata } from "@/interfaces/user.interface";
import { browserDB } from "@/lib/supabase/db/browser-db";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Profile: FunctionComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations();
  const [isSubmittingRenameUser, setIsSubmittingRenameUser] = useState(false);
  const [isSubmittingChangePassword, setIsSubmittingChangePassword] =
    useState(false);

  const { user, setUser } = useUser();

  const [avatar, setAvatar] = useState(user.avatar);
  const [userName, setUserName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [isEmailsOn, setIsEmailsOn] = useState(user.is_emails_on);

  const [isPushNotificationsOn, setIsPushNotificationsOn] = useState(
    user.is_push_notifications_on
  );
  const locale = locales.includes(pathName.split("/")[1] as Locale)
    ? pathName.split("/")[1]
    : DEFAULT_LOCALE;

  const redirectedPathName = (_locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");

    segments.splice(0, 1, _locale);

    return `/${segments.join("/")}`;
  };

  const submitRenameUser = async () => {
    setIsSubmittingRenameUser(true);

    const { error: usersError } = await browserDB
      .from("users")
      .update({
        name: userName,
      })
      .eq("id", user.id);

    const { error: profileError } = await browserDB.auth.updateUser({
      data: {
        name: userName,
      } as IUserMetadata,
    });

    setIsSubmittingRenameUser(false);

    if (usersError || profileError) toast.error("Something went wrong");
    else {
      setUser({ ...user, name: userName });
      toast.success("Name changed");
    }
  };

  // Effects
  useEffect(() => {
    (async () => {
      if (avatar !== user.avatar) {
        const { error: usersError } = await browserDB
          .from("users")
          .update({
            avatar,
          })
          .eq("id", user.id);

        const { error: profileError } = await browserDB.auth.updateUser({
          data: {
            avatar,
          } as IUserMetadata,
        });

        if (usersError || profileError) toast.error("Something went wrong");
        else {
          setUser({ ...user, avatar });
          toast.success("Avatar changed");
        }
      }
    })();
  }, [avatar]);

  useUpdateEffect(() => {
    Promise.all([
      browserDB
        .from("users")
        .update({
          is_emails_on: isEmailsOn,
        })
        .eq("id", user.id),
      browserDB.auth.updateUser({
        data: {
          is_emails_on: isEmailsOn,
        },
      }),
    ]);
  }, [isEmailsOn]);
  useUpdateEffect(() => {
    Promise.all([
      browserDB
        .from("users")
        .update({
          is_push_notifications_on: isPushNotificationsOn,
        })
        .eq("id", user.id),
      browserDB.auth.updateUser({
        data: {
          is_push_notifications_on: isPushNotificationsOn,
        },
      }),
    ]);
  }, [isPushNotificationsOn]);

  const submitChangePreferredLocale = async (_locale: Locale) => {
    try {
      const [{ error: userError }, { error: profileError }] = await Promise.all(
        [
          browserDB
            .from("users")
            .update({
              preferred_locale: _locale,
            })
            .eq("id", user.id),
          browserDB.auth.updateUser({
            data: {
              preferred_locale: _locale,
            },
          }),
        ]
      );
      if (userError || profileError)
        throw new Error(t("failed_to_change_language"));
      router.push(redirectedPathName(_locale as Locale));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submiChangePassword = async () => {
    setIsSubmittingChangePassword(true);

    try {
      const { error } = await browserDB.auth.updateUser({
        password,
      });
      if (error) throw new Error(t(serverErrToIntlKey(error.message)));

      toast.success(t("password_changed"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingChangePassword(false);
    }
  };
  return (
    <div className="-mt-6">
      <div className="absolute left-0 right-0 h-40 bg-[url(/bubbled-bg.svg)] bg-cover bg-no-repeat bg-center">
        <div className="absolute top-[80px] sm:left-96 left-1/2 transform -translate-x-1/2 flex items-end gap-8 md:flex-row flex-col">
          <AvatarUpload avatar={avatar} onChange={setAvatar} />
          <div>
            <p className="text-2xl font-bold text-neutral-600">{user.name}</p>
            <p className="text-neutral-500">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="md:mt-72 mt-[350px]">
        <hr />
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">{t("profile")}</p>
          <div className="flex mt-3 items-end gap-[4px]">
            <Input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              fullWidth
              name="name"
              startIcon={<AvatarIcon size="xs" />}
              label="Name"
              autoFocus
              className="mb-auto"
            />
            <button
              disabled={
                userName === user.name ||
                !userName.length ||
                isSubmittingRenameUser
              }
              className="primary-button w-[100px]"
              onClick={submitRenameUser}
            >
              {isSubmittingRenameUser && (
                <img
                  className="loading-spinner"
                  src="/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span
                className={`${clsx(isSubmittingRenameUser && "opacity-0")}`}
              >
                Save
              </span>
            </button>
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">Preferences</p>
          <div className="flex flex-col gap-2 mt-3">
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
                submitChangePreferredLocale(id.toLocaleLowerCase() as Locale);
              }}
              defaultValue={{
                title: toCapitalCase(
                  new Intl.DisplayNames([user.preferred_locale], {
                    type: "language",
                  }).of(user.preferred_locale)
                ),
                id: toCapitalCase(locale),
              }}
            />
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">Security</p>
          <div className="flex mt-3 items-end gap-[4px]">
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              fullWidth
              name="password"
              startIcon={<SecurityIcon size="xs" />}
              label="Password"
              autoFocus
              className="mb-auto"
            />
            <button
              disabled={!password.length || isSubmittingChangePassword}
              className="primary-button"
              onClick={submiChangePassword}
            >
              {isSubmittingChangePassword && (
                <img
                  className="loading-spinner"
                  src="/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span
                className={`${clsx(isSubmittingChangePassword && "opacity-0")}`}
              >
                Change password
              </span>
            </button>
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl font-bold text-neutral-600">Plan</p>
          <div className="mt-3">
            <p className="text-neutral-500">
              You plan is <span className="font-bold">Basic</span>
            </p>
            <a
              className="button link-button w-40 mt-1"
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
