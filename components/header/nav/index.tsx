import {
  studentNavItems,
  teacherNavItems,
} from "@/components/header/nav-items";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { addMinutes, format } from "date-fns";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

const Nav: FunctionComponent<Props> = ({ user }) => {
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

  const getNavItems = () => {
    if ((user.user_metadata as IUserMetadata).role === Role.TEACHER)
      return teacherNavItems;
    if ((user.user_metadata as IUserMetadata).role === Role.STUDENT)
      return studentNavItems;
    return [];
  };

  return (
    <div className="hidden md:flex items-center gap-8 ml-9">
      {getNavItems().map(({ title, href, Icon }, idx) => (
        <Link href={href} key={idx} className="flex items-center gap-2">
          <Icon />
          <span className="text-sm"> {title}</span>
        </Link>
      ))}

      {(user.user_metadata as IUserMetadata).role === Role.TEACHER && (
        <button className="primary-button" onClick={handleCreateLesson}>
          Quick lesson
        </button>
      )}
    </div>
  );
};

export default Nav;
