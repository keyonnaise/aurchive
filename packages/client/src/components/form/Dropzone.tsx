import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Icon, { IconType } from '~components/atom/Icon';
import Image from '~components/atom/Image';
import Button from '~components/buttons/Button';
import useFileSelector from '~hooks/useFileSelector';
import { setAlphaToHex } from '~styles/themes';

type Shape = 'round' | 'square';
type ColorScheme = 'netural' | 'dark' | 'light';

interface Props {
  shape?: Shape;
  colorScheme?: ColorScheme;
  width: number;
  height: number;
  icon?: IconType;
  title?: string;
  description?: string;
  placeholder?: string;
  accept: string[];
  maxFileSize: number;
  isPending?: boolean;
  isDisabled?: boolean;
  onSelect?(file: File): void;
}

function Dropzone({
  shape = 'square',
  colorScheme = 'netural',
  width,
  height,
  icon = 'document/file-image-line',
  title,
  description,
  placeholder,
  accept,
  maxFileSize,
  isPending = false,
  isDisabled = false,
  onSelect,
}: Props) {
  const hasPlaceholder = placeholder !== undefined;

  const selectFile = useFileSelector();

  const handleClick = useCallback(async () => {
    const file = await selectFile({ accept, maxFileSize });
    onSelect?.(file);
  }, [accept, maxFileSize, selectFile, onSelect]);

  return (
    <Button
      as="button"
      variant="none"
      css={styledContainer({ shape, colorScheme, width, height, isDisabled })}
      isDisabled={isPending || isDisabled}
      onClick={handleClick}
    >
      {hasPlaceholder && (
        <Layer>
          <Image src={placeholder} isCovered />
        </Layer>
      )}
      <Layer isDimmed={hasPlaceholder}>
        <div css={styledTextBlock}>
          <div css={styledTextBlockContent}>
            <div css={styledIcon}>
              <Icon icon={icon} />
            </div>
            {title !== undefined && <p css={styledTitle}>{title}</p>}
            {description !== undefined && <p css={styledDescription}>{description}</p>}
          </div>
        </div>
      </Layer>
    </Button>
  );
}

// Subcomponents
interface LayerProps {
  isDimmed?: boolean;
  children: React.ReactNode;
}

const Layer = ({ isDimmed = false, children }: LayerProps) => {
  return <div css={styledLayer({ isDimmed })}>{children}</div>;
};

// Styles
const styledContainer =
  ({
    shape,
    colorScheme,
    width,
    height,
    isDisabled,
  }: {
    shape: Shape;
    colorScheme: ColorScheme;
    width: number;
    height: number;
    isDisabled: boolean;
  }) =>
  (theme: Theme) => [
    css`
      position: relative;
      overflow: hidden;
      width: min(${width}px, 100%);
      aspect-ratio: ${width} / ${height};
      color: ${theme[colorScheme].main};
      background-color: ${setAlphaToHex(theme[colorScheme].main, 0.2)};
      border: 2px dashed ${setAlphaToHex(theme[colorScheme].main, 0.4)};
      border-radius: ${shape === 'round' ? theme.radii.full : theme.radii.md};
      opacity: ${isDisabled && 0.6};

      &:hover {
        background-color: ${theme[colorScheme].hover};
      }
      &:active {
        background-color: ${theme[colorScheme].active};
      }
      &:focus-visible {
        background-color: ${theme[colorScheme].focus};
      }
    `,
  ];

const styledLayer =
  ({ isDimmed }: { isDimmed: boolean }) =>
  (theme: Theme) => [
    css`
      position: absolute;
      inset: 0px;
    `,

    isDimmed &&
      css`
        color: ${theme.light.main};
        background-color: ${theme.dim.basic};
        transition: backdrop-filter ease 200ms;

        &:hover {
          backdrop-filter: blur(4px);
        }
      `,
  ];

const styledTextBlock = css`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const styledTextBlockContent = css`
  margin: 0 auto;
  text-align: center;
`;

const styledIcon = css`
  font-size: 32px;

  svg {
    margin-inline: auto;
  }
`;

const styledTitle = (theme: Theme) => css`
  margin: 16px 0 0.5lh 0;
  font-size: 16px;
  font-weight: ${theme.weights.extrabold};
`;

const styledDescription = css`
  font-size: 14px;
`;

export default Dropzone;
