"use client";

import type { Course } from "@/types/course.type";
import { createStore } from "zustand";

export interface CourseState {
  course: Course;
  setCourse: (course: Course) => void;
}

export type CourseStore = ReturnType<typeof createCourseStore>;

export const createCourseStore = (initCourse: Course) => {
  return createStore<CourseState>()((set) => ({
    course: initCourse,
    setCourse: (course: Course) => set({ course }),
  }));
};
