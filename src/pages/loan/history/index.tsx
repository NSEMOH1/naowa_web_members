import React, { useEffect, useState } from 'react';
import DataTable from '../../../components/table';
import type { TableColumn, LoanTransaction } from '../../../lib/types';
import { Spinner, Tag, useToast } from '@chakra-ui/react';
import { PageHeader } from '../../../components/pageHeader';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../api';

const loanColumns: TableColumn<LoanTransaction>[] = [
    {
        title: '',
        dataIndex: 'key',
        key: 'selection',
        width: 50,
    },
    {
        title: 'Transaction Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        render: (date: string) => <span className="font-semibold">{new Date(date).toLocaleDateString()}</span>,
    },
    {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference',
        render: (reference: string) => <span className="font-semibold">{reference}</span>,
    },
    {
        title: 'Amount (₦)',
        dataIndex: 'amount',
        key: 'amount',
        sorter: (a, b) => a.amount - b.amount,
        render: (amount: number) => <span className="font-semibold">{amount.toLocaleString()}</span>,
    },
    {
        title: 'Channel',
        dataIndex: 'channel',
        key: 'channel',
        filters: [
            { text: 'Bank Transfer', value: 'Bank Transfer' },
            { text: 'Mobile Money', value: 'Mobile Money' },
            { text: 'Card Payment', value: 'Card Payment' },
            { text: 'Cash', value: 'Cash' },
        ],
        onFilter: (value, record) => record.channel === value,
        render: (channel: string) => <span className="font-semibold">{channel}</span>,
    },
    {
        title: 'Transaction ID',
        dataIndex: 'transactionId',
        key: 'transactionId',
        render: (transactionId: string) => <span className="font-semibold">{transactionId}</span>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: LoanTransaction['status']) => (
            <Tag fontWeight='semibold' colorScheme={status === 'completed' ? 'green' : status === 'pending' ? 'yellow' : 'red'}>
                {status.toUpperCase()}
            </Tag>
        ),
    },
];

const LoanHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<LoanTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        const fetchLoanHistory = async () => {
            try {
                setLoading(true);
                if (!user?.id) return;

                const loanHistoryResponse = await api.get(`/api/loan/history`);
                const loanBalances = loanHistoryResponse.data?.balances || [];
                console.log('Loan balances:', loanBalances);

                const formattedTransactions: LoanTransaction[] = [];

                loanBalances.forEach((loan: any) => {
                    if (loan.status === 'ACTIVE' || loan.status === 'COMPLETED' || loan.status === 'APPROVED') {
                        formattedTransactions.push({
                            key: `${loan.id}-disbursement`,
                            date: loan.approvalDate || loan.applicationDate,
                            reference: loan.reference,
                            type: 'Credit' as const,
                            amount: loan.approvedAmount || loan.appliedAmount,
                            channel: 'Bank Transfer',
                            transactionId: `${loan.id}-DISBURSEMENT`,
                            status: 'completed' as const,
                            loanId: loan.id
                        });
                    }
                    if (loan.transactions && loan.transactions.length > 0) {
                        loan.transactions.forEach((tx: any, index: number) => {
                            formattedTransactions.push({
                                key: tx.id || `${loan.id}-tx-${index}`,
                                date: tx.date || tx.createdAt,
                                reference: loan.reference,
                                type: tx.type?.includes('REPAYMENT') || tx.type?.includes('PAYMENT') ? 'Credit' : 'Debit',
                                amount: Math.abs(tx.amount),
                                channel: tx.channel || 'Bank Transfer',
                                transactionId: tx.id || tx.transactionId || `${loan.id}-${index}`,
                                status: (tx.status?.toLowerCase() || 'completed') as 'completed' | 'pending' | 'failed',
                                loanId: loan.id
                            });
                        });
                    }

                    if (loan.repayments && loan.repayments.length > 0) {
                        loan.repayments.forEach((repayment: any, index: number) => {
                            if (repayment.status === 'PAID' && repayment.paidDate) {
                                formattedTransactions.push({
                                    key: `${loan.id}-repayment-${index}`,
                                    date: repayment.paidDate,
                                    reference: loan.reference,
                                    type: 'Credit' as const,
                                    amount: repayment.amount,
                                    channel: 'Bank Transfer',
                                    transactionId: `${loan.id}-REPAYMENT-${index + 1}`,
                                    status: 'completed' as const,
                                    loanId: loan.id
                                });
                            }
                        });
                    }
                });

                formattedTransactions.sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setTransactions(formattedTransactions);
                if (formattedTransactions.length === 0) {
                    toast({
                        title: 'No Transactions',
                        description: 'No loan transactions found. Transactions will appear here once you have active loans.',
                        status: 'info',
                        duration: 5000,
                        isClosable: true,
                    });
                }

            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch loan history',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                console.error('Error fetching loan history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoanHistory();
    }, [user?.id, toast]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Loan History" />
            {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="text-xl font-semibold mb-2">No Transaction History</div>
                    <div className="text-sm">Loan transactions will appear here once you have active loans.</div>
                </div>
            ) : (
                <DataTable<LoanTransaction>
                    data={transactions}
                    columns={loanColumns}
                    rowKey="key"
                    scrollX={1200}
                    backgroundImage="/src/assets/sappper-logo.png"
                />
            )}
        </div>
    );
};

export default LoanHistory;