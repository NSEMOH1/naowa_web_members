import { Center, Box, Flex, Text, Input } from "@chakra-ui/react";
import { PageHeader } from "../../components/pageHeader";
import { useState } from "react";
import DataTable from "../../components/table";
import type { TableColumn } from "../../lib/types";
import { useTransactions } from "../../hooks/useTransactions";
import { useMember } from "../../hooks/useMember";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  reference: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const Transaction = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { member} = useMember()
  const { transactions } = useTransactions();

  const formatAmount = (amount: number) => {
    return parseFloat(amount.toString()).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  const transactionColumns: TableColumn<Transaction>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Text fontWeight="semibold" textTransform="uppercase">
          {id}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <span className="font-semibold">{description}</span>
      ),
    },
    {
      title: "Amount (₦)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: Transaction, b: Transaction) =>
        parseFloat(a.amount.toString()) - parseFloat(b.amount.toString()),
      render: (amount: number, record: Transaction) => {
        const amountNum = parseFloat(amount.toString());
        const isWithdrawal =
          record.type === "SAVINGS_WITHDRAWAL" ||
          record.type === "LOAN_REPAYMENT";
        const color = isWithdrawal
          ? "red.500"
          : amountNum >= 0
          ? "green.500"
          : "red.500";
        return (
          <Text fontWeight="semibold" color={color}>
            {formatAmount(amount)}
          </Text>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColor =
          {
            COMPLETED: "green",
            PENDING: "orange",
            FAILED: "red",
          }[status] || "gray";

        return (
          <Text
            fontWeight="semibold"
            color={`${statusColor}.500`}
            textTransform="capitalize"
          >
            {status.toUpperCase()}
          </Text>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      sorter: (a: Transaction, b: Transaction) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: Date) => (
        <span className="font-semibold">
          {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (reference: string | null) => (
        <span className="font-semibold">{reference || "N/A"}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Transactions" />
      <Box mb={4}>
        <Center>
          <Box>
            <div className="flex flex-col justify-center items-center">
              <p className="font-bold text-2xl">
                <span>
                  {member?.first_name} {member?.last_name}
                </span>
              </p>
            </div>
            <Flex gap={4} mt={2} flexDirection={{ base: "column", md: "row" }}>
              <Box display="flex" alignItems="center" gap={2}>
                <span>From</span>
                <Input
                  type="date"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  max={endDate.toISOString().split("T")[0]}
                  width={{ base: "full", md: "auto" }}
                />
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <span>To</span>
                <Input
                  type="date"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  min={startDate.toISOString().split("T")[0]}
                  width={{ base: "full", md: "auto" }} 
                />
              </Box>
            </Flex>
          </Box>
        </Center>
      </Box>
      <DataTable
        data={transactions}
        columns={transactionColumns}
        rowKey="id"
        scrollX={1200}
        backgroundImage="/src/assets/sappper-logo.png"
        tableHeaderBg="#0692DE"
        tableHeaderColor="white"
      />
      {transactions.length === 0 && (
        <p className="text-xl text-center font-semibold">
          No transactions found for the selected period
        </p>
      )}
    </div>
  );
};

export default Transaction;
