import { menu } from "@/components/header/menu";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { DB } from "@/lib/supabase/db/browser-db";
import type { PropsWithClassName } from "@/types";
import { addMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

const Nav: FunctionComponent<PropsWithClassName> = ({ className = "" }) => {
  // Hooks
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();

  const submitCreateLesson = async () => {
    try {
      const { error, data } = await DB.from("lessons")
        .insert({
          starts: new Date().toISOString(),
          ends: addMinutes(new Date(), 30).toISOString(),
          creator_id: user.id,
        })
        .select("id")
        .single();

      if (error) throw new Error(t("failed_to_create_lesson"));
      router.push(`/dashboard/lessons/${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`hidden md:flex items-center gap-6 ml-9 ${className}`}>
      {menu
        .filter(({ tier }) => tier.includes(user.role))
        .map(({ title, href, Icon }, idx) => (
          <Link href={`${href}`} key={idx} className="flex items-center gap-2">
            {Icon}
            <span className="text-sm"> {title}</span>
          </Link>
        ))}

      {user.role === Role.Teacher && (
        <button className="primary-button" onClick={submitCreateLesson}>
          Quick lesson
        </button>
      )}
    </div>
  );
};

export default Nav;
