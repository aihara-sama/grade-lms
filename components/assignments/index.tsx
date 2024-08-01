"use client";

import CreateAssignment from "@/components/assignments/create-assignment";
import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import BetterTable from "../better-table";
import AssignmentsIcon from "../icons/assignments-icon";
import AddAssignmentModal from "../modals/add-assignment-modal";
import Total from "../total";

interface IProps {
  lessonId: string;
  courseId: string;
}
const Assignments: FunctionComponent<IProps> = ({ lessonId }) => {
  const [assignments, setAssignments] = useState<
    Database["public"]["Tables"]["assignments"]["Row"][]
  >([]);
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
        <CreateAssignment lessonId={lessonId} onDone={getAssignments} />
      </CardsContainer>
      <Input bottomSpacing Icon={<SearchIcon />} placeholder="Search" />
      <BetterTable
        data={assignments.map(({ id, title }) => ({
          Name: (
            <IconTitle
              Icon={<AssignmentsIcon size="sm" />}
              key={id}
              title={title}
              subtitle=""
              onClick={() => setCurrentAssignmentId(id)}
            />
          ),
        }))}
      />
      {currentAssignmentId && (
        <AddAssignmentModal
          lessonId={lessonId}
          assignmentId={currentAssignmentId}
          onDone={() => {
            getAssignments();
            setCurrentAssignmentId(undefined);
          }}
          closeModal={() => setCurrentAssignmentId(undefined)}
        />
      )}
    </>
  );
};

export default Assignments;
