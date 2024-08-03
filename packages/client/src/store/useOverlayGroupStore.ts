import { create } from 'zustand';

interface Store {
  group: Map<string, React.ReactNode>;
  mount(id: string, element: React.ReactNode): void;
  unmount(id: string): void;
}

const useOverlayGroupStore = create<Store>((set, get) => ({
  group: new Map(),

  mount(id, element) {
    const { group } = get();
    const cloned = new Map(group);

    cloned.set(id, element);

    set((prev) => ({ ...prev, group: cloned }));
  },

  unmount(id) {
    const { group } = get();
    const cloned = new Map(group);

    cloned.delete(id);

    set((prev) => ({ ...prev, group: cloned }));
  },
}));

export default useOverlayGroupStore;
