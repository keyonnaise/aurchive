import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Spacer from '~components/atom/Spacer';
import Button from '~components/buttons/Button';
import Avatar from '~components/data-display/Avatar';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useUploadImageToCloudStorage } from '~hooks/queries/fileQueries';
import useFileSelector from '~hooks/useFileSelector';
import { useProfileEditorContext } from './ProfileEditor';
import ProfileEditorRow from './ProfileEditorRow';

function SettingProfilePhoto() {
  return (
    <ProfileEditorRow label="프로필 사진">
      <Photo />
    </ProfileEditorRow>
  );
}

// Subcomponents
const Photo = () => {
  const { id, fields, setField } = useProfileEditorContext();
  const { displayName, photoUrl } = fields;

  const snackbar = useSnackbar();
  const selectFile = useFileSelector();

  const { mutateAsync: uploadPhoto, isPending } = useUploadImageToCloudStorage();

  const handleUploadPhoto = useCallback(async () => {
    const maxFileSize = 1024 * 1024;
    const accept = ['image/gif', 'image/jpeg', 'image/png'];
    const file = await selectFile({ accept, maxFileSize });

    const formData = new FormData();
    formData.append('image', file, file.name);

    const mutation = async () => {
      const result = await uploadPhoto({
        formData,
        usedIn: 'profile',
        directoryName: id,
      });

      setField('photoUrl', result);
    };

    snackbar.promise(mutation(), {
      pending: '프로필 사진을 업로드 하고 있어요.',
      success: '프로필 사진이 변경됐어요.',
      error: '프로필 사진을 업로드 하는 도중 오류가 발생했어요',
    });
  }, [id, snackbar, setField, selectFile, uploadPhoto]);

  const handleDeletePhoto = useCallback(() => setField('photoUrl', ''), [setField]);

  return (
    <div css={styledPhoto}>
      <Avatar size="4xl" radius="sm" photoUrl={photoUrl} name={displayName} />
      {!isPending && (
        <div css={styledOverlay}>
          <div css={styledButtonGroup}>
            {photoUrl !== '' && (
              <>
                <Button as="button" colorScheme="danger" size="sm" onClick={handleDeletePhoto}>
                  삭제하기
                </Button>
                <Spacer y={0.5} />
              </>
            )}
            <Button as="button" colorScheme="light" size="sm" onClick={handleUploadPhoto}>
              등록하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styledPhoto = css`
  position: relative;
  display: inline-block;
`;

const styledOverlay = (theme: Theme) => css`
  position: absolute;
  inset: 0;
  display: flex;
  color: ${theme.light.main};
  background: ${theme.dim.basic};
  backdrop-filter: blur(4px);
  border-radius: ${theme.radii.sm};

  @media (hover: hover) {
    opacity: 0;
    transition: opacity ease 200ms;

    &:hover {
      opacity: 1;
    }
  }
`;

const styledButtonGroup = css`
  margin: auto;
`;

export default SettingProfilePhoto;
