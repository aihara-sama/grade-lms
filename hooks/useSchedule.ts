"use client";

import type { Lesson } from "@/types/lesson.type";
import { create } from "zustand";

export interface PointerPosition {
  pointerX: number;
  pointerY: number;
}

export interface SchedueState {
  selectedLesson?: Lesson;
  setSelectedLesson: (lesson: Lesson) => void;
  canDropEvent: boolean;
  draggingEvent?: Lesson;
  setDraggingEvent: (lesson: Lesson) => void;
  pointerOffsetPositionOnEvent?: PointerPosition;
  initPointerPosition?: PointerPosition;
  initEventPosition?: { x: number; y: number };
  setInitPointerPosition: (pointerPosition: PointerPosition) => void;
  setInitEventPosition: (initEventPosition: { x: number; y: number }) => void;
  setPointerOffsetPositionOnEvent: (pointerPosition: PointerPosition) => void;
  setCanDropEvent: (canDrop: boolean) => void;
}

export const useSchedule = create<SchedueState>((set) => ({
  canDropEvent: true,
  draggingEvent: undefined,
  selectedLesson: undefined,
  initEventPosition: undefined,
  initPointerPosition: undefined,
  pointerOffsetPositionOnEvent: undefined,
  setCanDropEvent: (canDrop) => set({ canDropEvent: canDrop }),
  setDraggingEvent: (draggingEvent) => set({ draggingEvent }),
  setSelectedLesson: (selectedLesson) => set({ selectedLesson }),
  setInitPointerPosition: (initPointerPosition) => set({ initPointerPosition }),
  setPointerOffsetPositionOnEvent: (pointerOffsetPositionOnEvent) =>
    set({ pointerOffsetPositionOnEvent }),
  setInitEventPosition: (initEventPosition) => set({ initEventPosition }),
}));
