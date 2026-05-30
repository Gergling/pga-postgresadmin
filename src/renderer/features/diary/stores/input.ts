import { create } from "zustand";
import { persist } from "zustand/middleware";

const DIARY_INPUT_STORE_KEY = 'diary-input';

export const diaryInputStore = create<{
  text: string;
  setText: (text: string) => void;
}>()(persist((set) => ({
  text: '',
  setText: (text) => set({ text }),
}), {
  name: DIARY_INPUT_STORE_KEY,
}));
