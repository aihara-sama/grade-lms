import type { FunctionComponent } from "react";

interface IProps {
  onClick: () => void;
}

const Hamburger: FunctionComponent<IProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex md:hidden h-5 w-6 z-[2] flex-col justify-between cursor-pointer ml-4 left-5 top-4"
    >
      {[...Array(3)].map((_, idx) => (
        <span className="block h-1 w-full rounded-lg bg-black" key={idx} />
      ))}
    </div>
  );
};

export default Hamburger;
