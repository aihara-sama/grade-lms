"use client";

import CreateAssignment from "@/components/assignments/create-assignment";
import CardsContainer from "@/components/cards-container";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";

import CardTitle from "@/components/card-title";
import DeleteIcon from "@/components/icons/delete-icon";
import Modal from "@/components/modal";
import AssignmentModal from "@/components/modals/assignment-modal";
import type { Assignment } from "@/types/assignments.type";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface IProps {
  lessonId: string;
  course: Course;
  lesson: Lesson;
  user: User;
}
const Assignments: FunctionComponent<IProps> = ({
  lessonId,
  user,
  course,
  lesson,
}) => {
  // States
  const [
    isDeleteBulkAssignmentsModalOpen,
    setIsDeleteBulkAssignmentsModalOpen,
  ] = useState(false);
  const [assignmentsIds, setAssignmentsIds] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<
    string | undefined
  >();

  const getAssignments = async () => {
    const data = await supabaseClient
      .from("assignments")
      .select("*")
      .eq("lesson_id", lessonId);

    setAssignments(data.data);
  };
  const handleBulkDeleteAssignments = async () => {
    const { error } = await supabaseClient
      .from("assignments")
      .delete()
      .in("id", assignmentsIds);

    if (error) toast.error("Something went wrong");

    setAssignmentsIds([]);
    setIsDeleteBulkAssignmentsModalOpen(false);

    getAssignments();
  };

  // Effects
  useEffect(() => {
    getAssignments();
  }, []);

  return (
    <>
      <p className="section-title">Assignments</p>
      <CardsContainer>
        <Total
          Icon={<AssignmentsIcon size="md" />}
          total={assignments.length}
          title="Total assignments"
        />
        <CreateAssignment
          course={course}
          lesson={lesson}
          user={user}
          onDone={getAssignments}
        />
      </CardsContainer>{" "}
      {!assignmentsIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteBulkAssignmentsModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      )}
      <Table
        data={assignments.map(({ id, title }) => ({
          Name: (
            <CardTitle
              onClick={() => setCurrentAssignmentId(id)}
              checked={assignmentsIds.includes(id)}
              Icon={<AssignmentsIcon size="md" />}
              title={title}
              subtitle=""
              onToggle={(checked) =>
                checked
                  ? setAssignmentsIds((prev) => [...prev, id])
                  : setAssignmentsIds((prev) =>
                      prev.filter((_id) => _id !== id)
                    )
              }
            />
          ),
        }))}
      />
      {currentAssignmentId && (
        <AssignmentModal
          assignmentId={currentAssignmentId}
          onDone={() => {
            getAssignments();
            setCurrentAssignmentId(undefined);
          }}
          close={() => setCurrentAssignmentId(undefined)}
        />
      )}
      {isDeleteBulkAssignmentsModalOpen && (
        <Modal
          close={() => setIsDeleteBulkAssignmentsModalOpen(false)}
          title="Delete Assignments"
          content={
            <>
              <p className="mb-4">
                Are you sure you want to delete selected assignments?
              </p>
              <div className="group-buttons">
                <button
                  className="outline-button w-full"
                  onClick={() => setIsDeleteBulkAssignmentsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleBulkDeleteAssignments}
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

export default Assignments;
