import { useEffect, useMemo, useRef } from 'react';
import { css, Theme } from '@emotion/react';
import { Variants, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import Icon, { IconType } from '~components/atom/Icon';
import { UnstyledButton, styledButtonBase } from '~components/buttons/Button';
import usePreservedCallback from '~hooks/usePreservedCallback';
import useSnackbarGroupStore from '~store/useSnackbarGroupStore';
import ellipsis from '~styles/ellipsis';

const SNACKBAR_LIFETIME = 4000;

interface Props {
  id: string;
  index: number;
  offset: number;
  icon?: IconType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick(): void;
  };
  duration?: number;
  isPaused: boolean;
  isVisible: boolean;
  onMounted(item: HTMLLIElement): void;
  onUnmounted(id: string): void;
}

function Snackbar({
  id,
  index,
  offset,
  icon,
  title,
  description,
  action,
  duration: _duration,
  isPaused,
  isVisible,
  onMounted: _onMounted,
  onUnmounted: _onUnmounted,
}: Props) {
  const containerRef = useRef<HTMLLIElement>(null);
  const duration = useMemo(() => _duration || SNACKBAR_LIFETIME, [_duration]);

  const { remove } = useSnackbarGroupStore(useShallow(({ remove }) => ({ remove })));

  const onMounted = usePreservedCallback(_onMounted);
  const onUnmounted = usePreservedCallback(_onUnmounted);

  useEffect(() => {
    const container = containerRef.current!;

    onMounted(container);

    return () => {
      onUnmounted(container.id);
    };
  }, [onMounted, onUnmounted]);

  useEffect(() => {
    if (duration === Infinity || isPaused) return;

    const timer = setTimeout(() => remove(id), duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, isPaused, remove]);

  const variants: Variants = {
    initial: {
      y: 0,
      opacity: 0,
    },
    enter: {
      y: offset,
      opacity: 1,
    },
    exit: {
      y: `calc(${offset}px - 100%)`,
      opacity: 0,
    },
    hidden: {
      y: offset,
      opacity: 0,
    },
  };

  return (
    <motion.li
      ref={containerRef}
      id={id}
      css={styledContainer({
        index,
        isDisabled: !isVisible,
      })}
      variants={variants}
      initial="initial"
      animate={isVisible ? 'enter' : 'hidden'}
      exit="exit"
      transition={{
        ease: 'easeIn',
        duration: 0.4,
      }}
    >
      <div css={styledContent}>
        {icon !== undefined && (
          <div css={styledContent.side}>
            <Icon icon={icon} size="20px" />
          </div>
        )}
        <div css={styledContent.center}>
          <h2 css={styledTitle}>{title}</h2>
          {description !== undefined && <p css={styledDescription}>{description}</p>}
        </div>
        {action !== undefined && (
          <div css={styledContent.side}>
            <UnstyledButton as="button" css={styledCloseButton} onClick={action.onClick}>
              {action.label}
            </UnstyledButton>
          </div>
        )}
      </div>
    </motion.li>
  );
}

// Styles
const styledContainer =
  ({ index, isDisabled }: { index: number; isDisabled: boolean }) =>
  (theme: Theme) => [
    css`
      z-index: ${index};
      position: absolute;
      top: 0;
      width: 100%;
      padding: 16px;
      color: ${theme.text.main};
      background-color: ${theme.background.elevated};
      border: 1px solid ${theme.border};
      border-radius: ${theme.radii.sm};
      box-shadow: ${theme.shadows.xl};
    `,

    // Status
    isDisabled &&
      css`
        cursor: none;
        pointer-events: none;
      `,
  ];

const styledContent = Object.assign(
  css`
    display: flex;
    align-items: center;
    gap: 0 16px;
    overflow: hidden;
    height: 100%;
  `,
  {
    side: css`
      flex-grow: 0;
      flex-basis: auto;
    `,

    center: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledTitle = (theme: Theme) => [
  ellipsis,

  css`
    font-size: 12px;
    font-weight: ${theme.weights.bold};
    line-height: 1.4;

    &:not(&:last-child) {
      margin-bottom: 0.25lh;
    }
  `,
];

const styledDescription = (theme: Theme) => [
  ellipsis.multiline(),

  css`
    color: ${theme.text.sub};
    font-size: 12px;
    line-height: 1.4;
  `,
];

const styledCloseButton = (theme: Theme) => [
  styledButtonBase(),

  css`
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: ${theme.radii.xs};
    font-size: 12px;
  `,
];

export default Snackbar;
