"use client";

import CreateAssignment from "@/components/assignments/create-assignment";
import CardsContainer from "@/components/cards-container";
import IconTitle from "@/components/icon-title";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/helpers/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";

import AssignmentModal from "@/components/modals/assignment-modal";
import type { Assignment } from "@/types/assignments.type";

interface IProps {
  lessonId: string;
}
const Assignments: FunctionComponent<IProps> = ({ lessonId }) => {
  // States
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
        <CreateAssignment lessonId={lessonId} onDone={getAssignments} />
      </CardsContainer>
      <Input Icon={<SearchIcon />} placeholder="Search" />
      <Table
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
        <AssignmentModal
          assignmentId={currentAssignmentId}
          onDone={() => {
            getAssignments();
            setCurrentAssignmentId(undefined);
          }}
          close={() => setCurrentAssignmentId(undefined)}
        />
      )}
    </>
  );
};

export default Assignments;
