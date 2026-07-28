import { create } from "zustand";

export type PropertyType =
  | "apartment"
  | "house"
  | "self contained"
  | "semi-self contained"
  | "single room"
  | "land"
  | "item"
  | "others"
  | null;

interface FilterState {
  search: string;
  type: PropertyType;
  description: string | null;
  address: string | null;
  city: string | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType) => void;
  setDescription: (value: string | null) => void;
  setAddress: (value: string | null) => void;
  setCity: (value: string | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  type: null,
  description: null,
  address: null,
  city: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (value) => set({ search: value }),
  setType: (value) => set({ type: value }),
  setDescription: (value) => set({ description: value }),
  setAddress: (value) => set({ address: value }),
  setCity: (value) => set({ city: value }),
  setMinPrice: (value) => set({ minPrice: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      description: null,
      address: null,
      city: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
