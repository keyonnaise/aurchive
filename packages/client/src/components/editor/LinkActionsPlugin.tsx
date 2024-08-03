import { BubbleMenuView, BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import contains from '~lib/contains';

export interface LinkActionsPluginProps extends BubbleMenuPluginProps {}

type LinkActionsViewProps = LinkActionsPluginProps & {
  view: EditorView;
};

class LinkActionsView extends BubbleMenuView {
  public shouldShow: Exclude<BubbleMenuPluginProps['shouldShow'], null> = ({ view, state, from, to }) => {
    const { selection } = state;
    const { $from } = selection;

    const isCursorSelection = from === to;
    const hasLinkMark = $from.marks().some((mark) => mark.type.name === 'link');

    // 링크 작업 메뉴 내부의 요소를 클릭하면 에디터 "blur" 이벤트가 발생하고 링크 작업 메뉴 항목에 포커스가 이동합니다.
    // 이 경우 메뉴를 에디터의 일부분으로 간주하고 계속 표시해야 합니다.
    const isChildOfMenu = this.element.contains(document.activeElement);
    const hasEditorFocus = view.hasFocus() || isChildOfMenu;

    if (contains([this.editor.isEditable, hasEditorFocus, isCursorSelection, hasLinkMark], false)) {
      return false;
    }

    return true;
  };

  constructor(props: LinkActionsViewProps) {
    super(props);
  }
}

export const LinkActionPlugin = (props: LinkActionsPluginProps) => {
  return new Plugin({
    key: typeof props.pluginKey === 'string' ? new PluginKey(props.pluginKey) : props.pluginKey,

    view(view) {
      return new LinkActionsView({ view, ...props });
    },
  });
};
