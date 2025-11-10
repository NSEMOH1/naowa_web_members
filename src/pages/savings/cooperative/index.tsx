import { TrendingUp} from "lucide-react"
import NewCoopSavings from "../../../features/savings/cooperative"
import PaymentsComponent from "../../../components/payments"
import { PageHeader } from "../../../components/pageHeader"
import { useSavingsBalance } from "../../../hooks/useSavings"

const CooperativeSavings = () => {
    const { balance } = useSavingsBalance()
    return (
        <div>
            <PageHeader title="Savings" />
            <div className="flex w-full gap-4 mt-4">
                <div className="w-full">
                    <div className="flex-1">
                        <div className="p-4 bg-[#60C77C] text-white rounded-2xl h-[150px] shadow-lg">
                            <p className="pb-3">Total Saving Balance</p>
                            <div>
                                <p className="text-2xl font-bold">₦{balance?.cooperativeSavings?.toString() ?? "0"}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p>Available Credit</p>
                                    <p>₦0</p>
                                </div>
                                
                            </div>
                        </div>
                        <div>
                            <div className="mt-6">
                                <p className="font-bold text-xl">Savings Record</p>
                                <div className="flex gap-4 mt-2 flex-col md:flex-row">
                                    <div style={{ background: '#ADB7F0' }} className="p-4 py-6 text-white w-full rounded-lg shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold">Monthly Deduction</p>
                                            <div style={{ background: '#ADB7F0', border: "1px solid white" }} className={`inline-flex p-1 rounded-full`}><TrendingUp color="white" /></div>
                                        </div>
                                        <p className="text-xl font-bold">₦{balance?.monthlyDeduction}</p>
                                    </div>
                                    <div style={{ background: "#EBB9A1" }} className="p-4 py-6 text-white w-full rounded-lg shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold">Quick Savings</p>
                                            <div style={{ background: "#EBB9A1", border: "1px solid white" }} className={`inline-flex p-1 rounded-full`}><TrendingUp color="white" /></div>
                                        </div>
                                        <p className="text-xl font-bold">₦{balance?.normalSavings.toString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block">
                    <PaymentsComponent />
                </div>
            </div>
            <NewCoopSavings />
        </div>
    )
}

export default CooperativeSavings