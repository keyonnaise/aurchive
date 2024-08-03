import { Theme, css } from '@emotion/react';
import Divider from '~components/atom/Divider';
import Icon, { IconType } from '~components/atom/Icon';

interface Props {
  icon?: IconType;
  label: string;
  children?: React.ReactNode;
}

function Summary({ icon, label, children }: Props) {
  return (
    <div css={styledContainer}>
      {icon !== undefined && (
        <div css={styledContainer.item}>
          <IconBlock icon={icon} />
        </div>
      )}
      <div css={styledContainer.item}>
        <h2 css={styledLabel}>{label}</h2>
      </div>
      <div css={styledContainer.last}>
        <Divider />
      </div>
      {children !== undefined && <div css={styledContainer.item}>{children}</div>}
    </div>
  );
}

// Subcomponents
interface IconBlockProps {
  icon: IconType;
}

const IconBlock = ({ icon }: IconBlockProps) => {
  return (
    <div css={styledIconBox}>
      <Icon icon={icon} />
    </div>
  );
};

// Styles
const styledContainer = Object.assign(
  css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,
  {
    item: css`
      flex-grow: 0;
      flex-basis: auto;
    `,

    last: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledIconBox = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: ${theme.netural.contrast};
  background-color: ${theme.netural.main};
  border-radius: ${theme.radii.sm};
  font-size: 24px;
`;

const styledLabel = (theme: Theme) => css`
  font-size: 24px;
  font-weight: ${theme.weights.extrabold};
`;

export default Summary;
