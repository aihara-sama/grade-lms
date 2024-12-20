import { revalidatePageAction } from "@/actions/revalidate-page-action";
import BasicSelect from "@/components/common/selects/basic-select";
import { updateUser } from "@/db/client/user";
import { useUser } from "@/hooks/use-user";
import { DEFAULT_LOCALE, locales, type Locale } from "@/i18n/routing";
import type { PropsWithClassName } from "@/types/props.type";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

const SelectLocale: FunctionComponent<PropsWithClassName> = ({ className }) => {
  // Hooks
  const t = useTranslations();

  const router = useRouter();
  const pathName = usePathname();

  const { user, setUser } = useUser((state) => state);

  // Vars
  const locale = locales.includes(pathName.split("/")[1] as Locale)
    ? pathName.split("/")[1]
    : DEFAULT_LOCALE;

  // Handlers
  const getRedirectedPathName = (_locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");

    segments.splice(0, 1, _locale);

    return `/${segments.join("/")}`;
  };

  const submitUpdateLocale = async (_locale: Locale) => {
    try {
      await updateUser({
        preferred_locale: _locale,
        id: user.id,
      });

      setUser({ ...user, preferred_locale: _locale });

      router.push(getRedirectedPathName(_locale as Locale));
      revalidatePageAction();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // View
  return (
    <div className={`flex ${className}`}>
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
          submitUpdateLocale(id.toLocaleLowerCase() as Locale);
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
  );
};
export default SelectLocale;
