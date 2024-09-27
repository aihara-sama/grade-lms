import type { UserStore } from "@/stores/user-store";
import { createContext } from "react";

export const UserContext = createContext<UserStore>(null);
