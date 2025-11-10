import { create } from "zustand";
import api from "../api";
import Decimal from "decimal.js";

interface SavingsCategoryDetail {
    categoryId: string;
    categoryName: string;
    amount: Decimal;
}

interface SavingsBalance {
    totalSavings: number;
    monthlyDeduction: number;
    normalSavings: Decimal;
    cooperativeSavings: Decimal;
    details: SavingsCategoryDetail[];
}

interface SavingsBalanceState {
    balance: SavingsBalance | null;
    loading: boolean;
    error: string | null;
    fetchSavingsBalance: () => Promise<void>;
    getCategoryTotal: (categoryName: string) => Decimal;
}

export const useSavingsBalanceStore = create<SavingsBalanceState>(
    (set, get) => ({
        balance: null,
        loading: false,
        error: null,

        fetchSavingsBalance: async () => {
            set({ loading: true, error: null });
            try {
                const response = await api.get("/api/savings/balances");
                set({
                    balance: response.data.data,
                    loading: false,
                });
            } catch (error: any) {
                set({
                    error: error.message || "Failed to fetch savings balance",
                    loading: false,
                });
            }
        },

        getCategoryTotal: (categoryName) => {
            const { balance } = get();
            if (!balance) return new Decimal(0);

            if (categoryName === "QUICK") return balance.normalSavings;
            if (categoryName === "COOPERATIVE")
                return balance.cooperativeSavings;

            const category = balance.details.find(
                (d) => d.categoryName === categoryName
            );
            return category ? category.amount : new Decimal(0);
        },
    })
);
