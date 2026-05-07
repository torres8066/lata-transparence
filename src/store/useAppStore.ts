import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClientReport } from '../types';

interface AppState {
  reports: ClientReport[];
  addReport: (report: ClientReport) => void;
  updateReport: (id: string, report: ClientReport) => void;
  getReport: (id: string) => ClientReport | undefined;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (report) =>
        set((state) => ({ reports: [report, ...state.reports] })),
      updateReport: (id, updatedReport) =>
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? updatedReport : r)),
        })),
      getReport: (id) => get().reports.find((r) => r.id === id),
    }),
    {
      name: 'lata-garage-storage',
    }
  )
);
