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
        useFullWidth
        rows={submissions.map(({ author, id, created }) => [
          <IconTitle
            Icon={<AvatarIcon size="lg" />}
            key={id}
            title={author.name}
            subtitle={author.role}
            href={`/users/${id}`}
          />,
          created,
        ])}
        titles={["Author", "Submitted"]}
      />
    </div>
  );
};

export default SubmissionsTab;
