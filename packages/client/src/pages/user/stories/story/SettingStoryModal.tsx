import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import Divider from '~components/atom/Divider';
import Spacer from '~components/atom/Spacer';
import Button from '~components/buttons/Button';
import TextField from '~components/form/TextField';
import Modal from '~components/modals/Modal';
import { OverlayElementProps } from '~components/overlay/Overlay';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useUpdateStoryMutation } from '~hooks/queries/storyQueries';

interface Form {
  name: string;
  slug: string;
  description: string;
}

interface Props extends OverlayElementProps {
  id: string;
  name: string;
  slug: string;
  description: string;
}

function SettingStoryModal({ id, name, slug, description, isOpen, close }: Props) {
  const { formState, register, getValues } = useForm<Form>({
    mode: 'onBlur',
    defaultValues: { name, slug, description },
  });
  const { errors, isValid } = formState;

  const { mutateAsync, isPending } = useUpdateStoryMutation();

  const snackbar = useSnackbar();

  const handleUpdateStory = useCallback(() => {
    const mutation = async () => {
      const { name, slug, description } = getValues();

      await mutateAsync({ id, name, slug, description: description || null });
      close();
    };

    snackbar.promise(mutation(), {
      pending: '스토리를 수정하고 있어요.',
      success: '스토리가 정상적으로 수정됐어요.',
      error: '스토리를 발행하는 도중 오류가 발생했어요.',
    });
  }, [id, snackbar, close, getValues, mutateAsync]);

  return (
    <Modal size="sm" isOpen={isOpen}>
      <div css={styledContainer}>
        <div css={styledHeader}>
          <h2 css={styledFormLabel}>스토리 수정</h2>
        </div>
        <div css={styledContent}>
          <TextField
            {...register('name', {
              required: {
                value: true,
                message: '스토리 이름은 필수항목 입니다.',
              },
              maxLength: {
                value: 10,
                message: '스토리의 이름은 10글자를 넘길 수 없습니다.',
              },
            })}
            label="이름"
            placeholder="이름을 입력해 주세요."
            message={errors.name?.message || undefined}
            isRequired
            isError={!_.isNil(errors.name)}
          />
          <Spacer />
          <TextField
            {...register('description')}
            label="설명"
            placeholder="스토리 설명을 입력해 주세요."
            message={errors.description?.message || undefined}
            isError={!_.isNil(errors.description)}
          />
        </div>
        <Divider offset={2}>모든 항목을 작성하셨나요?</Divider>
        <div css={styledFooter}>
          <Button as="button" variant="outline" size="sm" fullWidth isDisabled={isPending} onClick={close}>
            취소
          </Button>
          <Button
            as="button"
            colorScheme="info"
            size="sm"
            fullWidth
            isLoading={isPending}
            isDisabled={!isValid}
            onClick={handleUpdateStory}
          >
            수정하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
`;

const styledHeader = css`
  flex-grow: 0;
  flex-basis: auto;
`;

const styledContent = css`
  flex-grow: 1;
  flex-basis: 0;
`;

const styledFooter = css`
  flex-grow: 0;
  flex-basis: auto;

  display: flex;
  gap: 8px;
`;

const styledFormLabel = (theme: Theme) => css`
  margin: 16px 0 32px 0;
  font-size: 18px;
  font-weight: ${theme.weights.bold};
`;

export default SettingStoryModal;
