import { useEffect, useRef } from "react";

export const useUpdateEffect = (
  effect: React.EffectCallback,
  deps: React.DependencyList
) => {
  // Refs
  const isFirstRender = useRef(true);

  // Effects
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    return effect();
  }, deps);
};
