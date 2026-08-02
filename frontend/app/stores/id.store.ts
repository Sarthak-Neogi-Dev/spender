import { create } from 'zustand';

export interface IuseId {
    id: string;
    setId: (id: string) => void
}

const useId = create((set) => ({
    id: "",
    setId: (id: string) => set({ id: id })
}));

export default useId;