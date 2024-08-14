"use client";

import { deleteUser } from "@/actions/delete-user";
import DeleteButton from "@/components/buttons/delete-button";
import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import AvatarIcon from "@/components/icons/avatar-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import CreateUser from "@/components/users/create-user";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { UserCourses } from "@/types/user-courses.type";
import type { User } from "@/types/users";
import type { User as IUser } from "@supabase/supabase-js";
import type { FunctionComponent } from "react";

const parseUsersCoursesIds = (usersIds: string[], coursesIds: string[]) => {
  const userCourses: Omit<UserCourses, "created_at">[] = [];

  for (let idx = 0; idx < usersIds.length; idx++) {
    const userId = usersIds[idx];

    for (let i = 0; i < coursesIds.length; i++) {
      const courseId = coursesIds[i];

      userCourses.push({
        course_id: courseId,
        user_id: userId,
      });
    }
  }

  return userCourses;
};

interface IProps {
  user: IUser;
}

const Users: FunctionComponent<IProps> = ({ user }) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<
    (Course & {
      lessons: Lesson[];
      users: User[];
    })[]
  >([]);
  const [isDeleteUsersModalOpen, setIsDeleteUsersModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [coursesIds, setCoursesIds] = useState<string[]>([]);
  const [enrollUserId, setEnrollUserId] = useState("");

  // Handlers
  const getUsers = async () => {
    const data = await supabaseClient
      .from("users")
      .select("*")
      .eq("creator_id", user.id);
    setUsers(data.data);
  };
  const handleDeleteUsers = async () => {
    const { error } = await supabaseClient
      .from("users")
      .delete()
      .in("id", usersIds);

    if (error) toast.error("Something went wrong");

    setUsersIds([]);
    setIsDeleteUsersModalOpen(false);

    getUsers();
  };
  const handleEnrollUsers = async (
    _usersIds: string[],
    _coursesIds: string[]
  ) => {
    const { error } = await supabaseClient
      .from("user_courses")
      .upsert(parseUsersCoursesIds(_usersIds, _coursesIds));

    if (error) {
      toast(error.message);
    } else {
      toast("Users enrolled");
      setIsEnrollUsersModalOpen(false);
    }
  };
  const getCourses = async () => {
    const data = await supabaseClient
      .from("users")
      .select("id, courses(*, lessons(*), users(*))")
      .eq("id", user.id)
      .single();

    setCourses(data.data.courses);
  };
  const getUnenrolledCourses = async (userId: string) => {
    const data = await supabaseClient
      .rpc("get_courses_not_assigned_to_user", {
        p_user_id: userId,
      })
      .returns<typeof courses>();

    setCourses(data.data);
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
        <CreateUser user={user} onDone={getUsers} />
      </CardsContainer>
      {!usersIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3 gap-2 flex">
          <button
            onClick={() => {
              setIsEnrollUsersModalOpen(true);
              getCourses();
            }}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Enroll <CoursesIcon />
          </button>
          <button
            onClick={() => setIsDeleteUsersModalOpen(true)}
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
                  className="rounded-[50%] w-8 h-8"
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
            <div className="flex gap-2">
              <DeleteButton
                onDone={getUsers}
                action={deleteUser}
                record="user"
                id={id}
                key={id}
              />
              <button
                className="primary-button w-auto"
                onClick={() => {
                  setEnrollUserId(id);
                  setIsEnrollUsersModalOpen(true);
                  getUnenrolledCourses(id);
                }}
              >
                Enroll
              </button>
            </div>
          ),
        }))}
      />
      <BaseModal
        setIsOpen={(isOpen) => setIsDeleteUsersModalOpen(isOpen)}
        isOpen={isDeleteUsersModalOpen}
        title="Delete Users"
      >
        <p className="mb-4">Are you sure you want to delete selected users?</p>
        <div className="flex justify-end gap-3">
          <button
            className="outline-button w-full"
            onClick={() => setIsDeleteUsersModalOpen(false)}
          >
            Cancel
          </button>
          <button className="primary-button" onClick={handleDeleteUsers}>
            Delete
          </button>
        </div>
      </BaseModal>
      <BaseModal
        isOpen={isEnrollUsersModalOpen}
        setIsOpen={(isOpen) => setIsEnrollUsersModalOpen(isOpen)}
        title="Enrollment"
      >
        <p className="mb-3 text-neutral-500">Select courses to enroll</p>
        <Table
          data={courses.map(({ id, title }) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${id}/overview`}
                checked={coursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle="Active"
                onClick={() => {}}
                onToggle={(checked) =>
                  checked
                    ? setCoursesIds((prev) => [...prev, id])
                    : setCoursesIds((prev) => prev.filter((_id) => _id !== id))
                }
              />
            ),
          }))}
        />
        <div className="flex justify-end gap-3">
          <button
            className="outline-button w-full"
            onClick={() => setIsEnrollUsersModalOpen(false)}
          >
            Cancel
          </button>
          <button
            disabled={!coursesIds.length}
            className="primary-button"
            onClick={() =>
              handleEnrollUsers(
                enrollUserId ? [enrollUserId] : usersIds,
                coursesIds
              )
            }
          >
            Enroll
          </button>
        </div>
      </BaseModal>
    </>
  );
};

export default Users;
