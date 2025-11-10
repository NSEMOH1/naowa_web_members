import { Button } from "@chakra-ui/react"
import { Download, Upload } from "lucide-react"
import NewPersonalSavings from "../../../features/savings/personal"
import { useSavingsBalance } from "../../../hooks/useSavings"
import { useNavigate } from "react-router-dom"
import { routes } from "../../../lib/routes"

const PersonalSavings = () => {
    const { balance } = useSavingsBalance()
    const navigate = useNavigate()
    return (
        <div>
            <p className="text-xl font-bold pb-4">Personal Savings</p>
            <div className="flex justify-center items-center">
                <div>
                    <div className="p-4 bg-[#ADB7F0] text-white rounded-2xl h-[150px] w-[100vw] md:w-[50vw]">
                        <p className="pb-3">Quick Savings Balance</p>
                        <div>
                            <p className="text-2xl font-bold">₦{balance?.totalSavings}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                {/* <p>Interest Rate</p>
                                <p>5% - 10%</p> */}
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={() => navigate(routes.withdrawal.index)} size="sm" bg='aliceblue' border='1px solid black' leftIcon={<Download size={14} color="black" />}>Withdraw</Button>
                            </div>
                        </div>
                    </div>
                    <NewPersonalSavings />
                </div>
            </div>

        </div>
    )
}

export default PersonalSavings