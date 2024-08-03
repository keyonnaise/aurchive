import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { formatInTimeZone } from 'date-fns-tz';
import Image from '~components/atom/Image';
import IconButton from '~components/buttons/IconButton';
import Card from '~components/data-display/Card';
import Skeleton from '~components/feedback/Skeleton';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useDeletePostMutation } from '~hooks/queries/postQueries';
import stripTags from '~lib/stripTags';
import ellipsis from '~styles/ellipsis';

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1521134976835-9963f2185519?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

interface Props {
  id: string;
  publishedAt: number;
  title: string;
  tags: string[];
  thumbnail: string | null;
  body: string;
}

function PostCard({ id, publishedAt, title, tags, thumbnail, body }: Props) {
  const formattedDate = formatInTimeZone(publishedAt, 'Asia/Seoul', 'yyyy-MM-dd');

  return (
    <Card as="anchor" to={`/posts/${id}`}>
      <Card.Media>
        <Image src={thumbnail || DEFAULT_THUMBNAIL} width={576} height={360} />
      </Card.Media>
      <Card.Content>
        <div css={styledTextBox}>
          <p css={styledInfo}>
            <span css={styledInfo.label}>발행일</span>
            <time css={styledInfo.date}>{formattedDate}</time>
          </p>
          <h2 css={styledTitle}>{title}</h2>
          <p css={styledDescription}>{stripTags(body)}</p>
        </div>
        <p css={styledTags}>
          {tags.map((tag, i) => (
            <span key={i}>#{tag}</span>
          ))}
        </p>
      </Card.Content>
    </Card>
  );
}

// Subcomponents
interface DraftPostCardProps {
  id: string;
  updatedAt: number;
  title: string;
  tags: string[];
  thumbnail: string | null;
  body: string;
}

export const DraftPostCard = ({ id, updatedAt, title, tags, thumbnail, body }: DraftPostCardProps) => {
  const formattedDate = formatInTimeZone(updatedAt, 'Asia/Seoul', 'yyyy-MM-dd');

  const overlay = useOverlay();
  const snackbar = useSnackbar();

  const { mutateAsync } = useDeletePostMutation();

  const handlePostDelete = useCallback(() => {
    const handleConfirm = () => {
      snackbar.promise(mutateAsync(id), {
        pending: '게시글을 삭제하고 있어요.',
        success: '게시글이 정상적으로 삭제 됐어요.',
        error: '게시글을 삭제하는 도중 오류가 발생했어요.',
      });
    };

    overlay.open((props) => (
      <Confirm
        {...props}
        title="게시글을 정말 삭제하시겠어요?"
        description="삭제된 게시글은 복구할 수 없어요."
        onConfirm={handleConfirm}
      />
    ));
  }, [id, overlay, snackbar, mutateAsync]);

  return (
    <Card>
      <Card.Media>
        <Image src={thumbnail || DEFAULT_THUMBNAIL} width={576} height={360} />
      </Card.Media>
      <Card.Content>
        <div css={styledTextBox}>
          <p css={styledInfo}>
            <span css={styledInfo.label}>수정일</span>
            <time css={styledInfo.date}>{formattedDate}</time>
          </p>
          <h2 css={styledTitle}>{title || 'N/A'}</h2>
          <p css={styledDescription}>{stripTags(body) || 'N/A'}</p>
        </div>
        <p css={styledTags}>
          {tags.map((tag, i) => (
            <span key={i}>#{tag}</span>
          ))}
        </p>
        <div css={styledActions}>
          <IconButton
            as="button"
            icon="system/delete-bin-line"
            shape="round"
            colorScheme="danger"
            size="sm"
            onClick={handlePostDelete}
          />
          <IconButton as="anchor" icon="document/article-fill" shape="round" size="sm" to={`/post-editor/${id}`} />
        </div>
      </Card.Content>
    </Card>
  );
};

export const PostCardSkeleton = () => {
  return (
    <Card>
      <Card.Media>
        <Skeleton shape="none" width="100%" height="62.5%" />
      </Card.Media>
      <Card.Content>
        <div css={styledTextBox}>
          <div css={styledInfo}>
            <span css={styledInfo.label}>
              <Skeleton width="48px" />
            </span>
            <span css={styledInfo.date}>
              <Skeleton width="min(80px, 100%)" />
            </span>
          </div>
          <div css={styledTitle}>
            <Skeleton width="100%" />
          </div>
          <div css={styledDescription}>
            <Skeleton width="80%" />
          </div>
        </div>
        <div css={styledTags}>
          <span>
            <Skeleton width="64px" />
          </span>
          <span>
            <Skeleton width="32px" />
          </span>
        </div>
      </Card.Content>
    </Card>
  );
};

// Styles
const styledTextBox = css`
  height: 137.2px; // 137.2px
  padding: 16px 0;
`;

const styledActions = css`
  position: absolute;
  inset: 12px 12px auto auto;
  display: flex;
  gap: 4px;
`;

const styledInfo = Object.assign(
  (theme: Theme) => css`
    display: flex;
    align-items: center;
    margin-bottom: 1lh;
    color: ${theme.text.third};
    font-size: 12px;
    font-weight: ${theme.weights.light};
  `,
  {
    label: css`
      flex-grow: 0;
      flex-basis: auto;

      padding-right: 1ex;
      margin-right: 1ex;
      border-right: 1px solid currentColor;
    `,

    date: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledTitle = (theme: Theme) => [
  ellipsis.multiline(),

  css`
    margin-bottom: 0.5lh;
    font-size: 16px;
    font-weight: ${theme.weights.bold};
    line-height: 1.4;
  `,
];

const styledDescription = (theme: Theme) => [
  ellipsis,

  css`
    color: ${theme.text.sub};
    font-size: 14px;
    line-height: 1.8;
  `,
];

const styledTags = (theme: Theme) => [
  ellipsis,

  css`
    display: flex;
    gap: 4px;
    height: 24px;
    color: ${theme.info.main};
    font-size: 12px;
  `,
];

export default PostCard;
