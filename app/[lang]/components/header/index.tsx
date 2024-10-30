"use client";

import Logo from "@/components/common/logo";
import BasicSelect from "@/components/common/selects/basic-select";
import type { Locale } from "@/i18n/routing";
import { locales, usePathname, useRouter } from "@/i18n/routing";
import type { PropsWithClassName } from "@/types/props.type";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { startTransition, type FunctionComponent } from "react";

const Header: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  console.log({ locale });

  const changeLocale = (_locale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: _locale }
      );
    });
  };

  // View
  return (
    <header className={`p-4 flex justify-between ${className}`}>
      <Logo />
      <div className="flex items-center gap-3">
        <BasicSelect
          options={locales.map((_locale: Locale) => ({
            title: toCapitalCase(
              new Intl.DisplayNames([locale], {
                type: "language",
              }).of(_locale)
            ),
            id: toCapitalCase(_locale),
          }))}
          label={t("labels.language")}
          onChange={({ id }) => {
            changeLocale(id.toLocaleLowerCase() as Locale);
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
        <Link className="button link-button" href="/sign-up">
          {t("buttons.sign_up")}
        </Link>
      </div>
    </header>
  );
};

export default Header;
