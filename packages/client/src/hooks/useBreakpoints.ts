import { Breakpoint, breakpoints } from '~styles/media';
import useWindowSize from './useWindowSize';

export default function useBreakpoint() {
  const { width } = useWindowSize();

  let breakpoint: Breakpoint;

  if (width > breakpoints.xl) {
    breakpoint = 'xl';
  } else if (width > breakpoints.lg) {
    breakpoint = 'lg';
  } else if (width > breakpoints.md) {
    breakpoint = 'md';
  } else if (width > breakpoints.sm) {
    breakpoint = 'sm';
  } else {
    breakpoint = 'xs';
  }

  return breakpoint;
}
