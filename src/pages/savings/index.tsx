import { Button, Progress } from "@chakra-ui/react"
import { TrendingUp, Upload } from "lucide-react"
import { targetSavings } from "./data"
import PaymentsComponent from "../../components/payments"
import { PageHeader } from "../../components/pageHeader"
import { useSavingsBalance } from "../../hooks/useSavings"
import { useNavigate } from "react-router-dom"
import { routes } from "../../lib/routes"

const Savings = () => {
    const { balance } = useSavingsBalance()
    const navigate = useNavigate()
    return (
        <div>
            <PageHeader title="Savings" />
            <div className="flex w-full gap-4 mt-4">
                <div className="w-full">
                    <div className="flex-1">
                        <div className="p-4 bg-[#60C77C] shadow-lg text-white rounded-2xl h-[150px]">
                            <p className="pb-3 font-bold">Total Saving Balance</p>
                            <div>
                                <p className="text-2xl font-bold">₦{balance?.totalSavings}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p>Pending Payments</p>
                                    <p>₦0</p>
                                </div>
                                <Button onClick={() => navigate(routes.payments.index)} size="sm" bg='#F7B23B' leftIcon={<Upload size={14} color="black" />}>Pay Now</Button>
                            </div>
                        </div>
                        <div>
                            <div className="mt-6">
                                <p className="font-bold text-xl">Savings Record</p>
                                <div className="flex gap-4 mt-2">

                                    <div style={{ background: '#ADB7F0' }} className="p-4 py-6 text-white w-full rounded-xl shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold">Monthly Deduction</p>
                                            <div style={{ background: '#ADB7F0', border: "1px solid white" }} className={`inline-flex p-1 rounded-full`}><TrendingUp color="white" /></div>
                                        </div>
                                        <p className="text-xl font-bold">₦{balance?.monthlyDeduction}</p>
                                    </div>
                                    <div style={{ background: '#EBB9A1' }} className="p-4 py-6 text-white w-full rounded-xl shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold">Quick Savings</p>
                                            <div style={{ background: '#EBB9A1', border: "1px solid white" }} className={`inline-flex p-1 rounded-full`}><TrendingUp color="white" /></div>
                                        </div>
                                        <p className="text-xl font-bold">₦{balance?.normalSavings?.toString()}</p>
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
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-xl">Targeted Savings</p>
                    <p className="pr-10">See All</p>
                </div>
                <div className="p-4 bg-gradient-to-b from-[#63CC80] via-[#60C77C] to-[#175B34] text-white rounded-2xl mt-4 shadow-lg">
                    {targetSavings.map((data) => (
                        <div>
                            <div className="flex justify-between mb-1">
                                <label htmlFor="">{data.type}</label>
                                <label htmlFor="">{data.amount}</label>
                            </div>
                            <Progress mb={4} colorScheme="green" size='sm' value={data.value} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}


export default Savings