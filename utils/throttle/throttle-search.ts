import { THROTTLE_SEARCH_WAIT } from "@/constants";
import throttle from "lodash.throttle";

export const throttleSearch = (
  cb: (...args: any[]) => void,
  wait = THROTTLE_SEARCH_WAIT
) =>
  throttle(cb, wait, {
    leading: true,
    trailing: true,
  });
