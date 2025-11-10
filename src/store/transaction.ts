import { create } from "zustand"
import api from "../api";

export type TransactionType =
    | "LOAN_DISBURSEMENT"
    | "LOAN_REPAYMENT"
    | "SAVINGS_DEPOSIT"
    | "FEE"
    | "SAVINGS_WITHDRAWAL"
    | "ADJUSTMENT"
    | "LOAN_APPROVED"
    | "LOAN_REJECTED";
export type Transaction = {
    transactionId: string;
    memberId: string;
    type: TransactionType;
    reference: string;
    amount: number;
    createdAt: Date | string;
    description?: string;
    status?: "PENDING" | "COMPLETED" | "FAILED";
};

interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    fetchTransactions: (filters?: {
        startDate?: Date | string;
        endDate?: Date | string;
        type?: TransactionType;
    }) => Promise<void>;
    getTransactionsByType: (type: TransactionType) => Transaction[];
    getTransactionsByDateRange: (
        startDate: Date,
        endDate: Date
    ) => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();

            if (filters.startDate)
                params.append(
                    "startDate",
                    new Date(filters.startDate).toISOString()
                );
            if (filters.endDate)
                params.append(
                    "endDate",
                    new Date(filters.endDate).toISOString()
                );
            if (filters.type) params.append("type", filters.type);

            const response = await api.get(
                `/api/transactions?${params.toString()}`
            );
            set({
                transactions: response.data.data,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch transactions",
                loading: false,
            });
        }
    },

    getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
    },

    getTransactionsByDateRange: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return get().transactions.filter((t) => {
            const date = new Date(t.createdAt);
            return date >= start && date <= end;
        });
    },
}));
