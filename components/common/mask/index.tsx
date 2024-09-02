import clsx from "clsx";
import { useEffect, useState, type FunctionComponent } from "react";

interface Props {
  onClick: () => void;
}

const Mask: FunctionComponent<Props> = ({ onClick }) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 backdrop-filter z-[99]  transition-all ${clsx(hasRendered && "backdrop-blur-[2px] bg-mask visible")}`}
      onClick={onClick}
    ></div>
  );
};

export default Mask;
