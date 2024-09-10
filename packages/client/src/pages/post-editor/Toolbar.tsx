import { Theme, css } from '@emotion/react';
import { useCurrentEditor } from '@tiptap/react';
import Divider from '~components/atom/Divider';
import Icon, { IconType } from '~components/atom/Icon';
import { UnstyledButton, styledButtonBase } from '~components/buttons/Button';
import Scroll from '~components/layout/Scroll';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { usePostEditorContext } from './PostEditor';
import useUploadImageForPost from './hooks/useUploadImageForPost';
import useFileSelector from '../../hooks/useFileSelector';

function Toolbar() {
  const context = usePostEditorContext();

  const selectFile = useFileSelector();
  const { mutateAsync: uploadImageForPost } = useUploadImageForPost(context);

  const snackbar = useSnackbar();
  const { editor } = useCurrentEditor();

  if (editor === null) return null;

  return (
    <div css={styledContainer}>
      <div css={styledToolbar}>
        <Scroll overflowX="auto" padding="8px" hasScrollBar={false}>
          <div css={styledFormatGroup}>
            <Format
              icon="editor/h2"
              isActive={editor.isActive('heading', { level: 2 })}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              }}
            />
            <Format
              icon="editor/h3"
              isActive={editor.isActive('heading', { level: 3 })}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }}
            />
            <Format
              icon="editor/h4"
              isActive={editor.isActive('heading', { level: 4 })}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 4 }).run();
              }}
            />
            <Divider orientation="vertical" size="16px" />
            <Format
              icon="editor/align-justify"
              isActive={editor.isActive({ textAlign: 'justify' })}
              onClick={() => {
                editor.chain().focus().setTextAlign('justify').run();
              }}
            />
            <Format
              icon="editor/align-left"
              isActive={editor.isActive({ textAlign: 'left' })}
              onClick={() => {
                editor.chain().focus().setTextAlign('left').run();
              }}
            />
            <Format
              icon="editor/align-center"
              isActive={editor.isActive({ textAlign: 'center' })}
              onClick={() => {
                editor.chain().focus().setTextAlign('center').run();
              }}
            />
            <Format
              icon="editor/align-right"
              isActive={editor.isActive({ textAlign: 'right' })}
              onClick={() => {
                editor.chain().focus().setTextAlign('right').run();
              }}
            />
            <Divider orientation="vertical" size="16px" />
            <Format
              icon="development/code-box-line"
              isActive={editor.isActive('code')}
              isDisabled={!editor.isActive('paragraph')}
              onClick={() => {
                editor.chain().focus().toggleCode().run();
              }}
            />
            <Format
              icon="editor/code-block"
              isActive={editor.isActive('code-block')}
              onClick={() => {
                editor.chain().focus().toggleCodeBlock().run();
              }}
            />
            <Divider orientation="vertical" size="16px" />
            <Format
              icon="editor/bold"
              isActive={editor.isActive('bold')}
              onClick={() => {
                editor.chain().focus().toggleBold().run();
              }}
            />
            <Format
              icon="editor/italic"
              isActive={editor.isActive('italic')}
              onClick={() => {
                editor.chain().focus().toggleItalic().run();
              }}
            />
            <Format
              icon="editor/strike"
              isActive={editor.isActive('strike')}
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
              }}
            />
            <Format
              icon="editor/highlighter"
              isActive={editor.isActive('highlight')}
              onClick={() => {
                editor.chain().focus().toggleHighlight().run();
              }}
            />
            <Divider orientation="vertical" size="16px" />
            {editor.isActive('link') ? (
              <Format
                icon="editor/link-unlink"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                }}
              />
            ) : (
              <Format
                icon="editor/link"
                isDisabled={(() => {
                  const { from, to } = editor.state.selection;
                  return from === to;
                })()}
                onClick={() => {
                  editor.chain().focus().setLink({ href: '' }).run();
                }}
              />
            )}
            <Format
              icon="document/file-image-line"
              onClick={async () => {
                const maxFileSize = 1024 * 1024;
                const accept = ['image/gif', 'image/jpeg', 'image/png'];
                const file = await selectFile({ accept, maxFileSize });

                const mutation = async () => {
                  const result = await uploadImageForPost(file);

                  editor.chain().focus().setImage({ src: result }).run();
                };

                snackbar.promise(mutation(), {
                  pending: '이미지를 업로드하고 있어요.',
                  success: '이미지를 정상적으로 업로드 했어요.',
                  error: '이미지를 업로드하는 도중 오류가 발생했어요.',
                });
              }}
            />
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// Subcomponents
interface FormatProps {
  icon: IconType;
  isActive?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Format = ({ icon, isActive = false, isLoading = false, isDisabled = false, onClick }: FormatProps) => {
  return (
    <UnstyledButton
      as="button"
      css={styledFormat({
        isActive,
        isDisabled: isLoading || isDisabled,
      })}
      isDisabled={isLoading || isDisabled}
      onClick={onClick}
    >
      {isLoading ? <Icon icon="system/loader" /> : <Icon icon={icon} />}
    </UnstyledButton>
  );
};

// Styles
const styledContainer = css`
  margin-bottom: 32px;
`;

const styledToolbar = (theme: Theme) => css`
  color: ${theme.text.main};
  border-bottom: 1px solid ${theme.border.netural};
`;

const styledFormatGroup = css`
  display: inline-flex;
  gap: 4px;
`;

const styledFormat =
  ({ isActive, isDisabled }: { isActive: boolean; isDisabled: boolean }) =>
  (theme: Theme) => [
    styledButtonBase({
      isDisabled,
      variant: isActive ? 'solid' : 'text',
      colorScheme: 'netural',
    }),

    css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: ${theme.radii.xs};
      font-size: 18px;
    `,
  ];

export default Toolbar;
