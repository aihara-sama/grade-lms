"use client";

import { SomeContext } from "@/components/provider";
import { useContext } from "react";

const Cmp = () => {
  const { value, setValue } = useContext(SomeContext);

  return (
    <div>
      Cmp {value}
      <div>
        <button onClick={() => setValue(213)}>Set value</button>
      </div>
    </div>
  );
};

export default Cmp;
