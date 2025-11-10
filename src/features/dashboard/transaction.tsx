import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";

export default function DashboardWithrawal() {
    const navigate = useNavigate();
    return (
        <div className="bg-[#EFEBE3] p-4 rounded-2xl">
            <div className="flex justify-between gap-14">
                <Button bg='transparent' border='1px solid #EA947A' onClick={() => navigate(routes.withdrawal.index)}>Withdrawal</Button>
                <Button bg='transparent' border='1px solid #EA947A' onClick={() => navigate(routes.savings.personal)}>Quick Savings</Button>
            </div>
            <div className="mt-4">
                <FormControl>
                    <FormLabel>From</FormLabel>
                    <Select bg='white' placeholder='Select option'>
                        <option value='option1'>Regular Loan</option>
                        <option value='option2'>Bank Account</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>To</FormLabel>
                    <Input bg='white' type='text' />
                </FormControl>
                <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input bg='white' type='text' />
                </FormControl>
                <div className="flex justify-end mt-4">
                    <div style={{ background: "#EA947A", border: "1px solid white" }} className={`inline-flex p-1 rounded-full`}><ArrowRight color="white" /></div>
                </div>
            </div>

        </div>
    )
}