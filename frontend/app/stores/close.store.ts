import { create } from 'zustand';

export interface Iclose {
    close: string[];
    setClose: (close: string[]) => void
}

const useClose = create((set) => ({
    close: [],
    setClose: (close: string[]) => set({ close: close })
}));

export default useClose;