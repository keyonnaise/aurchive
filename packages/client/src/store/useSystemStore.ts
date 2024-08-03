import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface Config {
  themeMode: ThemeMode;
}

interface Store {
  config: Config;
  setConfig(config: ((prev: Config) => Config) | Config): void;
}

const useSystemStore = create<Store>((set) => ({
  config: {
    themeMode: 'light',
  },

  setConfig(config) {
    set((prev) => {
      const newVal = typeof config === 'function' ? config(prev.config) : config;

      localStorage.setItem('config', JSON.stringify(newVal));

      return { ...prev, config: newVal };
    });
  },
}));

export default useSystemStore;

// import { create } from 'zustand';

// type ThemeMode = 'dark' | 'light';

// interface Store {
//   themeMode: ThemeMode;
//   setThemeMode(mode: ((prev: ThemeMode) => ThemeMode) | ThemeMode): void;
// }

// const useSystemStore = create<Store>((set) => ({
//   themeMode: 'light',

//   setThemeMode(mode) {
//     set((prev) => ({ ...prev, themeMode: typeof mode === 'function' ? mode(prev.themeMode) : mode }));
//   },
// }));

// export default useSystemStore;
