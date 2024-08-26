import { useEffect, useState } from "react";

let value = 0;

export const useValue = () => {
  const [x, setX] = useState(0);

  console.log({ x, value });

  useEffect(() => {
    setX((_) => _ + 1);
    value += 1;

    return () => {
      console.log("destroying");
    };
  }, []);
  return x;
};
