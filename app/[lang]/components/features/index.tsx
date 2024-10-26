import type { IconSize } from "@/components/icons";
import CalendarIcon from "@/components/icons/calendar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const features: {
  Icon: FunctionComponent<{ size?: keyof typeof IconSize }>;
  title: string;
  description: string;
}[] = [
  {
    Icon: UsersIcon,
    title: "Users management",
    description: "Create and manage users effectively",
  },
  {
    Icon: LessonsIcon,
    title: "Real-time Lessons",
    description:
      "Attend live lessons and interact with your trainee in real-time",
  },
  {
    Icon: CalendarIcon,
    title: "Personalized Schedules",
    description:
      "Manage your lessons and events with timezone-aware scheduling. Never miss a session!",
  },
];

const Features: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <section className={`${className} container`}>
      <h1 className="text-3xl font-bold mb-8 text-center">Our Features</h1>
      <div className="flex flex-col md:flex-row justify-between gap-5 items-stretch">
        {features.map(({ Icon, title, description }, idx) => (
          <div
            key={idx}
            className="w-full md:w-96 rounded-md flex flex-col gap-2 shadow-md p-6 "
          >
            <Icon size="sm" />
            <p className="text-neutral-600 text-lg font-bold">{title}</p>
            <p className="text-neutral-500 text-sm">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
