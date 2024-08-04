import type { FunctionComponent, PropsWithChildren } from "react";

interface IProps {
  title?: string;
}

const CardsContainer: FunctionComponent<PropsWithChildren<IProps>> = ({
  children,
  title,
}) => {
  return (
    <div className="mb-[24px]">
      {title && <p className="section-title">{title}</p>}
      <div className="flex flex-wrap gap-6">{children}</div>
    </div>
  );
};

export default CardsContainer;
