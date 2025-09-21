export {}; // transforme le fichier en module

declare global {
  interface Window {
    electronAPI: {
      // --- UserFiles ---
      getUserFolder: () => Promise<string>;
      listUserFiles: () => Promise<string[]>;
      getPubsFolder: () => Promise<string>;
      listPubsFiles: () => Promise<string[]>;
      getMatchFolder: () => Promise<string>;
      listMatchFiles: () => Promise<string[]>;

      // --- Window ---
      setFullscreen: (windowName: 'control' | 'projection', fullscreen: boolean) => Promise<void>;
      moveWindowToDisplay: (windowName: 'control' | 'projection', displayIndex: number) => Promise<void>;
    };
  }
}
