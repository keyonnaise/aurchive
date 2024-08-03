import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Divider from '~components/atom/Divider';
import Spacer from '~components/atom/Spacer';
import IconButton from '~components/buttons/IconButton';
import useOverlay from '~components/overlay/hooks/useOverlay';
import contains from '~lib/contains';
import { breakpoints } from '~styles/media';
import { applyOpacityToHex } from '~styles/palette';
import { useBaseStructureContext } from './BaseStructure';
import NavigationDrawer from './NavigationDrawer';
import NavigationTabs from './NavigationTabs';

const LOGO = 'OUR_ARCHIVE';
const MENUS = [
  {
    label: '멤버 소개',
    to: '/members',
  },
  {
    label: '게시글',
    to: '/posts',
  },
];

export type ColorScheme = 'netural' | 'dark' | 'light';

interface Props {
  children: React.ReactNode;
}

function BaseStructureHeader({ children }: Props) {
  const { platform, headerColorScheme } = useBaseStructureContext();
  const navColorScheme = headerColorScheme === 'dark' ? 'light' : headerColorScheme === 'light' ? 'dark' : 'netural';

  return platform === 'DESKTOP' ? (
    <DesktopHeader headerColorScheme={headerColorScheme} navColorScheme={navColorScheme}>
      {children}
    </DesktopHeader>
  ) : (
    <MobileHeader headerColorScheme={headerColorScheme} navColorScheme={navColorScheme}>
      {children}
    </MobileHeader>
  );
}

// Subcomponents
interface DesktopHeaderProps {
  headerColorScheme: ColorScheme;
  navColorScheme: ColorScheme;
  children: React.ReactNode;
}

const DesktopHeader = ({ headerColorScheme, navColorScheme, children }: DesktopHeaderProps) => {
  return (
    <header css={styledContainer}>
      <div css={styledContent({ colorScheme: headerColorScheme })}>
        <div css={styledContent.left}>
          <Anchor css={styledLogo} to="/">
            {LOGO}
          </Anchor>
        </div>
        <div css={styledContent.right}>
          <NavigationTabs colorScheme={navColorScheme} menus={MENUS} />
          <Divider
            orientation="vertical"
            color={navColorScheme === 'dark' ? 'black' : navColorScheme === 'light' ? 'white' : undefined}
            size="16px"
            offset={1}
          />
          {children}
        </div>
      </div>
    </header>
  );
};

interface MobileHeaderProps {
  headerColorScheme: ColorScheme;
  navColorScheme: ColorScheme;
  children: React.ReactNode;
}

const MobileHeader = ({ headerColorScheme, navColorScheme, children }: MobileHeaderProps) => {
  const overlay = useOverlay();

  const openNavigationDrawer = useCallback(
    () => overlay.open((props) => <NavigationDrawer {...props} menus={MENUS} />),
    [overlay],
  );

  return (
    <header css={styledContainer}>
      <div css={styledContent({ colorScheme: headerColorScheme })}>
        <div css={styledContent.left}>
          <IconButton
            as="button"
            variant="text"
            colorScheme={navColorScheme}
            size="sm"
            icon="system/menu"
            onClick={openNavigationDrawer}
          />
          <Spacer x={0.5} />
          <Anchor css={styledLogo} to="/">
            {LOGO}
          </Anchor>
        </div>
        <div css={styledContent.right}>{children}</div>
      </div>
    </header>
  );
};

// Styles
const styledContainer = (theme: Theme) => css`
  z-index: ${theme.elevation.appBar};
  position: fixed;
  inset: 12px 0 auto 0;
  display: flex;
`;

const styledContent = Object.assign(
  ({ colorScheme }: { colorScheme: ColorScheme }) =>
    (theme: Theme) => [
      css`
        flex-grow: 0;
        flex-basis: auto;

        display: flex;
        align-items: center;
        width: min(${breakpoints.xl}px, calc(100% - 24px));
        height: 64px;
        padding: 0 16px;
        margin: 0 auto;
        border: 1px solid ${theme.border};
        border-radius: ${theme.radii.sm};
        backdrop-filter: blur(8px);
        box-shadow: ${theme.shadows.md};
      `,

      // Color scheme
      colorScheme === 'netural' &&
        css`
          color: ${theme.text.main};
          background-image: radial-gradient(
            rgba(0, 0, 0, 0) 2px,
            ${applyOpacityToHex(theme.background.elevated, 0.1)} 2px
          );
          background-size: 4px 4px;
        `,
      contains(['dark', 'light'] as const, colorScheme) &&
        css`
          color: ${theme[colorScheme].contrast};
          background-image: radial-gradient(rgba(0, 0, 0, 0) 2px, ${theme[colorScheme].alpha(0.1)} 2px);
          background-size: 4px 4px;
        `,
    ],
  {
    left: css`
      flex-grow: 0;
      flex-basis: auto;

      display: flex;
      align-items: center;
    `,

    right: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;

      display: flex;
      justify-content: flex-end;
      align-items: center;
    `,
  },
);

const styledLogo = css`
  position: relative;
  font-family: 'Ubuntu Sans Mono', monospace;
  font-size: 14px;
  font-weight: bold;
`;

export default BaseStructureHeader;
