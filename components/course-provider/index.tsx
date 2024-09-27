"use client";

import type { CourseStore } from "@/stores/course-store";
import { createCourseStore } from "@/stores/course-store";
import type { Course } from "@/types/course.type";
import type { FunctionComponent, PropsWithChildren } from "react";
import { createContext, useRef } from "react";

export const CourseContext = createContext<CourseStore>(null);

interface Props {
  course: Course;
}

const CourseProvider: FunctionComponent<PropsWithChildren<Props>> = ({
  course,
  children,
}) => {
  // Hooks
  const store = useRef(createCourseStore(course)).current;

  // View
  return (
    <CourseContext.Provider value={store}>{children}</CourseContext.Provider>
  );
};

export default CourseProvider;
