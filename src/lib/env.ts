export const isTauri = (): boolean =>
    typeof window !== 'undefined' && !!(window as any).__TAURI__;
