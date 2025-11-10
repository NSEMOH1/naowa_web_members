export const savingsRecords = [
    { id: 1, name: "Monthly Deduction", color: "#ADB7F0", amount: "₦51,000" },
    { id: 2, name: "Quick Savings", color: "#EBB9A1", amount: "₦7625" },
];

export const savingsTransactions = [
    {
        id: 1,
        name: "Initial Deposit",
        type: "incoming",
        date: "2023-06-15",
        amount: 500000,
        status: "completed",
        accountType: "fixed deposit",
        reference: "DEP-789012",
        balance: 500000,
    },
    {
        id: 2,
        type: "incoming",
        name: "Monthly Savings Contribution",
        date: "2023-06-05",
        amount: 50000,
        status: "completed",
        accountType: "regular savings",
        reference: "DEP-789013",
        balance: 550000,
    },
    {
        id: 3,
        name: "Interest Credit",
        type: "incoming",
        date: "2023-05-28",
        amount: 12500,
        status: "completed",
        accountType: "fixed deposit",
        reference: "INT-789014",
        balance: 562500,
    },
    {
        id: 4,
        name: "Withdrawal",
        type: "outgoing",
        date: "2023-05-20",
        amount: 100000,
        status: "completed",
        accountType: "regular savings",
        reference: "WDL-789015",
        balance: 462500,
    },
];

export const targetSavings = [
    { type: "Weekly", amount: "₦20,000", value: 80 },
    { type: "Montly", amount: "₦300,000", value: 20 },
    { type: "Yearly", amount: "₦2,000,000", value: 50 }
]


