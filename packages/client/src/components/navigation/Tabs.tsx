import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Theme, css } from '@emotion/react';
import Icon, { IconType } from '~components/atom/Icon';
import { PolymorphicProps, UnstyledButton } from '~components/buttons/Button';
import Scroll from '~components/layout/Scroll';
import useCombinedRefs from '~hooks/useCombinedRefs';
import { assert } from '~lib/assert';
import { setAlphaToHex } from '~styles/themes';

type Variant = 'solid' | 'text';
type ColorScheme = 'netural' | 'dark' | 'light';

interface Props {
  variant?: Variant;
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

function Tabs({ variant = 'solid', colorScheme = 'netural', children }: Props) {
  return (
    <TabsProvider variant={variant} colorScheme={colorScheme}>
      <div css={styledContainer}>
        <Rail>{children}</Rail>
      </div>
    </TabsProvider>
  );
}

// Context API
interface ContextState {
  variant: Variant;
  colorScheme: ColorScheme;
  focusedTab: HTMLElement | null;
  isMouseInsideRail: React.MutableRefObject<boolean>;
}

interface ContextActions {
  setFocusedTab(focusedTab: HTMLElement | null): void;
}

type ContextType = ContextState & ContextActions;

const TabsContext = createContext<ContextType | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  assert(ctx !== null, 'useTabsContext 함수는 TabsProvider 컴포넌트 내에서만 사용할 수 있습니다.');
  return ctx;
}

interface ProviderProps {
  variant: Variant;
  colorScheme: ColorScheme;
  children: React.ReactNode;
}

function TabsProvider({ variant, colorScheme, children }: ProviderProps) {
  const [state, setState] = useState<ContextState>({
    variant,
    colorScheme,
    focusedTab: null,
    isMouseInsideRail: useRef(false),
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setFocusedTab(focusedTab) {
        setState((prev) => ({ ...prev, focusedTab }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  useEffect(() => {
    setState((prev) => ({ ...prev, colorScheme }));
  }, [colorScheme]);

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

// Subcomponents
interface RailProps {
  children: React.ReactNode;
}

const Rail = ({ children }: RailProps) => {
  const { isMouseInsideRail } = useTabsContext();

  return (
    <Scroll overflowX="scroll" hasScrollBar={false}>
      <div
        css={styledRail}
        onMouseEnter={() => (isMouseInsideRail.current = true)}
        onMouseLeave={() => (isMouseInsideRail.current = false)}
        onDragStart={(e) => e.preventDefault()}
      >
        <Thumb />
        {children}
      </div>
    </Scroll>
  );
};

const Thumb = () => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const { variant, colorScheme, focusedTab } = useTabsContext();

  useEffect(() => {
    const thumb = thumbRef.current!;

    if (focusedTab !== null) {
      thumb.style.transform = `translateX(${focusedTab.offsetLeft}px)`;
      thumb.style.width = `${focusedTab.offsetWidth}px`;
      thumb.style.opacity = '1';
    } else {
      thumb.style.opacity = '0';
    }
  }, [focusedTab]);

  return <div ref={thumbRef} css={styledThumb({ variant, colorScheme })} />;
};

type ItemProps = PolymorphicProps<{
  leftIcon?: IconType;
  rightIcon?: IconType;
  isActive?: boolean;
}>;

const Item = forwardRef(function Item<E extends React.ElementType>(
  { leftIcon, rightIcon, isActive = false, isDisabled = false, children, ...rest }: ItemProps,
  ref: ComponentRef<E>,
) {
  const itemRef = useRef<HTMLDivElement>(null);
  const hasLeftIcon = leftIcon !== undefined;
  const hasRightIcon = rightIcon !== undefined;

  const { variant, colorScheme, isMouseInsideRail, setFocusedTab } = useTabsContext();

  useEffect(() => {
    const item = itemRef.current!;

    item.onfocus = () => setFocusedTab(item);
    item.onblur = () => setFocusedTab(null);
    item.onmouseenter = () => item.focus();
    item.onmouseleave = () => item.blur();
  }, [isMouseInsideRail, setFocusedTab]);

  return (
    <UnstyledButton
      {...rest}
      ref={useCombinedRefs(itemRef, ref)}
      css={styledItem({ variant, colorScheme, hasLeftIcon, hasRightIcon, isActive, isDisabled })}
    >
      {hasLeftIcon && (
        <div css={styledItem.side}>
          <Icon icon={leftIcon} />
        </div>
      )}
      <div css={styledItem.center}>{children}</div>
      {hasRightIcon && (
        <div css={styledItem.side}>
          <Icon icon={rightIcon} />
        </div>
      )}
    </UnstyledButton>
  );
});

// Styles
const styledContainer = css`
  overflow: hidden;
`;

const styledRail = css`
  position: relative;
  display: flex;
  gap: 4px;
`;

const styledThumb =
  ({ variant, colorScheme }: { variant: Variant; colorScheme: ColorScheme }) =>
  (theme: Theme) => [
    css`
      position: absolute;
      bottom: 0;
      transition-property: transform, width, opacity;
      transition-duration: 200ms;
      transition-timing-function: linear;
    `,

    // Variant
    variant === 'solid' &&
      css`
        height: 32px;
        background-color: ${setAlphaToHex(theme[colorScheme].main, 0.1)};
        border-radius: ${theme.radii.full};
      `,
    variant === 'text' &&
      css`
        height: 2px;
        background: ${setAlphaToHex(theme[colorScheme].main, 0.1)};
      `,
  ];

const styledItem = Object.assign(
  ({
    variant,
    colorScheme,
    hasLeftIcon,
    hasRightIcon,
    isActive,
    isDisabled,
  }: {
    variant: Variant;
    colorScheme: ColorScheme;
    hasLeftIcon: boolean;
    hasRightIcon: boolean;
    isActive: boolean;
    isDisabled: boolean;
  }) =>
    (theme: Theme) => [
      css`
        z-index: 1;
        position: relative;
        display: flex;
        align-items: center;
        height: 32px;
        padding-left: ${hasLeftIcon ? '0.5em' : '1.5em'};
        padding-right: ${hasRightIcon ? '0.5em' : '1.5em'};
        font-size: 12px;
        font-weight: ${theme.weights.bold};
        transition: all ease 200ms;

        &:focus-visible {
          outline: 0;
        }
      `,

      // Variant
      variant === 'solid' && [
        css`
          color: ${theme[colorScheme].main};
          border-radius: ${theme.radii.full};
        `,

        // Status
        isActive &&
          css`
            color: ${theme.info.contrast};
            background: ${theme.info.main};
          `,
      ],
      variant === 'text' && [
        css`
          color: ${theme[colorScheme].main};
          border-bottom: 2px solid transparent;
        `,

        // Status
        isActive &&
          css`
            color: ${theme.info.main};
            border-color: currentColor;
          `,
      ],

      // Status
      isDisabled &&
        css`
          color: ${theme[colorScheme].disabled};
        `,
    ],
  {
    side: css`
      flex-grow: 0;
      flex-basis: auto;
      padding: 0 0.5em;
    `,

    center: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

export default Object.assign(Tabs, {
  Item,
});
