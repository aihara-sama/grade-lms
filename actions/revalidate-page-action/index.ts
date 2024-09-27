"use server";

import { revalidatePath } from "next/cache";

export const revalidatePageAction = () => revalidatePath("/");
