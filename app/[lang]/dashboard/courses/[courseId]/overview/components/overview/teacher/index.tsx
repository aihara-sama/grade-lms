"use client";

import Avatar from "@/components/common/avatar";
import IconTitle from "@/components/common/icon-title";
import type { User } from "@/types/user.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  teacher: User;
}

const Teacher: FunctionComponent<Props> = ({ teacher }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div className="mt-10">
      <p className="mb-2 font-bold">{t("roles.teacher")}</p>
      <div className="flex justify-between items-center p-3 rounded-lg shadow-md">
        <IconTitle
          Icon={<Avatar avatar={teacher.avatar} />}
          href={`/users/${teacher.id}`}
          title={teacher.name}
          subtitle={t("roles.teacher")}
        />
      </div>
    </div>
  );
};

export default Teacher;
