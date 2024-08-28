export default function isNil<T>(value: T | undefined | null): value is null | undefined {
  return value == null;
}
