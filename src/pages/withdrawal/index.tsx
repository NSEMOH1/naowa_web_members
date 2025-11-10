// import { Progress } from "@chakra-ui/react"
import { Send, ShoppingBag, User } from "lucide-react"
import { PageHeader } from "../../components/pageHeader"
import WithdrawalForm from "../../features/withdrawal/form"
import { useSavingsBalance } from "../../hooks/useSavings"

const Withdrawal = () => {
    const { balance } = useSavingsBalance()
    return (
        <div>
            <PageHeader title="Withdrawal" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 w-full">
                <div
                    style={{ background: "#89B882" }}
                    className="shadow-xl p-4 rounded-xl w-full"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm text-gray-700">Total Savings Balance</p>
                            <p className="font-bold text-lg pt-2">₦{balance?.totalSavings}</p>
                        </div>
                        <div style={{ background: '#E5FAFF' }} className="flex items-center justify-center p-2 rounded-lg">
                            {<ShoppingBag size={13} />}
                        </div>
                    </div>
                </div>
                <div
                    style={{ background: "#FBCC71" }}
                    className="shadow-xl p-4 rounded-xl w-full"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm text-gray-700">Loan Payment Progress</p>
                            <p className="font-bold text-lg pt-2"></p>
                        </div>
                        <div style={{ background: "#FEF3E7" }} className="flex items-center justify-center p-2 rounded-lg">
                            {<Send size={13} />}
                        </div>
                    </div>
                </div>
                <div
                    style={{ background: "#FFFFFF" }}
                    className="shadow-xl p-4 rounded-xl w-full"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm text-gray-700">Eligibily Status</p>
                            <p className="font-bold text-lg pt-2"></p>
                        </div>
                        <div style={{ background: "#FEF8E6" }} className="flex items-center justify-center p-2 rounded-lg">
                            {<User size={13} />}
                        </div>
                    </div>
                </div>
                <div
                    style={{ background: "#ADB7F0" }}
                    className="shadow-xl p-4 rounded-xl w-full"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm text-gray-700">Quick Savings Balance</p>
                            <p className="font-bold text-lg pt-2">₦{balance?.normalSavings.toString()}</p>
                        </div>
                        <div style={{ background: "#E8E6FE" }} className="flex items-center justify-center p-2 rounded-lg">
                            {<ShoppingBag size={13} />}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <WithdrawalForm />
            </div>
        </div>
    )
}

export default Withdrawal