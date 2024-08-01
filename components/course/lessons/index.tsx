"use client";

import BetterTable from "@/components/better-table";
import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import CreateLesson from "@/components/lesson/create-lesson";
import AssignmentsModal from "@/components/modals/assignments-modal";
import LessonModal from "@/components/modals/lesson-modal";
import Total from "@/components/total";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  courseId: string;
  userId: string;
}
const Lessons: FunctionComponent<IProps> = ({ courseId, userId }) => {
  const [lessons, seteLessons] = useState<
    Database["public"]["Tables"]["lessons"]["Row"][]
  >([]);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  console.log({ lessons, selectedLessonId });

  const getLessons = async () => {
    const data = await supabaseClient
      .from("users")
      .select("id, courses(id, lessons(*))")
      .eq("id", userId)
      .eq("courses.id", courseId)
      .single();

    seteLessons(data.data.courses[0].lessons);
  };

  const deleteLesson = async (
    lessonId: string
  ): Promise<{ error: string | null; data: null }> => {
    const { error } = await supabaseClient
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    return {
      data: null,
      error: error ? error.message : null,
    };
  };

  useEffect(() => {
    getLessons();
  }, []);

  return (
    <>
      <p className="section-title">Lessons</p>
      <CardsContainer>
        <Total
          title="Total lessons"
          total={lessons.length}
          Icon={<LessonsIcon size="lg" />}
        />
        <CreateLesson onDone={getLessons} courseId={courseId} />
      </CardsContainer>
      <Input bottomSpacing Icon={<SearchIcon />} placeholder="Search" />
      <BetterTable
        data={lessons.map(({ id, title, starts }) => ({
          Name: (
            <IconTitle
              Icon={<LessonsIcon size="sm" />}
              key={id}
              title={title}
              subtitle=""
              href={`/dashboard/courses/${courseId}/lessons/${id}/overview`}
            />
          ),
          Starts: format(new Date(starts), "EEEE, MMM d"),
          Action: (
            <div className="group-buttons" key={id}>
              <DeleteButton
                onDone={getLessons}
                action={deleteLesson}
                record="lesson"
                id={id}
              />
              <button
                className="outline-button"
                onClick={() => {
                  setIsLessonModalOpen(true);
                  setSelectedLessonId(id);
                }}
              >
                Edit
              </button>
            </div>
          ),
        }))}
      />
      {isLessonModalOpen && (
        <LessonModal
          lesson={lessons.find(({ id }) => id === selectedLessonId)}
          close={() => setIsLessonModalOpen(false)}
          onDone={() => getLessons()}
          courses={[]}
        />
      )}
      {isAssignmentsModalOpen && (
        <AssignmentsModal
          lessonId={selectedLessonId}
          close={() => setIsAssignmentsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Lessons;
