"use client";

import { deleteUser } from "@/actions/delete-user";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type FunctionComponent } from "react";
import DeleteButton from "../buttons/delete-button";
import CardsContainer from "../cards-container";
import IconTitle from "../icon-title";
import AvatarIcon from "../icons/avatar-icon";
import SearchIcon from "../icons/search-icon";
import Input from "../input";
import Table from "../table";
import Total from "../total";
import CreateUser from "./CreateUser";

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
