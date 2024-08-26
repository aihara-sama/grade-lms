export type PropsWithClassName<P = unknown> = P & {
  className?: string | undefined;
};

export type ResultOf<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;
