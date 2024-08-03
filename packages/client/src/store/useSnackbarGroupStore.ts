import { create } from 'zustand';
import { IconType } from '~components/atom/Icon';

export interface SnackbarData {
  severity?: 'info' | 'danger' | 'success' | 'warning';
  icon?: IconType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick(): void;
  };
  duration?: number;
}

interface Store {
  group: Map<string, SnackbarData>;
  enqueue(id: string, data: SnackbarData): void;
  update(id: string, data: SnackbarData): void;
  remove(id: string): void;
}

const useSnackbarGroupStore = create<Store>((set, get) => ({
  group: new Map(),

  enqueue(id, data) {
    const { group } = get();
    const cloned = new Map(group);

    cloned.set(id, data);

    set((prev) => ({ ...prev, group: cloned }));
  },

  update(id, data) {
    const { group } = get();
    const cloned = new Map(group);

    if (!cloned.has(id)) {
      console.warn(`Snackbar #${id}를 찾을 수 없어 수정에 실패했습니다. ID를 다시 확인해 주세요.`);

      return;
    }

    cloned.set(id, data);

    set((prev) => ({ ...prev, group: cloned }));
  },

  remove(id) {
    const { group } = get();
    const cloned = new Map(group);

    cloned.delete(id);

    set((prev) => ({ ...prev, group: cloned }));
  },
}));

export default useSnackbarGroupStore;
