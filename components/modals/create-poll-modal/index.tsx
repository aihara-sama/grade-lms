import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { supabaseClient } from "@/utils/supabase/client";
import { type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  closeModal: () => void;
  lessonId: string;
  author: string;
  onDone: () => void;
}

const CreatePollModal: FunctionComponent<IProps> = ({
  closeModal,
  lessonId,
  author,
  onDone,
}) => {
  const handleCreatePoll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabaseClient.rpc(
      "create_poll_with_options_and_message",
      {
        lesson_id: lessonId,
        poll_title: formData.get("title") as string,
        poll_options: (formData.getAll("polls") as string[]).map((title) => ({
          title,
        })),
        author,
      }
    );

    if (error) {
      toast(error.message);
    } else {
      toast.success("Poll created");
      closeModal();
      onDone();
    }
  };

  return (
    <Modal
      close={closeModal}
      title="Create poll"
      content={
        <form onSubmit={handleCreatePoll}>
          <Input
            bottomSpacing
            fullWidth
            placeholder="Title"
            name="title"
            Icon={<CoursesIcon size="sm" />}
          />
          <Input
            bottomSpacing
            fullWidth
            placeholder="Option 1"
            name="polls"
            Icon={<CourseIcon size="sm" />}
          />
          <Input
            bottomSpacing
            fullWidth
            placeholder="Option 2"
            name="polls"
            Icon={<CourseIcon size="sm" />}
          />
          <Input
            bottomSpacing
            fullWidth
            placeholder="Option 3"
            name="polls"
            Icon={<CourseIcon size="sm" />}
          />
          <button className="primary-button w-full" type="submit">
            Create
          </button>
        </form>
      }
    />
  );
};

export default CreatePollModal;
