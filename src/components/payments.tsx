import { CardBody, Card, useDisclosure } from "@chakra-ui/react";
import { Segmented } from "antd";
import { PhoneOutgoing, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { format } from "date-fns";

export default function PaymentsComponent() {
    const [value, setValue] = useState<string | number>('7 days');
    const { transactions, loading, error } = useTransactions();
    const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
    const { isOpen, onToggle } = useDisclosure();
    const headerRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (!transactions.length) return;

        const days = value === '7 days' ? 7 : 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const recentTransactions = transactions
            .filter(t => new Date(t.createdAt) >= cutoffDate)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredTransactions(recentTransactions.map(t => ({
            id: t.transactionId,
            name: t.description || t.type.replace('_', ' '),
            date: format(new Date(t.createdAt), 'MMM dd, yyyy'),
            amount: t.amount.toLocaleString()
        })));
    }, [transactions, value]);

    const handleToggle = () => {
        if (!isOpen && headerRef.current) {
            const rect = headerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
        onToggle();
    };

    if (loading) return (
        <Card className="w-80 relative">
            <CardBody>
                <div className="animate-pulse">
                    <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="space-y-4 mt-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
                                    </div>
                                </div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    if (error) return (
        <Card className="w-80 relative">
            <CardBody>
                <div className="text-center text-red-500">
                    <p>⚠️ Failed to load transactions</p>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className="relative w-80">
            <Card 
                ref={headerRef}
                className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={handleToggle}
            >
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <p className="font-bold text-lg">Transactions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {filteredTransactions.length} recent
                            </span>
                            {isOpen ? (
                                <ChevronUp size={16} color="#53B175" />
                            ) : (
                                <ChevronDown size={16} color="#53B175" />
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={handleToggle}>
                    <Card 
                        className="absolute shadow-xl border animate-in slide-in-from-top-2 duration-200"
                        style={{ 
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${dropdownPosition.width}px`,
                            maxHeight: '400px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                    <CardBody>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b">
                            <p className="font-medium text-gray-700">Recent Activity</p>
                            <Segmented
                                className="font-bold"
                                size="small"
                                options={['7 days', '30 days']}
                                value={value}
                                onChange={setValue}
                            />
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {filteredTransactions.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredTransactions.slice(0, 10).map((transaction, index) => (
                                        <div 
                                            key={transaction.id} 
                                            className={`flex justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 ${
                                                index !== filteredTransactions.slice(0, 10).length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <PhoneOutgoing size={12} color="#53B175" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {transaction.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {transaction.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-700">
                                                    ₦{transaction.amount}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Wallet size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-base font-medium text-gray-700 mb-1">
                                        No transactions yet
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-xs">
                                        {value === '7 days'
                                            ? "You haven't made any transactions in the last 7 days"
                                            : "You haven't made any transactions in the last 30 days"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {filteredTransactions.length > 10 && (
                            <div className="pt-3 mt-3 border-t text-center">
                                <button className="text-sm text-[#53B175] hover:text-[#459c63] font-medium">
                                    View all {filteredTransactions.length} transactions
                                </button>
                            </div>
                        )}
                    </CardBody>
                </Card>
                </div>
            )}
        </div>
    );
}