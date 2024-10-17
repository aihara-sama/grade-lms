"use client";

import Avatar from "@/components/common/avatar";
import IconTitle from "@/components/common/icon-title";
import type { getCourse } from "@/db/server/course";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  users: ResultOf<typeof getCourse>["users"];
}

const Students: FunctionComponent<Props> = ({ users }) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div className="mt-4 flex flex-col flex-1">
      <p className="mb-2 font-bold">{t("course.students")}</p>
      <div className="flex-1 p-4 rounded-lg max-h-[464px] overflow-auto shadow-md">
        {users.map((user, idx, arr) => (
          <div key={idx} className="mb-4 [&:last-child]:mb-0">
            <div className="flex justify-between items-center mb-4">
              <IconTitle
                Icon={<Avatar avatar={user.avatar} />}
                href={`/users/${user.id}`}
                title={user.name}
                subtitle={t(`roles.${user.user_settings.role}`)}
              />
            </div>
            {idx !== arr.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
