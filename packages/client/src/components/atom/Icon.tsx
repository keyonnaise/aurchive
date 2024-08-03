import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import icons from '~assets/icons';

export type IconType = keyof typeof icons;

interface Props {
  icon: IconType;
  size?: string;
  fill?: string;
  inline?: true;
}

function Icon({ icon, size = '1em', fill = 'currentColor', inline }: Props) {
  const [component, setComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      const { default: Component } = await icons[icon];

      setComponent(
        <Component
          css={styledIcon({ inline })}
          width={size}
          height={size}
          fill={fill}
        />,
      );
    })();
  }, [icon, size, fill, inline]);

  return component;
}

// Styles
const styledIcon = ({ inline }: { inline: true | undefined }) => css`
  display: ${inline !== undefined && 'inline-block'};
  vertical-align: middle;
`;

export default Icon;
