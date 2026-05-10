import { create } from "zustand";

interface ContactsState {
  search: string;
  selectedIds: string[];
  setSearch: (value: string) => void;
  toggleSelected: (id: string) => void;
  resetSelected: () => void;
  setSelectedIds: (ids: string[]) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  search: "",
  selectedIds: [],
  setSearch: (search) => set({ search }),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((value) => value !== id)
        : [...state.selectedIds, id],
    })),
  resetSelected: () => set({ selectedIds: [] }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
}));
