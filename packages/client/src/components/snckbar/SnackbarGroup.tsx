import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { css, Theme } from '@emotion/react';
import * as PortalPrimitives from '@radix-ui/react-portal';
import { AnimatePresence } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { assert } from '~lib/assert';
import contains from '~lib/contains';
import useSnackbarGroupStore from '~store/useSnackbarGroupStore';
import media from '~styles/media';
import Snackbar from './Snackbar';

const VISIBLE_SNACKBARS_AMOUNT = 3;
const VIEWPORT_OFFSET = '24px';
const GAP = 12;

function SnackbarGroup() {
  return (
    <SnackbarGroupProvider>
      <Root />
    </SnackbarGroupProvider>
  );
}

// Context API
interface ContextState {
  // isExpanded: boolean;
}

interface ContextActions {
  // expand(): void;
  // collapse(): void;
}

type ContextType = ContextState & ContextActions;

const SnackbarGroupContext = createContext<ContextType | null>(null);

export function useSnackbarGroupContext() {
  const ctx = useContext(SnackbarGroupContext);

  assert(ctx !== null, 'useSnackbarGroupContext 함수는 SnackbarGroupProvider 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface ProviderProps {
  children: React.ReactNode;
}

function SnackbarGroupProvider({ children }: ProviderProps) {
  const [state] = useState<ContextState>({
    // isExpanded: false,
  });

  const actions = useMemo<ContextActions>(
    () => ({
      // expand() {
      //   setState((prev) => ({ ...prev, isExpanded: true }));
      // },
      // collapse() {
      //   setState((prev) => ({ ...prev, isExpanded: false }));
      // },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  return <SnackbarGroupContext.Provider value={value}>{children}</SnackbarGroupContext.Provider>;
}

// Subcomponents
const Root = () => {
  const [items, setItems] = useState<HTMLLIElement[]>([]);
  const [isPaused, setPaused] = useState(false);

  const group = useSnackbarGroupStore(useShallow(({ group }) => group));

  const getSnackbarOffset = useCallback(
    (searchId: string) => {
      const filteredByGroupIds = items.filter((current) => contains([...group.keys()], current.id));

      const cursor = filteredByGroupIds.findIndex((current) => current.id === searchId);
      const offset = filteredByGroupIds.reduce((acc, current, i) => {
        const height = current.offsetHeight;
        const amount = height + GAP;

        return i < cursor ? acc + amount : acc;
      }, 0);

      return offset;
    },
    [group, items],
  );

  const handleMounseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  const handleSnackbarMounted = useCallback((item: HTMLLIElement) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const handleSnackbarUnmounted = useCallback((searchId: string) => {
    setItems((prev) => prev.filter((current) => current.id !== searchId));
  }, []);

  if (group.size === 0 && items.length === 0) return null;

  return (
    <PortalPrimitives.Root>
      <ol css={styledContainer} onMouseEnter={handleMounseEnter} onMouseLeave={handleMouseLeave}>
        <AnimatePresence>
          {[...group.entries()].map(([id, { icon, title, description, action, duration }], i) => (
            <Snackbar
              key={id}
              id={id}
              index={i}
              offset={getSnackbarOffset(id)}
              icon={icon}
              title={title}
              description={description}
              action={action}
              duration={duration}
              isPaused={isPaused}
              isVisible={i < VISIBLE_SNACKBARS_AMOUNT}
              onMounted={handleSnackbarMounted}
              onUnmounted={handleSnackbarUnmounted}
            />
          ))}
        </AnimatePresence>
      </ol>
    </PortalPrimitives.Root>
  );
};

// Styles
const styledContainer = (theme: Theme) => css`
  z-index: ${theme.elevation.snackbar};
  position: fixed;
  width: min(360px, calc(100% - (${VIEWPORT_OFFSET} * 2)));

  ${media.xs} {
    inset: ${VIEWPORT_OFFSET} auto auto 50%;
    transform: translateX(-50%);
  }

  ${media.sm} {
    inset: ${VIEWPORT_OFFSET} ${VIEWPORT_OFFSET} auto auto;
    transform: unset;
  }
`;

export default SnackbarGroup;
