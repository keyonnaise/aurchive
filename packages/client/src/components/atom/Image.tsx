import { forwardRef, useEffect, useRef, useState } from 'react';
import { Theme, css } from '@emotion/react';
import { P, match } from 'ts-pattern';
import useCombinedRefs from '~hooks/useCombinedRefs';
import usePreservedCallback from '~hooks/usePreservedCallback';
import contains from '~lib/contains';

type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type Shadow = 'none' | 'sm' | 'md' | 'lg';

interface Props {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  width?: number;
  height?: number;
  radius?: Radius;
  shadow?: Shadow;
  hasBorder?: boolean;
  isCovered?: boolean;
  isZoomable?: boolean;
  onLoad?(): void;
  onError?(): void;
}

function Image(
  {
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    radius = 'none',
    shadow = 'none',
    hasBorder = false,
    isCovered = false,
    isZoomable = false,
    onLoad,
    onError,
  }: Props,
  ref: ComponentRef<'img'>,
) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setIsError] = useState(false);

  const initialize = usePreservedCallback(() => {
    setIsLoaded(false);
    setIsError(false);
  });

  const handleLoad = usePreservedCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  });

  const handleError = usePreservedCallback(() => {
    setIsLoaded(false);
    setIsError(true);
    onError?.();
  });

  useEffect(() => {
    initialize();

    const img = imgRef.current!;
    const isCashed = img.complete && img.naturalHeight !== 0;

    if (isCashed) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad, { once: true });
      img.addEventListener('error', handleError, { once: true });
    }
  }, [src, initialize, handleLoad, handleError]);

  useEffect(() => {
    if (!isZoomable) return;

    const img = imgRef.current!;

    img.style.transition = 'transform 200ms linear';

    const onMouseMove = (e: MouseEvent) => {
      const { offsetX, offsetY } = e;
      const pos = {
        x: img.offsetWidth / 2 - offsetX,
        y: img.offsetHeight / 2 - offsetY,
      };

      img.style.transform = `scale(1.05) translate(${pos.x / 25}px, ${pos.y / 25}px)`;
    };

    const onMouseLeave = () => {
      img.style.transform = '';
    };

    img.addEventListener('mousemove', onMouseMove);
    img.addEventListener('mouseleave', onMouseLeave);

    return () => {
      img.style.transition = '';

      img.removeEventListener('mousemove', onMouseMove);
      img.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isZoomable]);

  return (
    <div
      css={styledContainer({
        width,
        height,
        radius,
        shadow,
        hasBorder,
        isCovered,
        isLoaded,
      })}
    >
      <img
        ref={useCombinedRefs(imgRef, ref)}
        css={styledContent({ isZoomable })}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
      />
    </div>
  );
}

// Styles
const styledContainer =
  ({
    width,
    height,
    radius,
    shadow,
    hasBorder,
    isCovered,
    isLoaded,
  }: {
    width: number | undefined;
    height: number | undefined;
    radius: Radius;
    shadow: Shadow;
    hasBorder: boolean;
    isCovered: boolean;
    isLoaded: boolean;
  }) =>
  (theme: Theme) => [
    css`
      overflow: hidden;
      display: block;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      border: ${hasBorder && `1px solid ${theme.border.netural}`};
      opacity: ${isLoaded ? 1 : 0};
      transition: opacity 400ms ease;
    `,

    // Size
    match([width, height])
      .with(
        [P.number, P.number],
        () => css`
          width: ${width}px;
          aspect-ratio: ${width} / ${height};
        `,
      )
      .with(
        [P.number, undefined],
        () => css`
          width: ${width}px;
        `,
      )
      .with(
        [undefined, P.number],
        () => css`
          height: ${height}px;
        `,
      )
      .otherwise(() => undefined),

    // Radius
    contains(['sm', 'md', 'lg'] as const, radius) &&
      css`
        border-radius: ${theme.radii[radius]};
      `,
    radius === 'full' &&
      css`
        border-radius: 9999px;
      `,

    // Shadow
    contains(['sm', 'md', 'lg'] as const, shadow) &&
      css`
        box-shadow: ${theme.shadows[shadow]};
      `,

    // Others
    isCovered &&
      css`
        width: 100%;
        height: 100%;
      `,
  ];

const styledContent = ({ isZoomable }: { isZoomable: boolean }) => [
  css`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;

    /* -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none; */
  `,

  // Others
  isZoomable &&
    css`
      transition: transform 200ms linear;
    `,
];

export default forwardRef(Image);
