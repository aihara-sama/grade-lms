"use client";

import CardsContainer from "@/components/cards-container";
import DashboardSchedule from "@/components/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Total from "@/components/total";
import type { User } from "@supabase/supabase-js";
import { useState, type FunctionComponent } from "react";

interface IProps {
  user: User;
  totalCoursesCount: number;
  totalUsersCount: number;
}

const Dashboard: FunctionComponent<IProps> = ({
  user,
  totalUsersCount,
  totalCoursesCount,
}) => {
  const [usersCount] = useState(totalUsersCount);
  const [coursesCount] = useState(totalCoursesCount);

  // const fetchUsersCount = () =>
  //   supabaseClient
  //     .from("users")
  //     .select("courses(count)")
  //     .eq("id", user.id)
  //     .returns<Record<"courses", { count: number }[]>[]>()
  //     .single();

  // const fetchCoursesCount = () =>
  //   supabaseClient
  //     .from("users")
  //     .select("count")
  //     .eq("creator_id", user.id)
  //     .returns<Record<"users", { count: number }[]>[]>();

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <CardsContainer>
          <Total
            Icon={<CoursesIcon size="lg" />}
            total={coursesCount}
            title="Total courses"
          />
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={usersCount}
            title="Total users"
          />
        </CardsContainer>
        <hr className="mt-4" />
      </div>
      <DashboardSchedule user={user} />
    </div>
  );
};

export default Dashboard;
