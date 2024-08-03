import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Typography from '~components/atom/Typography';
import IconButton from '~components/buttons/IconButton';
import DropdownMenu from '~components/menu/DropdownMenu';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useDeleteStoryMutation } from '~hooks/queries/storyQueries';
import { useUserContext } from '~pages/user';
import useMyAccountStore from '~store/useMyAccountStore';
import { useStoryContext } from '.';
import SettingStoryModal from './SettingStoryModal';

function Cover() {
  const myAccount = useMyAccountStore(({ myAccount }) => myAccount);

  const user = useUserContext();
  const story = useStoryContext();

  const isMe = myAccount?.id === user.id;
  const hasDescription = story.description !== null;

  return (
    <div css={styledContainer}>
      <div css={styledContainer.left}>
        <Typography variant="h2" weight="extrabold">
          {story.name}
        </Typography>
        {hasDescription && (
          <Typography variant="body1" color="sub">
            {story.description}
          </Typography>
        )}
      </div>
      {isMe && (
        <div css={styledContainer.right}>
          <StoryMenu />
        </div>
      )}
    </div>
  );
}

// Subcomponents
const StoryMenu = () => {
  const user = useUserContext();
  const story = useStoryContext();

  const overlay = useOverlay();
  const snackbar = useSnackbar();

  const navigate = useNavigate();

  const { mutateAsync } = useDeleteStoryMutation();

  const openSettingStoryModal = useCallback(() => {
    overlay.open((props) => (
      <SettingStoryModal
        {...props}
        id={story.id}
        name={story.name}
        slug={story.slug}
        description={story.description || ''}
      />
    ));
  }, [story, overlay]);

  const deleteStory = useCallback(async () => {
    const mutation = async () => {
      await mutateAsync(story.id);
      navigate(`/@${user.id}/stories`, { replace: true });
    };

    const handleConfirm = () => {
      snackbar.promise(mutation(), {
        pending: '게시글을 삭제하고 있어요.',
        success: '게시글이 정상적으로 삭제 됐어요.',
        error: '게시글을 삭제하는 도중 오류가 발생했어요.',
      });
    };

    overlay.open((props) => (
      <Confirm
        {...props}
        title="스토리를 정말 삭제하시겠어요?"
        description="스토리를 삭제해도 게시글은 사라지지 않아요."
        onConfirm={handleConfirm}
      />
    ));
  }, [user, story, overlay, snackbar, navigate, mutateAsync]);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <IconButton as="button" icon="system/more" shape="round" variant="text" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" alignOffset={-8}>
        <DropdownMenu.Item as="button" onClick={openSettingStoryModal}>
          수정하기
        </DropdownMenu.Item>
        <DropdownMenu.Item as="button" onClick={deleteStory}>
          삭제하기
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

// Styles
const styledContainer = Object.assign(
  (theme: Theme) => css`
    display: flex;
    align-items: end;
    padding: 64px 0;
    margin-bottom: 64px;
    border-bottom: 1px solid ${theme.border};
  `,
  {
    left: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,

    right: css`
      flex-grow: 0;
      flex-basis: auto;
    `,
  },
);

export default Cover;
