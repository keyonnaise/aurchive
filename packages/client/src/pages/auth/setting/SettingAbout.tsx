import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { Bold } from '@tiptap/extension-bold';
import { CharacterCount } from '@tiptap/extension-character-count';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { History } from '@tiptap/extension-history';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { TextAlign } from '@tiptap/extension-text-align';
import { EditorEvents, useCurrentEditor } from '@tiptap/react';
import Divider from '~components/atom/Divider';
import Icon, { IconType } from '~components/atom/Icon';
import { UnstyledButton, styledButtonBase } from '~components/buttons/Button';
import BaseEditor from '~components/editor/BaseEditor';
import Scroll from '~components/layout/Scroll';
import useSystemStore from '~store/useSystemStore';
import { styledBioFormat } from '~styles/formats';
import { useProfileEditorContext } from './ProfileEditor';
import ProfileEditorRow from './ProfileEditorRow';

function SettingAbout() {
  return (
    <ProfileEditorRow label="자기소개">
      <Editor />
    </ProfileEditorRow>
  );
}

// Subcomponents
const LIMIT_LENGTH = 200;

const Editor = () => {
  const { fields, setField } = useProfileEditorContext();

  const handleUpdate = useCallback(
    ({ editor }: EditorEvents['update']) => setField('about', editor.getHTML()),
    [setField],
  );

  return (
    <div css={styledEditor}>
      <BaseEditor
        extensions={[
          // Editor
          History,
          Placeholder.configure({ placeholder: '소개 글을 작성해보세요.' }),
          HardBreak,

          // Formatting
          Heading.configure({ levels: [2, 3, 4] }),
          Bold,
          Highlight,
          Italic,
          Strike,
          Link.configure({ openOnClick: false }),
          TextAlign.configure({ types: ['heading', 'paragraph'] }),

          // Functionality
          CharacterCount.configure({ limit: LIMIT_LENGTH }),
        ]}
        format={styledBioFormat}
        slotBefore={<Toolbar />}
        slotAfter={<CharacterCounter />}
        content={fields.about}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  const Separator = () => <Divider orientation="vertical" size="16px" />;

  if (editor === null) return null;

  return (
    <div css={styledToolbar}>
      <Scroll overflowX="auto" padding="4px" hasScrollBar={false}>
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
          <Separator />
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
          <Separator />
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
          <Separator />
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
        </div>
      </Scroll>
    </div>
  );
};

const CharacterCounter = () => {
  const { editor } = useCurrentEditor();

  if (editor === null) return null;

  const characters = editor.storage.characterCount.characters();

  return (
    <div css={styledCharacterCounter}>
      <p css={styledCount}>
        {characters} / {LIMIT_LENGTH}
      </p>
    </div>
  );
};

interface FormatProps {
  icon: IconType;
  isActive?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Format = ({
  icon,
  isActive = false,
  isLoading = false,
  isDisabled: _isDisabled = false,
  onClick,
}: FormatProps) => {
  const { config } = useSystemStore();
  const { themeMode } = config;

  const isDisabled = isLoading || _isDisabled;

  return (
    <UnstyledButton
      as="button"
      css={styledFormat({ themeMode, isActive, isDisabled })}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {isLoading ? <Icon icon="system/loader" /> : <Icon icon={icon} />}
    </UnstyledButton>
  );
};

// Styles
const styledEditor = (theme: Theme) => css`
  height: 256px;
  border: 1px solid currentColor;
  border-radius: ${theme.radii.xs};

  .tiptap {
    padding: 0px 8px;
  }
`;

const styledToolbar = (theme: Theme) => css`
  margin-bottom: 16px;
  color: ${theme.netural.contrast};
  background-color: ${theme.netural.main};
`;

const styledCharacterCounter = (theme: Theme) => css`
  padding: 8px;
  margin-top: 16px;
  color: ${theme.netural.contrast};
  background-color: ${theme.netural.main};
`;

const styledFormatGroup = css`
  display: inline-flex;
  gap: 4px;
`;

const styledFormat =
  ({ themeMode, isActive, isDisabled }: { themeMode: 'dark' | 'light'; isActive: boolean; isDisabled: boolean }) =>
  (theme: Theme) => [
    styledButtonBase({
      isDisabled,
      colorScheme: themeMode,
      variant: isActive ? 'solid' : 'text',
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

const styledCount = css`
  font-size: 10px;
  text-align: right;
  line-height: 1.6;
`;

export default SettingAbout;
