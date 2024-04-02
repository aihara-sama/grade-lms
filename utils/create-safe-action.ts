import type { z } from "zod";

export type ActionState<TOutput> = {
  error: string | null;
  data: TOutput | null;
};

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (validationResult.success === false) {
      return {
        error: validationResult.error.errors[0].message,
        data: null,
      };
    }

    return handler(validationResult.data);
  };
};
