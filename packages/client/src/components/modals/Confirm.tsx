import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Button from '~components/buttons/Button';
import { OverlayElementProps } from '~components/overlay/Overlay';
import Modal from './Modal';

interface Props extends OverlayElementProps {
  title: string;
  description: string;
  onConfirm(): void;
  onCancel?(): void;
}

function Confirm({ title, description, isOpen, close, onConfirm, onCancel }: Props) {
  const handleConfirm = useCallback(() => {
    onConfirm();
    close();
  }, [onConfirm, close]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    close();
  }, [onCancel, close]);

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
    >
      <div css={styledContainer}>
        <div css={styledContent}>
          <h2 css={styledTitle}>{title}</h2>
          <p css={styledDescription}>{description}</p>
        </div>
        <div css={styledFooter}>
          <Button
            as="button"
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            as="button"
            colorScheme="info"
            size="sm"
            fullWidth
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Styles
const styledContainer = css`
  width: 100%;
`;

const styledContent = css`
  padding: 32px 16px;
  text-align: center;
`;

const styledFooter = css`
  display: flex;
  gap: 8px;
  padding: 0 16px 16px 16px;
`;

const styledTitle = (theme: Theme) => css`
  margin-bottom: 0.5lh;
  font-size: 18px;
  font-weight: ${theme.weights.bold};
  line-height: 1.6;
`;

const styledDescription = (theme: Theme) => css`
  color: ${theme.text.sub};
  font-size: 14px;
  line-height: 1.8;
`;

export default Confirm;
