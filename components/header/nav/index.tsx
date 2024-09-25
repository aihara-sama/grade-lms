import QuickLessonButton from "@/components/buttons/quick-lesson-button";
import { menu } from "@/components/header/menu";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { PropsWithClassName } from "@/types/props.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Nav: FunctionComponent<PropsWithClassName> = async ({
  className = "",
}) => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  const view = user.user_metadata.role;

  return (
    <div className={`hidden md:flex items-center gap-6 ml-9 ${className}`}>
      {menu
        .filter(({ views }) => views.includes(view))
        .map(({ title, href, Icon }, idx) => (
          <Link href={`${href}`} key={idx} className="flex items-center gap-2">
            {Icon}
            <span className="text-sm"> {title}</span>
          </Link>
        ))}

      {view === "Teacher" && <QuickLessonButton />}
    </div>
  );
};

export default Nav;
