import { navItems } from "@/components/header/nav-items";
import { supabaseClient } from "@/utils/supabase/client";
import { addMinutes, format } from "date-fns";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {}

const Nav: FunctionComponent<Props> = () => {
  const router = useRouter();

  const handleCreateLesson = async () => {
    const { error, data } = await supabaseClient
      .from("lessons")
      .insert({
        starts: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss"),
      })
      .select("id")
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      router.push(`/dashboard/lessons/${data.id}`);
    }
  };

  return (
    <div className="hidden md:flex items-center gap-8 ml-9">
      {navItems.map(({ title, href, Icon }, idx) => (
        <Link href={href} key={idx} className="flex items-center gap-2">
          <Icon />
          <span className="text-sm"> {title}</span>
        </Link>
      ))}

      <button className="primary-button" onClick={handleCreateLesson}>
        Quick lesson
      </button>
    </div>
  );
};

export default Nav;
