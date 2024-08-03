import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useBreakpoint from '~hooks/useBreakpoints';
import { assert } from '~lib/assert';
import contains from '~lib/contains';
import BaseStructureFooter from './BaseStructureFooter';
import BaseStructureHeader, { ColorScheme as HeaderColorScheme } from './BaseStructureHeader';
import BaseStructureMain from './BaseStructureMain';

interface Props {
  children: React.ReactNode;
}

function BaseStructure({ children }: Props) {
  return <BaseStructureProvider>{children}</BaseStructureProvider>;
}

// Context API
type Platform = 'DESKTOP' | 'MOBILE';

interface ContextState {
  platform: Platform;
  headerColorScheme: HeaderColorScheme;
}

interface ContextActions {
  setHeaderColorScheme(colorScheme: HeaderColorScheme): void;
}

type ContextType = ContextState & ContextActions;

const BaseStructureContext = createContext<ContextType | null>(null);

export function useBaseStructureContext() {
  const ctx = useContext(BaseStructureContext);

  assert(ctx !== null, 'useBaseStructureContext 함수는 BaseStructureProvider 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface ProviderProps {
  children: React.ReactNode;
}

function BaseStructureProvider({ children }: ProviderProps) {
  const breakpoint = useBreakpoint();
  const platform = contains(['lg', 'xl'], breakpoint) ? 'DESKTOP' : 'MOBILE';

  const [state, setState] = useState<ContextState>({
    platform,
    headerColorScheme: 'netural',
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setHeaderColorScheme(colorScheme) {
        setState((prev) => ({ ...prev, headerColorScheme: colorScheme }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  useEffect(() => {
    setState((prev) => ({ ...prev, platform }));
  }, [platform]);

  return <BaseStructureContext.Provider value={value}>{children}</BaseStructureContext.Provider>;
}

export default Object.assign(BaseStructure, {
  Header: BaseStructureHeader,
  Main: BaseStructureMain,
  Footer: BaseStructureFooter,
});
