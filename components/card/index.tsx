"use client";

import type { FunctionComponent, ReactNode } from "react";

interface Props {
  Icon: ReactNode;
  action: string;
  actionHandler: () => void;
}

const Card: FunctionComponent<Props> = ({ Icon, action, actionHandler }) => {
  return (
    <div className="card">
      {Icon}
      <hr className="w-full my-3" />
      <button className="primary-button px-8" onClick={actionHandler}>
        {action}
      </button>
    </div>
  );
};

export default Card;
