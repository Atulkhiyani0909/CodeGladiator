import { create } from 'zustand';

interface BattleState {
    problems: string[]; 
    setProblems: (problems: string[]) => void;
}

export const useBattleStore = create<BattleState>((set) => ({
    problems: [],
    setProblems: (problems) => set({ problems }),
}));