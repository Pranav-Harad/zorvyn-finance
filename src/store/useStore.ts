import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions, type Transaction } from "../data/mockData";

export type Role = "viewer" | "admin";

interface StoreState {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: "viewer",
      setRole: (role) => set({ role }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
             ...state.transactions,
             { ...transaction, id: Math.random().toString(36).substr(2, 9) }
          ],
        })),
      editTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "finance-dashboard-storage",
    }
  )
);
