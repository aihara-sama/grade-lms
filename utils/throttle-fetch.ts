import { THROTTLE_WAIT } from "@/constants";
import throttle from "lodash.throttle";

export const throttleFetch = (cb: (...args: any[]) => void) =>
  throttle(cb, THROTTLE_WAIT, {
    leading: false,
    trailing: true,
  });
