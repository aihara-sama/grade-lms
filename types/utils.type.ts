export type ResultOf<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;
