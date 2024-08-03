export default function contains<T>(
  list: readonly T[],
  value: unknown,
): value is T {
  return list.some((element) => element === value);
}
