"use client";

import {
  createContext,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";

export const SomeContext = createContext(null);

const Provider: FunctionComponent<PropsWithChildren<{ state: string }>> = ({
  state,
  children,
}) => {
  const [value, setValue] = useState(state);

  return (
    <SomeContext.Provider value={{ value, setValue }}>
      {children}
    </SomeContext.Provider>
  );
};

export default Provider;
