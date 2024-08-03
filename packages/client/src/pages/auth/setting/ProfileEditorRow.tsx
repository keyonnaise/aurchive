import { css } from '@emotion/react';
import Typography from '~components/atom/Typography';
import media from '~styles/media';

interface Props {
  label: string;
  children: React.ReactNode;
}

function ProfileEditorRow({ label, children }: Props) {
  return (
    <div css={styledContainer}>
      <div css={styledContainer.left}>
        <Typography variant="body1" color="third">
          {label}
        </Typography>
      </div>
      <div css={styledContainer.right}>{children}</div>
    </div>
  );
}

// Styles
const styledContainer = Object.assign(
  css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 32px 0;
  `,
  {
    left: css`
      flex-grow: 0;
      flex-basis: auto;
      width: min(256px, 100%);
    `,

    right: css`
      ${media.xs} {
        flex-grow: 0;
        flex-basis: auto;
        width: 100%;
      }

      ${media.md} {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
      }
    `,
  },
);

export default ProfileEditorRow;
