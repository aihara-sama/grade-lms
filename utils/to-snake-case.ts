type SnakeCase<S extends string> = S extends `${infer T} ${infer U}`
  ? `${Lowercase<T>}_${SnakeCase<U>}`
  : S extends `${infer T}-${infer U}`
    ? `${Lowercase<T>}_${SnakeCase<U>}`
    : Lowercase<S>;

export const toSnakeCase = <S extends string>(str: S): SnakeCase<S> => {
  return str.replace(/[\s-]/g, "_").toLowerCase() as SnakeCase<S>;
};
