import { Fragment } from 'react';
import { Theme, css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import Divider from '~components/atom/Divider';
import { IconType } from '~components/atom/Icon';
import Spacer from '~components/atom/Spacer';
import Button from '~components/buttons/Button';
import Drawer from '~components/drawer/Drawer';
import { OverlayElementProps } from '~components/overlay/Overlay';
import { MAIN_SLOGAN } from '~constants';
import useUpdateEffect from '~hooks/useUpdateEffect';

interface NonIndexedMenu {
  label: string;
  icon?: IconType;
  to: string;
  isDisabled?: boolean;
  children?: undefined;
}

interface Props extends OverlayElementProps {
  menus: NonIndexedMenu[];
}

function NavigationDrawer({ menus, close, ...rest }: Props) {
  const location = useLocation();

  useUpdateEffect(() => {
    close();
  }, [location.pathname]);

  return (
    <Drawer {...rest} placement="left" close={close}>
      <div css={styledContainer}>
        <div css={styledHeader}>
          <h2 css={styledTitle}>{MAIN_SLOGAN}</h2>
          <p css={styledCaption}>created by keyonnaise</p>
        </div>
        <Divider />
        <div css={styledContent}>
          {menus.map((menu, i) => (
            <Fragment key={i}>
              {i !== 0 && <Spacer y={0.5} />}
              <Menu {...menu} />
            </Fragment>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

// Subcomponents
interface MenuProps extends NonIndexedMenu {}

const Menu = ({ label, icon, to, isDisabled }: MenuProps) => {
  return (
    <Button as="anchor" variant="text" align="left" leftIcon={icon} to={to} isDisabled={isDisabled}>
      {label}
    </Button>
  );
};

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
`;

const styledHeader = css`
  padding: 64px 16px 16px 16px;
`;

const styledContent = css`
  padding: 32px 16px;
`;

const styledTitle = (theme: Theme) => css`
  margin-bottom: 0.5lh;
  font-size: 16px;
  font-weight: ${theme.weights.extrabold};
`;

const styledCaption = css`
  opacity: 0.6;
  font-family: 'Ubuntu Sans Mono', monospace;
  font-size: 12px;
`;

export default NavigationDrawer;
