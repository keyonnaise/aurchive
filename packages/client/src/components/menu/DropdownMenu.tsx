import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Theme, css } from '@emotion/react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { match } from 'ts-pattern';
import Icon, { IconType } from '~components/atom/Icon';
import Button, { PolymorphicProps } from '~components/buttons/Button';
import { slideIn } from '~styles/keyframes';

interface Props {
  children: React.ReactNode;
}

function DropdownMenu({ children }: Props) {
  return (
    <DropdownMenuProvider>
      <Root>{children}</Root>
    </DropdownMenuProvider>
  );
}

// Context API
interface Boundary {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Options {
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  sideOffset: number;
  alignOffset: number;
}

interface ContextState {
  options: Options;
  boundary: Boundary | null;
  open: boolean;
  isMouseMoveBlocked: React.MutableRefObject<boolean>;
}

interface ContextActions {
  setOptions(options: Options): void;
  setBoundary(boundary: Boundary | null): void;
  onOpenChange(open: boolean): void;
}

type ContextType = ContextState & ContextActions;

const DropdownMenuContext = createContext<ContextType | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);

  if (context === null) {
    throw new Error('useDropdownMenuContext must be used whithin a DropdownMenuProvider.');
  }

  return context;
}

function DropdownMenuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContextState>({
    options: {
      side: 'bottom',
      align: 'start',
      sideOffset: 0,
      alignOffset: 0,
    },
    boundary: null,
    open: false,
    isMouseMoveBlocked: useRef(true),
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setOptions(options) {
        setState((prev) => ({ ...prev, options }));
      },

      setBoundary(boundary) {
        setState((prev) => ({ ...prev, boundary }));
      },

      onOpenChange(open) {
        setState((prev) => ({ ...prev, open }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  return <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>;
}

// Subcomponents
const Root = (props: { dir?: DropdownMenuPrimitives.Direction; modal?: boolean; children?: React.ReactNode }) => {
  const { options, boundary, open, isMouseMoveBlocked, onOpenChange } = useDropdownMenuContext();

  useEffect(() => {
    if (boundary === null) return;

    const onMouseMove = (e: MouseEvent) => {
      if (
        isMouseMoveBlocked.current &&
        (e.offsetY < boundary.top - options.sideOffset ||
          e.offsetX > boundary.right + options.sideOffset ||
          e.offsetY > boundary.bottom + options.sideOffset ||
          e.offsetX < boundary.left - options.sideOffset)
      ) {
        onOpenChange(false);
        window.removeEventListener('mousemove', onMouseMove);

        // console.log('open -> false');
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [options, boundary, isMouseMoveBlocked, onOpenChange]);

  return <DropdownMenuPrimitives.Root {...props} open={open} onOpenChange={onOpenChange} />;
};

const Trigger = forwardRef(function Trigger(
  {
    children,
    asChild = true,
    ...rest
  }: {
    children: ((open: boolean) => React.ReactNode) | React.ReactNode;
  } & Omit<ComponentProps<typeof DropdownMenuPrimitives.Trigger>, 'children'>,
  ref: ComponentRef<typeof DropdownMenuPrimitives.Trigger>,
) {
  const { open } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitives.Trigger
      {...rest}
      ref={ref}
      style={{ pointerEvents: 'auto' }}
      css={styledTrigger}
      asChild={asChild}
    >
      {typeof children === 'function' ? children(open) : children}
    </DropdownMenuPrimitives.Trigger>
  );
});

const Content = forwardRef(function Content(
  {
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset = 0,
    children,
    onFocus,
    ...rest
  }: ComponentProps<typeof DropdownMenuPrimitives.Content>,
  ref: ComponentRef<typeof DropdownMenuPrimitives.Content>,
) {
  const { setOptions } = useDropdownMenuContext();

  useEffect(() => {
    setOptions({ side, align, sideOffset, alignOffset });
  }, [side, align, sideOffset, alignOffset, setOptions]);

  return (
    <DropdownMenuPrimitives.Portal>
      <DropdownMenuPrimitives.Content
        {...rest}
        ref={ref}
        css={styledContent}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        // forceMount
      >
        {children}
      </DropdownMenuPrimitives.Content>
    </DropdownMenuPrimitives.Portal>
  );
});

const Sub = (props: ComponentProps<typeof DropdownMenuPrimitives.Sub>) => {
  return <DropdownMenuPrimitives.Sub {...props} />;
};

const SubTrigger = forwardRef(function SubTrigger(
  { children, ...rest }: Omit<ComponentProps<typeof DropdownMenuPrimitives.SubTrigger>, 'asChild'>,
  ref: ComponentRef<typeof DropdownMenuPrimitives.SubTrigger>,
) {
  return (
    <DropdownMenuPrimitives.SubTrigger {...rest} ref={ref} asChild>
      <StyledButton
        as="button"
        slotAfter={{
          type: 'icon',
          value: 'arrows/arrow-right-s-line',
        }}
      >
        {children}
      </StyledButton>
    </DropdownMenuPrimitives.SubTrigger>
  );
});

const SubContent = forwardRef(function SubContent(
  { children, ...rest }: ComponentProps<typeof DropdownMenuPrimitives.SubContent>,
  ref: ComponentRef<typeof DropdownMenuPrimitives.SubContent>,
) {
  return (
    <DropdownMenuPrimitives.SubContent {...rest} ref={ref} css={styledContent}>
      {children}
    </DropdownMenuPrimitives.SubContent>
  );
});

const Item = forwardRef(function Item(
  {
    textValue,
    onSelect,
    ...rest
  }: {
    textValue?: string;
    onSelect?(e: Event): void;
  } & ComponentProps<typeof StyledButton>,
  ref: ComponentRef<typeof DropdownMenuPrimitives.Item>,
) {
  return (
    <DropdownMenuPrimitives.Item ref={ref} textValue={textValue} onSelect={onSelect} asChild>
      <StyledButton {...rest} />
    </DropdownMenuPrimitives.Item>
  );
});

interface IconSlot {
  type: 'icon';
  value: IconType;
}

interface ShortcutSlot {
  type: 'shortcut';
  value: string;
}

type Slot = IconSlot | ShortcutSlot;

const StyledButton = forwardRef(function StyledButton<T extends React.ElementType>(
  {
    slotBefore,
    slotAfter,
    isDisabled = false,
    children,
    ...rest
  }: { slotBefore?: Slot; slotAfter?: Slot } & PolymorphicProps,
  ref: ComponentRef<T>,
) {
  const Slot = useCallback(({ slot }: { slot: Slot }) => {
    return match(slot)
      .with({ type: 'icon' }, ({ type, value }) => (
        <div className="slot" data-type={type}>
          <Icon icon={value} />
        </div>
      ))
      .with({ type: 'shortcut' }, ({ type, value }) => (
        <div className="slot" data-type={type}>
          {value}
        </div>
      ))
      .exhaustive();
  }, []);

  const hasSlotBefore = slotBefore !== undefined;
  const hasSlotAfter = slotAfter !== undefined;

  return (
    <Button
      {...rest}
      ref={ref}
      variant="none"
      css={styledItem({ hasSlotBefore, hasSlotAfter, isDisabled })}
      isDisabled={isDisabled}
    >
      {hasSlotBefore && <Slot slot={slotBefore} />}
      <div className="center">{children}</div>
      {hasSlotAfter && <Slot slot={slotAfter} />}
    </Button>
  );
});

// Styles
const styledTrigger = css`
  all: unset;
  display: block;
  overflow: hidden;
  box-sizing: inherit;
  color: inherit;
  font: inherit;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: auto;
    outline-offset: 2px;
  }
`;

const styledContent = (theme: Theme) => css`
  width: 128px;
  min-width: 128px;
  padding: 4px;
  color: ${theme.text.main};
  background-color: ${theme.background.elevated};
  border: 1px solid ${theme.border};
  border-radius: ${theme.radii.sm};
  box-shadow: ${theme.shadows.xs};

  animation-duration: 200ms;
  animation-timing-function: ease;
  animation-fill-mode: both;

  &[data-side='top'] {
    animation-name: ${slideIn('bottom')};
  }
  &[data-side='right'] {
    animation-name: ${slideIn('left')};
  }
  &[data-side='bottom'] {
    animation-name: ${slideIn('top')};
  }
  &[data-side='left'] {
    animation-name: ${slideIn('right')};
  }
`;

const styledItem =
  ({
    hasSlotBefore,
    hasSlotAfter,
    isDisabled,
  }: {
    hasSlotBefore: boolean;
    hasSlotAfter: boolean;
    isDisabled: boolean;
  }) =>
  (theme: Theme) => [
    css`
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 32px;
      padding-left: ${hasSlotBefore ? '0' : '8px'};
      padding-right: ${hasSlotAfter ? '0' : '8px'};
      color: ${theme.netural.main};
      border-radius: ${theme.radii.xs};
      outline: none !important;
      font-size: 12px;
      font-weight: 600;
      text-align: left;

      > .slot {
        flex-grow: 0;
        flex-basis: auto;
        padding: 0 8px;
      }
      > .slot[data-type='icon'] {
        font-size: 16px;
      }
      > .slot[data-type='shortcut'] {
        opacity: 0.6;
      }

      > .center {
        // Ellipsis
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
      }

      &:hover,
      &[data-state='open'],
      &[data-highlighted] {
        background: ${theme.netural.alpha(0.1)};
      }

      &[data-disabled] {
        color: ${theme.netural.disabled};
        background-color: ${theme.netural.disabled};
      }
    `,

    // Status
    isDisabled &&
      css`
        color: ${theme.netural.disabled};
      `,
  ];

export default Object.assign(DropdownMenu, {
  Trigger,
  Content,
  Sub,
  SubTrigger,
  SubContent,
  Item,
});
