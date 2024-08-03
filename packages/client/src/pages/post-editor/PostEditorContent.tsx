import { useCallback } from 'react';
import { css } from '@emotion/react';
import { EditorEvents, Extensions } from '@tiptap/core';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { History } from '@tiptap/extension-history';
import { Image } from '@tiptap/extension-image';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { TextAlign } from '@tiptap/extension-text-align';
import BaseEditor from '~components/editor/BaseEditor';
import lowlight from '~lib/lowlight';
import { styledPostFormat } from '~styles/formats';
import { breakpoints } from '~styles/media';
import { usePostEditorContext } from './PostEditor';
import Toolbar from './Toolbar';

const EXTENSIONS: Extensions = [
  // Editor
  History,
  Placeholder.configure({ placeholder: '멋진 콘텐츠가 준비되었나요? 이곳에 작성해보세요!' }),
  HardBreak,

  // Formatting
  Heading.configure({ levels: [2, 3, 4] }),
  Code,
  CodeBlockLowlight.configure({ lowlight }),
  Bold,
  Highlight,
  Italic,
  Strike,
  Link.configure({ openOnClick: false }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),

  // Images
  Image.configure({ inline: true }),
];

function PostEditorContent() {
  const { id, fields, setField, collapseCover } = usePostEditorContext();

  const handleUpdate = useCallback(
    ({ editor }: EditorEvents['update']) => setField('body', editor.getHTML()),
    [setField],
  );

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <BaseEditor
          key={id}
          extensions={EXTENSIONS}
          format={styledPostFormat}
          slotBefore={<Toolbar />}
          content={fields.body}
          onFocus={collapseCover}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

// Styles
const styledContainer = css`
  flex-grow: 1;
  flex-basis: 0;
  min-height: 0;
`;

const styledContent = css`
  width: min(${breakpoints.lg}px, calc(100% - 24px));
  height: 100%;
  margin: 0 auto;
`;

export default PostEditorContent;
