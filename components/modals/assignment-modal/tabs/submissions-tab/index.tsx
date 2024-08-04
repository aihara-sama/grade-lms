import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import Table from "@/components/table";
import type { ISubmission } from "@/interfaces/submission.interface";
import type { FunctionComponent } from "react";

interface IProps {
  submissions: ISubmission[];
}

const SubmissionsTab: FunctionComponent<IProps> = ({ submissions }) => {
  return (
    <div>
      <Table
        data={submissions.map(({ id, author, created }) => ({
          Author: (
            <IconTitle
              Icon={<AvatarIcon size="md" />}
              key={id}
              title={author.name}
              subtitle={author.role}
              href={`/users/${id}`}
            />
          ),
          Submitted: created,
        }))}
      />
    </div>
  );
};

export default SubmissionsTab;
