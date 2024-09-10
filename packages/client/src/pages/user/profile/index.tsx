import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { Outlet, matchPath, useLocation } from 'react-router-dom';
import { IconType } from '~components/atom/Icon';
import Section from '~components/atom/Section';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import IconButton from '~components/buttons/IconButton';
import Avatar from '~components/data-display/Avatar';
import Tabs from '~components/navigation/Tabs';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { IUser } from '~lib/api/users/types';
import media from '~styles/media';
import { useUserContext } from '..';

function Index() {
  const user = useUserContext();
  const uid = user.id;

  const location = useLocation();

  const isMatch = useCallback((path: string) => matchPath({ path }, location.pathname) !== null, [location.pathname]);

  return (
    <Section>
      <div css={styledContainer}>
        <div css={styledContainer.left}>
          <Profile user={user} />
        </div>
        <div css={styledContainer.right}>
          <div css={styledNav}>
            <Tabs variant="text">
              <Tabs.Item as="anchor" to={`/@${uid}`} isActive={isMatch(`/@${uid}`)}>
                Overview
              </Tabs.Item>
              <Tabs.Item as="anchor" to={`/@${uid}/stories`} isActive={isMatch(`/@${uid}/stories`)}>
                Stories
              </Tabs.Item>
              <Tabs.Item as="anchor" to={`/@${uid}/posts`} isActive={isMatch(`/@${uid}/posts`)}>
                Posts
              </Tabs.Item>
            </Tabs>
          </div>
          <Spacer y={4} />
          <Outlet context={user} />
        </div>
      </div>
    </Section>
  );
}

// Subcomponents
interface ProfileProps {
  user: IUser;
}

const Profile = ({ user }: ProfileProps) => {
  const { email, displayName, photoUrl, profile } = user;
  const { bio, githubUrl, linkedinUrl, instagramUrl, twitterUrl } = profile;

  const snackbar = useSnackbar();

  const handleCopyEmail = useCallback(() => {
    snackbar.promise(navigator.clipboard.writeText(email), {
      pending: '이메일을 클립보드에 복사하는 중 이에요.',
      success: '이메일을 성공적으로 복사 했어요.',
      error: '이메일을 클립보드에 복사하는 도중 오류가 발생했어요.',
    });
  }, [email, snackbar]);

  return (
    <div>
      <Avatar size="4xl" radius="full" photoUrl={photoUrl} name={displayName} />
      <Spacer y={2} />
      <Typography as="h2" variant="body1" weight="bold">
        {displayName}
      </Typography>
      <Spacer y={0} />
      <Typography variant="body2" color="sub">
        {bio}
      </Typography>
      <Spacer y={2} />
      <div css={styledLinkGroup}>
        {githubUrl !== null && <Link icon="logos/github-line" to={githubUrl} />}
        {linkedinUrl !== null && <Link icon="logos/linkedin-line" to={linkedinUrl} />}
        {instagramUrl !== null && <Link icon="logos/instagram-line" to={instagramUrl} />}
        {twitterUrl !== null && <Link icon="logos/twitter-line" to={twitterUrl} />}
        <IconButton as="button" shape="round" size="sm" icon="business/mail-line" onClick={handleCopyEmail} />
      </div>
    </div>
  );
};

interface LinkProps {
  icon: IconType;
  to: string;
}

const Link = ({ icon, to }: LinkProps) => {
  return <IconButton as="anchor" variant="ghost" shape="round" size="sm" icon={icon} to={to} target="_blank" />;
};

// Styles
const styledContainer = Object.assign(
  css`
    display: flex;
    flex-wrap: wrap;
    gap: 64px;
    padding: 32px 0;
  `,
  {
    left: css`
      ${media.xs} {
        flex-grow: 0;
        flex-basis: auto;
        width: 100%;
      }

      ${media.lg} {
        flex-grow: 0;
        flex-basis: auto;
        width: 256px;
      }
    `,

    right: css`
      ${media.xs} {
        flex-grow: 0;
        flex-basis: auto;
        width: 100%;
      }

      ${media.lg} {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
      }
    `,
  },
);

const styledNav = (theme: Theme) => css`
  border-bottom: 1px solid ${theme.border.netural};
`;

const styledLinkGroup = css`
  display: flex;
  gap: 8px;
`;

export default Index;
