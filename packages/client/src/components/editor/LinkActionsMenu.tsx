import { useEffect, useState } from 'react';
import { Theme, css } from '@emotion/react';
import Input from '~components/atom/Input';
import { UnstyledButton, styledButtonBase } from '~components/buttons/Button';
import { LinkActionPlugin, LinkActionsPluginProps } from './LinkActionsPlugin';

const HREF_PATTERN = /^(http|https):\/\/([a-z0-9-]+\.)+[a-z]{2,6}(\/[a-z0-9\-./?&%]*)?$/i;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type LinkActionProps = Omit<Optional<LinkActionsPluginProps, 'pluginKey'>, 'element'> & {
  updateDelay?: number;
};

function LinkActionsMenu({
  editor,
  pluginKey = 'linkActions',
  tippyOptions = { placement: 'bottom' },
  updateDelay,
  shouldShow = null,
}: LinkActionProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [href, setHref] = useState<string>('');

  const isValid = HREF_PATTERN.test(href);

  useEffect(() => {
    if (editor.isDestroyed) return;
    if (element === null) return;

    const plugin = LinkActionPlugin({ pluginKey, editor, element, updateDelay, tippyOptions, shouldShow });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, element]);

  useEffect(() => {
    const { $from } = editor.state.selection;
    const link = $from.marks().find((mark) => mark.type.name === 'link');

    setHref(link !== undefined ? link.attrs.href : '');

    return () => {
      setHref('');
    };
  }, [editor.state.selection]);

  return (
    <div ref={setElement} css={styledContainer}>
      <div css={styledLabel}>링크</div>
      <Input
        css={styledInput}
        placeholder="https://example.com"
        value={href}
        onChange={(e) => setHref(e.target.value)}
      />
      <UnstyledButton
        as="button"
        css={styledDeleteButton}
        onClick={() => {
          editor.chain().focus().unsetLink().run();
        }}
      >
        삭제
      </UnstyledButton>
      <UnstyledButton
        as="button"
        css={styledConfirmButton({ isDisabled: !isValid })}
        isDisabled={!isValid}
        onClick={() => {
          editor.chain().extendMarkRange('link').updateAttributes('link', { href }).run();
        }}
      >
        확인
      </UnstyledButton>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  color: ${theme.text.main};
  background-color: ${theme.background.elevated};
  border: 1px solid ${theme.border};
  border-radius: ${theme.radii.full};
  box-shadow: ${theme.shadows.md};
`;

const styledLabel = (theme: Theme) => css`
  font-size: 12px;
  font-weight: ${theme.weights.extrabold};
`;

const styledInput = (theme: Theme) => css`
  width: 160px;
  height: 24px;
  padding: 0 4px;
  margin: 0 4px;
  border: 1px solid ${theme.border};
  border-radius: ${theme.radii.xs};
  font-size: 12px;
`;

const styledDeleteButton = (theme: Theme) => [
  styledButtonBase({ variant: 'outline' }),

  css`
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: ${theme.radii.xs};
    font-size: 12px;
  `,
];

const styledConfirmButton =
  ({ isDisabled }: { isDisabled: boolean }) =>
  (theme: Theme) => [
    styledButtonBase({ isDisabled }),

    css`
      display: flex;
      align-items: center;
      height: 24px;
      padding: 0 8px;
      border-radius: ${theme.radii.xs};
      font-size: 12px;
    `,
  ];

export default LinkActionsMenu;
