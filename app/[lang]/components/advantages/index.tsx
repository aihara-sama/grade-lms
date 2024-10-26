import type { PropsWithClassName } from "@/types/props.type";
import type { FunctionComponent } from "react";

const advantages: {
  title: string;
}[] = [
  {
    title: "Personalized training experience",
  },
  {
    title: "Revolutionized scheduling method",
  },
  {
    title: "Live updates to everything important",
  },
  {
    title: "Simplicity and efficiency",
  },
];

const Advantages: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <section className={`${className} container`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <h1 className="text-2xl font-semibold mb-8">
            Manage everything, all in one place
          </h1>
          <div className="pl-5 flex flex-col gap-2">
            {advantages.map(({ title }, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="bg-black size-[10px]"></span>
                <p className="text-neutral-500 font-semibold">{title}</p>
              </div>
            ))}
          </div>
        </div>
        <img src="/assets/svg/manage-everything.svg" alt="" />
      </div>
    </section>
  );
};

export default Advantages;
