import type { IconSize } from "@/components/icons";
import ActivityIcon from "@/components/icons/activity-icon";
import OverviewIcon from "@/components/icons/dashboard-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const advantages: {
  Icon: FunctionComponent<{ size?: keyof typeof IconSize }>;
  title: string;
  description: string;
}[] = [
  {
    Icon: WhiteboardIcon,
    title: "Digital whiteboard",
    description: "Modern approach to collaboration",
  },
  {
    Icon: OverviewIcon,
    title: "Control your workspace",
    description: "Dedicated tools to manage everything",
  },
  {
    Icon: ActivityIcon,
    title: "Simplicity and efficiency",
    description: "All you need at hand",
  },
];

const Services: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <section className={`${className} container`}>
      <h1 className="text-3xl font-semibold mb-12 text-center">
        A training platform that just works
      </h1>
      <div className="flex flex-col md:flex-row justify-between gap-3 items-stretch">
        {advantages.map(({ Icon, title, description }, idx) => (
          <div
            key={idx}
            className="w-full md:w-80 rounded-md flex items-center px-5 py-7 gap-6 shadow-md p-6"
          >
            <Icon size="sm" />
            <div>
              <p className="text-neutral-600 font-semibold">{title}</p>
              <p className="text-neutral-500 text-sm">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
