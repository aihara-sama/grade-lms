import { THROTTLE_WAIT } from "@/constants";
import throttle from "lodash.throttle";

export const throttleFetch = (cb: () => void) =>
  throttle(cb, THROTTLE_WAIT, {
    leading: true,
    trailing: false,
  });
