import Link from "next/link";
import type { FunctionComponent } from "react";

interface IProps {
  title: string;
  duration: string;
  lessonId: string;
  courseId: string;
}

const CurrentLessonCard: FunctionComponent<IProps> = ({
  title,
  duration,
  lessonId,
}) => {
  return (
    <div className="relative flex-1 p-6 flex flex-col items-center justify-center">
      <img
        src="/current-lesson-frame.svg"
        alt=""
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      />
      <p className="text-sm mb-[8px] text-light">Ongoing lesson</p>
      <p className="text-xl font-bold">{title}</p>
      <hr className="w-48 mb-2" />
      <p className="mb-1">Running for</p>
      <p className="mb-3 font-bold">{duration}</p>
      <Link
        className="link-button w-64"
        href={`/dashboard/lessons/${lessonId}`}
      >
        Enter class
      </Link>
    </div>
  );
};

export default CurrentLessonCard;
