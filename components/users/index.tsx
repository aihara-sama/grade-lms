"use client";

import { deleteUser } from "@/actions/delete-user";
import DeleteButton from "@/components/buttons/delete-button";
import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import AvatarIcon from "@/components/icons/avatar-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import Table from "@/components/table";
import Total from "@/components/total";
import CreateUser from "@/components/users/create-user";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  user: User;
}

const Users: FunctionComponent<IProps> = ({ user }) => {
  const [isDeleteBulkUsersModalOpen, setIsDeleteBulkUsersModalOpen] =
    useState(false);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [users, setUsers] = useState<
    Database["public"]["Tables"]["users"]["Row"][]
  >([]);

  const getUsers = async () => {
    const data = await supabaseClient
      .from("users")
      .select("*")
      .eq("creator_id", user.id);
    setUsers(data.data);
  };
  const handleBulkDeleteUsers = async () => {
    const { error } = await supabaseClient
      .from("users")
      .delete()
      .in("id", usersIds);

    if (error) toast.error("Something went wrong");

    setUsersIds([]);
    setIsDeleteBulkUsersModalOpen(false);

    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <CardsContainer>
        <Total
          Icon={<AvatarIcon size="lg" />}
          total={users.length}
          title="Total users"
        />
        <CreateUser onDone={getUsers} />
      </CardsContainer>
      {!usersIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteBulkUsersModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      )}
      <Table
        data={users.map(({ name, role, id, avatar }) => ({
          Name: (
            <CardTitle
              href={`/users/${id}`}
              checked={usersIds.includes(id)}
              Icon={
                <img
                  className="[border-radius:50%] w-8 h-8"
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`}
                  alt=""
                />
              }
              title={name}
              subtitle={role}
              onClick={() => {}}
              onToggle={(checked) =>
                checked
                  ? setUsersIds((prev) => [...prev, id])
                  : setUsersIds((prev) => prev.filter((_id) => _id !== id))
              }
            />
          ),
          Action: (
            <DeleteButton
              onDone={getUsers}
              action={deleteUser}
              record="user"
              id={id}
              key={id}
            />
          ),
        }))}
      />
      {isDeleteBulkUsersModalOpen && (
        <Modal
          close={() => setIsDeleteBulkUsersModalOpen(false)}
          title="Delete Users"
          content={
            <>
              <p className="mb-4">
                Are you sure you want to delete selected users?
              </p>
              <div className="group-buttons">
                <button
                  className="outline-button w-full"
                  onClick={() => setIsDeleteBulkUsersModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleBulkDeleteUsers}
                >
                  Delete
                </button>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Users;
