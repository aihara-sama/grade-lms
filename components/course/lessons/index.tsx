"use client";

import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import CreateLesson from "@/components/live-lesson/create-lesson";
import LessonModal from "@/components/modals/lesson-modal";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/helpers/supabase/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  courseId: string;
  userId: string;
}
const Lessons: FunctionComponent<IProps> = ({ courseId, userId }) => {
  const [lessons, seteLessons] = useState<
    Database["public"]["Tables"]["lessons"]["Row"][]
  >([]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    "5b8cc57a-e760-4327-ad98-4d1fdd2d0572"
  );

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
      <Input Icon={<SearchIcon />} placeholder="Search" />
      <Table
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
    </>
  );
};

export default Lessons;
