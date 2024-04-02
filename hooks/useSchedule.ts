"use client";

import type { Database } from "@/types/supabase.type";
import { create } from "zustand";

export interface IPointerPosition {
	pointerX: number;
	pointerY: number;
}

export interface ISchedueState {
	selectedLesson?: Database["public"]["Tables"]["lessons"]["Row"];
	setSelectedLesson: (
		lesson: Database["public"]["Tables"]["lessons"]["Row"]
	) => void;
	canDropEvent: boolean;
	draggingEvent?: Database["public"]["Tables"]["lessons"]["Row"];
	setDraggingEvent: (
		lesson: Database["public"]["Tables"]["lessons"]["Row"]
	) => void;
	pointerOffsetPositionOnEvent?: IPointerPosition;
	initPointerPosition?: IPointerPosition;
	initEventPosition?: { x: number; y: number };
	setInitPointerPosition: (pointerPosition: IPointerPosition) => void;
	setInitEventPosition: (initEventPosition: { x: number; y: number }) => void;
	setPointerOffsetPositionOnEvent: (pointerPosition: IPointerPosition) => void;
	setCanDropEvent: (canDrop: boolean) => void;
}

export const useSchedule = create<ISchedueState>((set) => ({
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
