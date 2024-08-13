import BaseModal from "@/components/common/modals/base-modal";
import IconTitle from "@/components/icon-title";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import StarIcon from "@/components/icons/star-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import type { SubmissionWithAuthor } from "@/types/submissions.type";
import { supabaseClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  submissionId: string;
}
const ViewSubmissionModal: FunctionComponent<IProps> = ({
  onDone,
  submissionId,
  isOpen,
  setIsOpen,
}) => {
  const [submission, setSubmission] = useState<SubmissionWithAuthor>();
  const [grade, setGrade] = useState<number>();
  const [hoveredGrade, setHoveredGrade] = useState<number>();

  const handleSubmitGrade = async () => {
    const { error } = await supabaseClient
      .from("submissions")
      .update({ grade })
      .eq("id", submission.id);

    if (error) {
      toast.error("Something went wrong");
    } else {
      toast.success("Grade changed");
      setIsOpen(false);
      onDone();
    }
  };

  useEffect(() => {
    (async () => {
      const { error, data } = await supabaseClient
        .from("submissions")
        .select("*, author:users(*)")
        .eq("id", submissionId)
        .single();
      if (error) {
        toast.error("Something went wrong");
        setIsOpen(false);
      } else {
        setSubmission(data);
        setGrade(data.grade);
      }
    })();
  }, []);

  return (
    <BaseModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      header="Submission"
    >
      {!submission ? (
        <Skeleton className="min-h-[471px]" />
      ) : (
        <div>
          <Input
            disabled
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
            placeholder="Submission name"
            name="title"
            value={submission.title}
          />
          <p>Description</p>
          <div className="min-h-[320px]">
            <Editor
              readOnly
              onChange={() => {}}
              data={JSON.parse(submission.body)}
            />
          </div>
          <div className="flex gap-3 items-center mt-3">
            <div className="flex-1">
              <p className="mb-1">Author</p>
              <IconTitle
                Icon={<AvatarIcon size="md" />}
                title={submission.author.name}
                subtitle={submission.author.role}
                href={`/users/${submission.author.id}`}
              />
            </div>
            <div className="flex gap-2 items-center text-neutral-500">
              {new Array(5).fill(0).map((_, idx) => (
                <div
                  className="flex"
                  onClick={() => setGrade(idx + 1)}
                  onMouseEnter={() => setHoveredGrade(idx + 1)}
                  onMouseLeave={() => setHoveredGrade(undefined)}
                >
                  <StarIcon
                    className={`hover:text-amber-400 cursor-pointer ${idx + 1 <= hoveredGrade || idx + 1 <= grade ? "text-amber-400" : ""} `}
                    key={idx}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmitGrade}
              disabled={submission.grade === grade}
              className="primary-button w-[100px]"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default ViewSubmissionModal;
