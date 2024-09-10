import { useEffect, useRef } from "react";

function useUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    return effect();
  }, deps);
}

export default useUpdateEffect;
