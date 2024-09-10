import { memo } from 'react';
import { Interpolation, Theme, css } from '@emotion/react';
import { EditorOptions } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import LinkActionsMenu from './LinkActionsMenu';

type Props = {
  format?: Interpolation<Theme>;
  slotBefore?: React.ReactNode;
  slotAfter?: React.ReactNode;
} & Partial<EditorOptions>;

function BaseEditor({ format, slotBefore, slotAfter, extensions = [], ...rest }: Props) {
  const editor = useEditor({
    ...rest,
    extensions: [Document, Text, Paragraph, ...extensions],
  });

  if (editor === null) return null;

  return (
    <EditorContext.Provider value={{ editor }}>
      <div css={styledContainer}>
        <Slot>{slotBefore}</Slot>
        <EditorContext.Consumer>
          {({ editor: currentEditor }) => (
            <EditorContent css={[styledEditorContent, format]} editor={currentEditor} spellCheck={false}>
              {editor && <LinkActionsMenu editor={editor} />}
            </EditorContent>
          )}
        </EditorContext.Consumer>
        <Slot>{slotAfter}</Slot>
      </div>
    </EditorContext.Provider>
  );
}

// Subcomponents
interface SlotProps {
  children?: React.ReactNode;
}

const Slot = ({ children }: SlotProps) => {
  if (children === undefined) return null;

  return <div css={styledSlot}>{children}</div>;
};

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const styledSlot = css`
  flex-grow: 0;
  flex-basis: auto;
`;

const styledEditorContent = (theme: Theme) => css`
  flex-grow: 1;
  flex-basis: 0;
  min-height: 0;

  .tiptap {
    width: 100%;
    height: 100%;
    outline: none;

    overflow-x: hidden;
    overflow-y: auto;
    cursor: text;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${theme.border.netural};
      background-clip: padding-box;
      border-left: 4px solid transparent;
    }

    .is-editor-empty::before {
      content: attr(data-placeholder);
      height: 0;
      opacity: 0.6;
      float: left;
      pointer-events: none;
    }
  }
`;

export default memo(BaseEditor);
