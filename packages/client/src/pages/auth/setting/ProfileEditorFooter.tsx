import { useCallback } from 'react';
import { css } from '@emotion/react';
import Button from '~components/buttons/Button';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useUpdateProfileMutation } from '~hooks/queries/authQueries';
import usePreservedCallback from '~hooks/usePreservedCallback';
import { Fields, useProfileEditorContext } from './ProfileEditor';

interface Props {
  onProfileUpdated(fields: Fields): void;
}

function ProfileEditorFooter({ onProfileUpdated: _onProfileUpdated }: Props) {
  const { fields } = useProfileEditorContext();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

  const snackbar = useSnackbar();

  const onProfileUpdated = usePreservedCallback(_onProfileUpdated);

  const handleSaveProfile = useCallback(async () => {
    if (fields.displayName === '') {
      snackbar({
        icon: 'system/error-warning-line',
        title: '아직 작성하지 않은 항목이 있어요!',
        description: '프로필 이름은 필수로 작성해야 돼요.',
      });

      return;
    }

    const mutation = async () => {
      await updateProfile({
        displayName: fields.displayName,
        photoUrl: fields.photoUrl || null,
        bio: fields.bio || null,
        about: fields.about || null,
        githubUrl: fields.githubUrl || null,
        linkedinUrl: fields.linkedinUrl || null,
        instagramUrl: fields.instagramUrl || null,
        twitterUrl: fields.twitterUrl || null,
      });

      onProfileUpdated(fields);
    };

    snackbar.promise(mutation(), {
      pending: '프로필을 변경하고 있어요.',
      success: '프로필이 정상적으로 변경됐어요.',
      error: '프로필을 변경하는 도중 오류가 발생했어요.',
    });
  }, [fields, snackbar, updateProfile, onProfileUpdated]);

  return (
    <div css={styledContainer}>
      <Button
        as="button"
        shape="round"
        colorScheme="info"
        leftIcon="device/save-line"
        inline
        isLoading={isPending}
        isDisabled={fields.displayName === ''}
        onClick={handleSaveProfile}
      >
        프로필 저장
      </Button>
    </div>
  );
}

// Styles
const styledContainer = css`
  text-align: right;
`;

export default ProfileEditorFooter;
