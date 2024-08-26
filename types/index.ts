export type PropsWithClassName<P = unknown> = P & {
  className?: string | undefined;
};

export type ResultOf<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends object
    ? Mutable<T[P]> // Recursively apply DeepMutable for nested objects
    : T[P]; // Keep the type as is for non-object types
};
