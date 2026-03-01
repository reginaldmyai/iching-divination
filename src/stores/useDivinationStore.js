'use client';
import { create } from 'zustand';

export const useDivinationStore = create((set, get) => ({
    question: '',
    yaoValues: [],
    currentYao: 0,
    hexagram: null,
    changedHexagram: null,
    changingLines: [],
    isAnimating: false,
    phase: 'input', // 'input' | 'casting' | 'result'

    setQuestion: (q) => set({ question: q }),

    startDivination: () => set({
        yaoValues: [],
        currentYao: 0,
        hexagram: null,
        changedHexagram: null,
        changingLines: [],
        isAnimating: true,
        phase: 'casting',
    }),

    addYao: (value) => {
        const { yaoValues } = get();
        const newValues = [...yaoValues, value];
        set({
            yaoValues: newValues,
            currentYao: newValues.length,
        });
    },

    setResult: ({ hexagram, changedHexagram, changingLines }) => set({
        hexagram,
        changedHexagram,
        changingLines,
        isAnimating: false,
        phase: 'result',
    }),

    reset: () => set({
        question: '',
        yaoValues: [],
        currentYao: 0,
        hexagram: null,
        changedHexagram: null,
        changingLines: [],
        isAnimating: false,
        phase: 'input',
    }),
}));
