"use client";

import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import EnrollUsers from "@/components/users/enroll-users";
import { ROLES } from "@/interfaces/user.interface";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";
import BetterTable from "../../better-table";
import Total from "../../total";

interface IProps {
  courseId: string;
}
const Members: FunctionComponent<IProps> = ({ courseId }) => {
  const [members, setMembers] = useState<
    Database["public"]["Tables"]["users"]["Row"][]
  >([]);

  const getMembers = async () => {
    const data = await supabaseClient
      .from("courses")
      .select("id, users(*)")
      .eq("id", courseId)
      .single();

    setMembers(data.data.users);
  };
  const dispel = async (userId: string) => {
    const { error } = await supabaseClient
      .from("user_courses")
      .delete()
      .eq("user_id", userId);

    if (error) {
      toast(error.message);
    } else {
      toast("User dispelled");
      getMembers();
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <>
      <p className="section-title">Members</p>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={members.length}
          title="Total members"
        />
        <EnrollUsers onDone={getMembers} courseId={courseId} />
      </CardsContainer>
      <Input Icon={<SearchIcon />} placeholder="Search" />
      <BetterTable
        data={members.map(({ name, role, id }) => ({
          Name: (
            <IconTitle
              Icon={<AvatarIcon size="lg" />}
              key={id}
              title={name}
              subtitle={role}
              href={`/users/${id}`}
            />
          ),
          Action: role === ROLES.STUDENT && (
            <button
              className="outline-button"
              key={id}
              onClick={() => dispel(id)}
            >
              Dispel
            </button>
          ),
        }))}
      />
    </>
  );
};

export default Members;
