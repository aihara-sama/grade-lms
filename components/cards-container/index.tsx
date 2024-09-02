import type { FunctionComponent, PropsWithChildren } from "react";

interface Props {
  title?: string;
}

const CardsContainer: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <div className="mb-6">
      {title && <p className="section-title">{title}</p>}
      <div className="flex flex-wrap gap-6">{children}</div>
    </div>
  );
};

export default CardsContainer;
