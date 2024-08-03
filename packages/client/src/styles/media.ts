export const breakpoints = {
  xs: 0, // xs: 0px and up
  sm: 576, // sm: 576px and up (phone)
  md: 720, // md: 720px and up (tablet)
  lg: 992, // lg: 992px and up (laptop)
  xl: 1200, // xl: 1200px and up (desktop)
} as const;

export type Breakpoint = keyof typeof breakpoints;
type MediaQueries = Record<Breakpoint, string>;

export const generateMediaQuery = (minWidth: string) => `@media (min-width: ${minWidth})`;

const media = Object.entries(breakpoints).reduce(
  (acc, [key, value]) => ({ ...acc, [key]: generateMediaQuery(`${value + 48}px`) }),
  {} as MediaQueries,
);

export default media;
