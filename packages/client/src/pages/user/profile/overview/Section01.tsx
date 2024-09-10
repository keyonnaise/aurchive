import { Theme, css } from '@emotion/react';
import { useUserContext } from '~pages/user';
import { styledBioFormat } from '~styles/formats';

function Section01() {
  const { profile } = useUserContext();
  const { about } = profile;

  if (about === null) return null;

  return (
    <section css={styledContainer}>
      <div css={[styledBioFormat]} dangerouslySetInnerHTML={{ __html: about }} />
    </section>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  padding: 32px;
  margin-bottom: 64px;
  color: ${theme.text.main};
  background-color: ${theme.background.sub};
  border: 1px solid ${theme.border.netural};
  border-radius: ${theme.radii.md};
`;

export default Section01;
