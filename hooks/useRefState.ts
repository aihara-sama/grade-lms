import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { useRef, useState } from "react";

export const useRefState = <T>(
  state: T
): [MutableRefObject<T>, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(state);
  const valueRef = useRef<typeof value>(value);

  valueRef.current = value;

  return [valueRef, setValue];
};
