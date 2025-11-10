import { CardBody, Card, Select } from "@chakra-ui/react";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

export default function TransactionComponent({ transactions }: any) {
    return (
        <Card mb={4}>
            <CardBody>
                <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-lg">Transactions</p>
                    <Select placeholder='MONTHLY' w={40} className="shadow-lg">
                        <option value='MONTHLY'>MONTHLY</option>
                        <option value='YEARLY'>YEARLY</option>
                    </Select>
                </div>
                {transactions.map((transaction: any) => (
                    <div className="flex justify-between py-2 border-b pt-4">
                        <div className="flex items-center gap-2">
                            {transaction.type === 'incoming' ? (<PhoneIncoming size={12} color="green" />) : (<PhoneOutgoing size={12} color="red" />)}
                            <div>
                                <p className="text-sm font-semibold">{transaction.name}</p>
                                <p className="text-[10px] text-gray-500">{transaction.date}</p>
                            </div>
                        </div>
                        <p className="text-gray-400">
                            ₦{transaction.amount}
                        </p>
                    </div>
                ))}
            </CardBody>
        </Card>
    )
}