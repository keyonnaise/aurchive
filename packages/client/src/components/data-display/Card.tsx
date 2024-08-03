import React, { createContext, useContext, useMemo } from 'react';
import { Theme, css } from '@emotion/react';
import { To } from 'react-router-dom';
import { P, match } from 'ts-pattern';
import { UnstyledButton } from '~components/buttons/Button';
import { assert } from '~lib/assert';

interface BlockProps {
  as?: 'block';
  to?: undefined;
  isDisabled?: undefined;
  onClick?: undefined;
}

interface AnchorProps {
  as: 'anchor';
  to: To;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

interface ButtonProps {
  as: 'button';
  to?: undefined;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type PolymorphicProps<P = object> = (BlockProps | AnchorProps | ButtonProps) & P;

type Radius = 'none' | 'sm' | 'md' | 'lg';
type Shadow = 'none' | 'sm' | 'md' | 'lg';
type Align = 'left' | 'center' | 'right';

type Props = PolymorphicProps<{
  width?: number | string;
  radius?: Radius;
  shadow?: Shadow;
  isBlurred?: boolean;
  children: React.ReactNode;
}>;

function Card({ radius = 'md', children, ...rest }: Props) {
  return (
    <CardProvider radius={radius}>
      <Container {...rest}>{children}</Container>
    </CardProvider>
  );
}

// Context API
interface ContextValue {
  radius: Radius;
}

const CardContext = createContext<ContextValue | null>(null);

function useCardContext() {
  const ctx = useContext(CardContext);

  assert(ctx !== null, 'useCardContext 함수는 CardProvider 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface ProviderProps {
  radius: Radius;
  children: React.ReactNode;
}

function CardProvider({ radius, children }: ProviderProps) {
  const value = useMemo<ContextValue>(() => ({ radius }), [radius]);

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

// Subcomponents
type ContainerProps = PolymorphicProps<{
  width?: number | string;
  shadow?: Shadow;
  isBlurred?: boolean;
  children: React.ReactNode;
}>;

const Container = ({ width = '100%', shadow = 'md', isBlurred = false, ...rest }: ContainerProps) => {
  const { radius } = useCardContext();
  const style = styledContainer({ width, radius, shadow, isBlurred });

  return match(rest)
    .with({ as: P.union('anchor', 'button') }, (props) => <UnstyledButton {...props} css={style} />)
    .with({ as: P.optional('block') }, (props) => <article {...props} css={style} />)
    .exhaustive();
};

interface HeaderProps {
  isBlurred?: boolean;
  children: React.ReactNode;
}

const Header = ({ isBlurred = false, children }: HeaderProps) => {
  const { radius } = useCardContext();

  return <div css={styledHeader({ radius, isBlurred })}>{children}</div>;
};

interface MediaProps {
  children: React.ReactNode;
}

const Media = ({ children }: MediaProps) => {
  const { radius } = useCardContext();

  return <div css={styledMedia({ radius })}>{children}</div>;
};
interface ContentProps {
  align?: Align;
  children: React.ReactNode;
}

const Content = ({ align = 'left', children }: ContentProps) => {
  return <div css={styledContent({ align })}>{children}</div>;
};

interface FooterProps {
  isBlurred?: boolean;
  children: React.ReactNode;
}

const Footer = ({ isBlurred = false, children }: FooterProps) => {
  const { radius } = useCardContext();

  return <div css={styledFooter({ radius, isBlurred })}>{children}</div>;
};

// Styles
const styledContainer =
  ({
    width,
    radius,
    shadow,
    isBlurred,
  }: {
    width: string | number;
    radius: Radius;
    shadow: Shadow;
    isBlurred: boolean;
  }) =>
  (theme: Theme) => [
    css`
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      width: min(${typeof width === 'number' ? `${width}px` : width}, 100%);
      color: ${theme.text.main};
      background-color: ${theme.background.elevated};
      border-radius: ${theme.radii[radius]};
      box-shadow: ${shadow !== 'none' && theme.shadows[shadow]};
      text-align: initial;

      a&,
      button& {
        transition: transform ease 200ms;
      }

      a&:hover,
      button&:hover {
        transform: translateY(-4px);
      }
    `,

    // Others
    isBlurred &&
      css`
        color: ${theme.light.main};
        background-color: ${theme.dim.basic};
        backdrop-filter: blur(4px);
      `,
  ];

const styledHeader =
  ({ radius, isBlurred }: { radius: Radius; isBlurred: boolean }) =>
  (theme: Theme) => [
    css`
      flex-grow: 0;
      flex-basis: auto;
      padding: 8px 16px;
    `,

    // Others
    isBlurred &&
      css`
        z-index: 1;
        position: absolute;
        inset: 0 0 auto 0;
        margin: 4px;
        color: ${theme.light.main};
        background-color: ${theme.dim.basic};
        backdrop-filter: blur(4px);
        border-radius: ${radius !== 'none' && `calc(${theme.radii[radius]} - 4px)`};
      `,
  ];

const styledMedia =
  ({ radius }: { radius: Radius }) =>
  (theme: Theme) => css`
    flex-grow: 0;
    flex-basis: auto;
    overflow: hidden;
    margin: 4px;
    border-radius: ${radius !== 'none' && `calc(${theme.radii[radius]} - 4px)`};
  `;

const styledContent = ({ align }: { align: Align }) => css`
  flex-grow: 1;
  flex-basis: 0;
  /* min-height: 0; */
  padding: 0 16px;
  text-align: ${align};
`;

const styledFooter =
  ({ radius, isBlurred }: { radius: Radius; isBlurred: boolean }) =>
  (theme: Theme) => [
    css`
      flex-grow: 0;
      flex-basis: auto;
      padding: 8px 16px;
    `,

    // Others
    isBlurred &&
      css`
        z-index: 1;
        position: absolute;
        inset: auto 0 0 0;
        margin: 4px;
        color: ${theme.light.main};
        background-color: ${theme.dim.basic};
        backdrop-filter: blur(4px);
        border-radius: ${radius !== 'none' && `calc(${theme.radii[radius]} - 4px)`};
      `,
  ];

export default Object.assign(Card, {
  Header,
  Media,
  Content,
  Footer,
});
