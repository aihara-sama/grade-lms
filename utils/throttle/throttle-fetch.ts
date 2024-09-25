import { THROTTLE_FETCH_WAIT } from "@/constants";
import throttle from "lodash.throttle";

export const throttleFetch = (
  cb: (...args: any[]) => Promise<void>,
  wait = THROTTLE_FETCH_WAIT
) =>
  throttle(cb, wait, {
    leading: false,
    trailing: true,
  });
