// Members
import { parseUsersCoursesIds } from "@/utils/parse-users-courses-ids";
import { db } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const courseId = req.nextUrl.searchParams.get("course-id");

  const users = await db
    .rpc("get_users_not_in_course", {
      p_course_id: courseId,
      p_user_name: "",
    })
    .eq("creator_id", user.id)
    .neq("id", user.id);

  const result = await db.from("user_courses").upsert(
    parseUsersCoursesIds(
      users.data.map(({ id }) => id),
      [courseId]
    )
  );

  return Response.json({ errors: result.error });
}
