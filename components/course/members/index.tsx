"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import AvatarIcon from "@/components/icons/avatar-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import Table from "@/components/table";
import Total from "@/components/total";
import EnrollUsers from "@/components/users/enroll-users";
import { ROLES } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

import IconTitle from "@/components/icon-title";
import type { Database } from "@/types/supabase.type";
import type { User as IUser } from "@supabase/supabase-js";

interface IProps {
  courseId: string;
  user: IUser;
}
const Members: FunctionComponent<IProps> = ({ courseId, user }) => {
  const [isDeleteBulkMembersModalOpen, setIsDeleteBulkMembersModalOpen] =
    useState(false);
  const [membersIds, setMembersIds] = useState<string[]>([]);
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

  const handleBulkDispelMembers = async () => {
    const { error } = await supabaseClient
      .from("user_courses")
      .delete()
      .in("user_id", membersIds);

    if (error) toast.error("Something went wrong");

    setMembersIds([]);
    setIsDeleteBulkMembersModalOpen(false);

    getMembers();
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
      {!membersIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteBulkMembersModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Dispel <DeleteIcon />
          </button>
        </div>
      )}
      <Table
        data={members.map(({ name, role, id }) => ({
          Name:
            user.id === id ? (
              <IconTitle
                Icon={<AvatarIcon size="md" />}
                key={id}
                title={name}
                subtitle={role}
                href={`/users/${id}`}
              />
            ) : (
              <CardTitle
                href={`/users/${id}`}
                checked={membersIds.includes(id)}
                Icon={<AvatarIcon size="md" />}
                title={name}
                subtitle={role}
                onClick={() => {}}
                onToggle={(checked) =>
                  checked
                    ? setMembersIds((prev) => [...prev, id])
                    : setMembersIds((prev) => prev.filter((_id) => _id !== id))
                }
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
      {isDeleteBulkMembersModalOpen && (
        <Modal
          close={() => setIsDeleteBulkMembersModalOpen(false)}
          title="Dispel Members"
          content={
            <>
              <p className="mb-4">
                Are you sure you want to dispel selected members?
              </p>
              <div className="group-buttons">
                <button
                  className="outline-button w-full"
                  onClick={() => setIsDeleteBulkMembersModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleBulkDispelMembers}
                >
                  Dispel
                </button>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Members;
