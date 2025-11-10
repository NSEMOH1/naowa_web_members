import { useEffect } from "react";
import { useTransactionStore } from "../store/transaction";

export const useTransactions = (autoFetch = true) => {
    const { transactions, loading, error, fetchTransactions } =
        useTransactionStore();

    useEffect(() => {
        if (autoFetch) {
            fetchTransactions();
        }
    }, [autoFetch, fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        refetch: fetchTransactions,
    };
};
