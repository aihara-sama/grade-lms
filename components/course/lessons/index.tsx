"use client";

import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import CreateLesson from "@/components/live-lesson/create-lesson";
import LessonModal from "@/components/modals/lesson-modal";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import CardTitle from "@/components/card-title";
import DeleteIcon from "@/components/icons/delete-icon";
import Modal from "@/components/modal";
import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  courseId: string;
  userId: string;
}
const Lessons: FunctionComponent<IProps> = ({ courseId, userId }) => {
  const [isDeleteBulkLessonsModalOpen, setIsDeleteBulkLessonsModalOpen] =
    useState(false);
  const [lessonsIds, setLessonsIds] = useState<string[]>([]);
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
  const handleBulkDeleteLessons = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .delete()
      .in("id", lessonsIds);

    if (error) toast.error("Something went wrong");

    setLessonsIds([]);
    setIsDeleteBulkLessonsModalOpen(false);

    getLessons();
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
      {!lessonsIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteBulkLessonsModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      )}
      <Table
        data={lessons.map(({ id, title, starts }) => ({
          Name: (
            <CardTitle
              href={`/dashboard/courses/${courseId}/lessons/${id}/overview`}
              checked={lessonsIds.includes(id)}
              Icon={<LessonsIcon size="md" />}
              title={title}
              subtitle=""
              onClick={() => {}}
              onToggle={(checked) =>
                checked
                  ? setLessonsIds((prev) => [...prev, id])
                  : setLessonsIds((prev) => prev.filter((_id) => _id !== id))
              }
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
      {isDeleteBulkLessonsModalOpen && (
        <Modal
          close={() => setIsDeleteBulkLessonsModalOpen(false)}
          title="Delete Lessons"
          content={
            <>
              <p className="mb-4">
                Are you sure you want to delete selected lessons?
              </p>
              <div className="group-buttons">
                <button
                  className="outline-button w-full"
                  onClick={() => setIsDeleteBulkLessonsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleBulkDeleteLessons}
                >
                  Delete
                </button>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Lessons;
