import { useEffect, useRef } from 'react';
import { css, Theme } from '@emotion/react';

interface Props {
  overflowX?: Overflow;
  overflowY?: Overflow;
  padding?: string;
  hasScrollBar?: boolean;
  onScrolling?(isScrolling: boolean): void;
  children: React.ReactNode;
}

type Overflow = 'auto' | 'hidden' | 'scroll';

function Scroll({
  overflowX = 'hidden',
  overflowY = 'hidden',
  padding,
  hasScrollBar = true,
  onScrolling,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preserveOnScrolling = useRef(onScrolling).current;

  useEffect(() => {
    if (containerRef.current === null) return;

    const container = containerRef.current;

    const dragSpeed = {
      x: 0,
      y: 0,
    };
    const position = {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
    };
    let isDown = false;
    let momentum = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) return;

      isDown = true;
      position.left = container.scrollLeft;
      position.top = container.scrollTop;
      position.x = e.clientX;
      position.y = e.clientY;

      cancelMomentumTracking();
    };

    const onMouseUp = () => {
      isDown = false;

      beginMomentumTracking();
      preserveOnScrolling?.(false);
    };

    const onMouseLeave = () => {
      isDown = false;

      preserveOnScrolling?.(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;

      const prevScroll = {
        x: container.scrollLeft,
        y: container.scrollTop,
      };
      const walk = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      container.scrollLeft = position.left - walk.x;
      container.scrollTop = position.top - walk.y;
      dragSpeed.x = container.scrollLeft - prevScroll.x;
      dragSpeed.y = container.scrollTop - prevScroll.y;

      preserveOnScrolling?.(true);
    };

    const momentumLoop = () => {
      container.scrollLeft += dragSpeed.x;
      container.scrollTop += dragSpeed.y;
      dragSpeed.x *= 0.95;
      dragSpeed.y *= 0.95;

      if (Math.abs(dragSpeed.x) > 0.5 || Math.abs(dragSpeed.y) > 0.5) {
        momentum = requestAnimationFrame(momentumLoop);
      }
    };

    const beginMomentumTracking = () => {
      cancelMomentumTracking();

      momentum = requestAnimationFrame(momentumLoop);
    };

    const cancelMomentumTracking = () => {
      cancelAnimationFrame(momentum);
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mousemove', onMouseMove);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseUp', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [preserveOnScrolling]);

  return (
    <div
      ref={containerRef}
      css={styledContainer({
        overflowX,
        overflowY,
        padding,
        hasScrollBar,
      })}
    >
      {children}
    </div>
  );
}

// Styles
const styledContainer =
  ({
    overflowX,
    overflowY,
    padding,
    hasScrollBar,
  }: {
    overflowX: Overflow | undefined;
    overflowY: Overflow | undefined;
    padding: string | undefined;
    hasScrollBar: boolean;
  }) =>
  (theme: Theme) => [
    css`
      overflow-x: ${overflowX};
      overflow-y: ${overflowY};
      width: 100%;
      height: 100%;
      padding: ${padding};
      user-select: none;

      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    `,

    // Others
    hasScrollBar && [
      css`
        padding: 0;

        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        &::-webkit-scrollbar-track,
        &::-webkit-scrollbar-thumb {
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-track {
          background-color: ${theme.netural.alpha(0.1)};
        }
        &::-webkit-scrollbar-thumb {
          background-color: ${theme.netural.alpha(0.4)};
        }
      `,

      overflowX !== 'hidden' &&
        css`
          padding-top: ${padding};
          padding-bottom: calc(${padding} - 4px);

          &::-webkit-scrollbar-track,
          &::-webkit-scrollbar-thumb {
            border-top: 4px solid transparent;
          }
        `,
      overflowY !== 'hidden' &&
        css`
          padding-left: ${padding};
          padding-right: calc(${padding} - 4px);

          &::-webkit-scrollbar-track,
          &::-webkit-scrollbar-thumb {
            border-left: 4px solid transparent;
          }
        `,
    ],
  ];

export default Scroll;
