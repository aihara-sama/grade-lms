"use client";

import { deleteUser } from "@/actions/delete-user";
import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import CreateUser from "@/components/users/create-user";
import { supabaseClient } from "@/helpers/supabase/client";
import type { Database } from "@/types/supabase.type";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  user: User;
}

const Users: FunctionComponent<IProps> = ({ user }) => {
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
      <Input Icon={<SearchIcon />} placeholder="Search" />
      <Table
        data={users.map(({ name, role, id }) => ({
          Name: (
            <IconTitle
              Icon={<AvatarIcon size="lg" />}
              key={id}
              title={name}
              subtitle={role}
              href={`/users/${id}`}
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
    </>
  );
};

export default Users;
