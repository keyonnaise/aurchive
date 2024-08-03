import { Theme, css } from '@emotion/react';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';

interface Props {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  };
}

function ErrorScreenTemplate({ title, description, action }: Props) {
  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <Typography variant="h2" weight="extrabold">
          {title}
        </Typography>
        <Typography variant="body1" color="sub">
          {description}
        </Typography>
        <Spacer y={2} />
        <Button as="button" shape="round" inline onClick={action.onClick}>
          {action.label}
        </Button>
      </div>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  z-index: 9999;
  position: fixed;
  inset: 0px;
  display: flex;
  align-items: center;
  color: ${theme.netural.main};
  background-color: ${theme.netural.contrast};
`;

const styledContent = css`
  padding: 24px;
  margin: 0 auto;
  text-align: center;
`;

export default ErrorScreenTemplate;
