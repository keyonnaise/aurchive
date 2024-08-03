import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Br from '~components/atom/Br';
import Divider from '~components/atom/Divider';
import { IconType } from '~components/atom/Icon';
import IconButton from '~components/buttons/IconButton';
import Skeleton from '~components/feedback/Skeleton';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { IUser } from '~lib/api/users/types';
import ellipsis from '~styles/ellipsis';
import Avatar from './Avatar';
import Card from './Card';

interface Props extends IUser {}

function UserCard({ id, email, displayName, photoUrl, profile }: Props) {
  const { bio, githubUrl, instagramUrl, linkedinUrl, twitterUrl } = profile;

  const snackbar = useSnackbar();

  const handleCopyEmail = useCallback(() => {
    snackbar.promise(navigator.clipboard.writeText(email), {
      pending: '이메일을 클립보드에 복사하는 중 이에요.',
      success: '이메일을 성공적으로 복사 했어요.',
      error: '이메일을 클립보드에 복사하는 도중 오류가 발생했어요.',
    });
  }, [email, snackbar]);

  return (
    <Card>
      <Card.Content>
        <Anchor css={styledProfile} to={`/@${id}`}>
          <div css={styledProfile.left}>
            <Avatar size="xl" radius="sm" photoUrl={photoUrl} name={displayName} />
          </div>
          <div css={styledProfile.right}>
            <h2 css={styledDisplayName}>{displayName}</h2>
            <p css={styledBio}>{bio}</p>
          </div>
        </Anchor>
      </Card.Content>
      <Divider />
      <Card.Footer>
        <div css={styledLinkGroup}>
          {githubUrl !== null && <Link icon="logos/github-line" to={githubUrl} />}
          {linkedinUrl !== null && <Link icon="logos/linkedin-line" to={linkedinUrl} />}
          {instagramUrl !== null && <Link icon="logos/instagram-line" to={instagramUrl} />}
          {twitterUrl !== null && <Link icon="logos/twitter-line" to={twitterUrl} />}
          <IconButton as="button" shape="round" size="sm" icon="business/mail-line" onClick={handleCopyEmail} />
        </div>
      </Card.Footer>
    </Card>
  );
}

// Subcomponents
export const UserCardSkeleton = () => {
  return (
    <Card>
      <Card.Content>
        <div css={styledProfile}>
          <div css={styledProfile.left}>
            <Skeleton shape="round" width={96} height={96} />
          </div>
          <div css={styledProfile.right}>
            <div css={styledDisplayName}>
              <Skeleton width="60%" />
            </div>
            <div css={styledBio}>
              <Skeleton width="100%" />
              <Br />
              <Skeleton width="40%" />
            </div>
          </div>
        </div>
      </Card.Content>
      <Divider />
      <Card.Footer>
        <div css={styledLinkGroup}>
          <IconButton as="button" shape="round" size="sm" icon="business/mail-line" isDisabled />
        </div>
      </Card.Footer>
    </Card>
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
const styledProfile = Object.assign(
  css`
    display: flex;
    align-items: center;
    padding: 16px 0;
  `,
  {
    left: css`
      flex-grow: 0;
      flex-basis: auto;
      margin-right: 16px;
    `,

    right: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledDisplayName = (theme: Theme) => [
  ellipsis,

  css`
    margin-bottom: 0.5lh;
    font-size: 16px;
    font-weight: ${theme.weights.bold};
  `,
];

const styledBio = (theme: Theme) => [
  ellipsis.multiline(2),

  css`
    height: 2lh;
    color: ${theme.text.sub};
    font-size: 14px;
    line-height: 1.8;
  `,
];

const styledLinkGroup = css`
  display: flex;
  justify-content: end;
  gap: 8px;
`;

export default UserCard;
