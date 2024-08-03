import { useCallback, useState } from 'react';
import { SerializedStyles, Theme, css } from '@emotion/react';
import _ from 'lodash';
import Icon, { IconType } from '~components/atom/Icon';
import Image from '~components/atom/Image';

type ColorScheme = 'netural' | 'primary' | 'dark' | 'light';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
type Radius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
  colorScheme?: ColorScheme;
  size?: Size;
  radius?: Radius;
  name?: string;
  photoUrl?: string | null;
  icon?: IconType;
}

function Avatar({
  colorScheme = 'primary',
  size = 'xs',
  radius = 'full',
  name,
  photoUrl,
  icon = 'user/user-fill',
}: Props) {
  const [isPhotoError, setIsPhotoError] = useState(false);
  const isLoadedPhoto = !_.isNil(photoUrl) && !isPhotoError;

  const handlePhotoLoad = useCallback(() => setIsPhotoError(false), []);
  const handlePhotoError = useCallback(() => setIsPhotoError(true), []);

  return (
    <span css={styledContainer({ colorScheme, size, radius, isLoadedPhoto })}>
      {isLoadedPhoto ? (
        <Image
          src={photoUrl}
          alt={`${name}의 프로필 사진`}
          isCovered
          onLoad={handlePhotoLoad}
          onError={handlePhotoError}
        />
      ) : name !== undefined ? (
        <span>{name.slice(0, 2)}</span>
      ) : (
        <Icon icon={icon} size="1.5em" />
      )}
    </span>
  );
}

// Styles
const styledContainer =
  ({
    colorScheme,
    size,
    radius,
    isLoadedPhoto,
  }: {
    colorScheme: ColorScheme;
    size: Size;
    radius: Radius;
    isLoadedPhoto: boolean;
  }) =>
  (theme: Theme) => [
    getAvatarSize[size],

    css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: ${theme.radii[radius]};
      font-weight: ${theme.weights.extrabold};
      vertical-align: middle;
      text-transform: uppercase;
    `,

    // Others
    isLoadedPhoto
      ? css`
          border: 1px solid ${theme.border};
        `
      : css`
          color: ${theme[colorScheme].contrast};
          background: ${theme[colorScheme].main};
        `,
  ];

const getAvatarSize: Record<Size, SerializedStyles> = {
  xs: css`
    width: 32px;
    height: 32px;
    font-size: 12px;
  `,

  sm: css`
    width: 48px;
    height: 48px;
    font-size: 18px;
  `,

  md: css`
    width: 64px;
    height: 64px;
    font-size: 24px;
  `,

  lg: css`
    width: 80px;
    height: 80px;
    font-size: 30px;
  `,

  xl: css`
    width: 96px;
    height: 96px;
    font-size: 36px;
  `,

  '2xl': css`
    width: 128px;
    height: 128px;
    font-size: 48px;
  `,

  '4xl': css`
    width: 160px;
    height: 160px;
    font-size: 60px;
  `,
};

export default Avatar;
