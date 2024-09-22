export const extractAssignmentsCount = (
  courses: Record<"lessons", { assignments: { count: number }[] }[]>[]
) =>
  courses.reduce(
    (acc, val) =>
      acc +
      val.lessons.reduce((acc2, val2) => acc2 + val2.assignments[0].count, 0),
    0
  );
