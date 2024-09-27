import type { LessonStore } from "@/stores/lesson-store";
import { createContext } from "react";

export const LessonContext = createContext<LessonStore>(null);
