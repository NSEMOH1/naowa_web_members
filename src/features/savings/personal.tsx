import {
    Button,
    Card,
    CardBody,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    useToast,
    VStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { useState } from "react";
import successIcon from "../../assets/success.svg";
import api from "../../api";

export default function NewPersonalSavings() {
    const navigate = useNavigate();
    const toast = useToast()
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await api.post("/api/savings/deposit", {
                amount: parseFloat(amount),
                category_name: "QUICK"
            });
            setIsComplete(true);
        } catch (error: any) {
            console.error('Loan application error:', error);

            let errorMessage = 'Failed to submit loan application';
            if (error.response) {
                if (error.response.data?.details) {
                    errorMessage = error.response.data.details;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.statusText) {
                    errorMessage = error.response.statusText;
                }
            } else if (error.request) {
                errorMessage = 'No response received from server';
            } else {
                errorMessage = error.message || 'Error setting up request';
            }

            toast({
                title: 'Deposit Failed',
                description: errorMessage,
                status: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        window.location.reload();
        navigate(routes.savings.index)
    }

    if (isComplete) {
        return (
            <VStack className="shadow-lg" w='50vw' spacing={6} py={10} borderRadius={10} mt={6}>
                <Heading color="#0692DE" size="lg">Success!</Heading>
                <p className="text-[#0692DE]">Saving Adjusted WEF October 2024</p>
                <img width={200} src={successIcon} alt="success" />
                <Button
                    bg='#60C77C'
                    onClick={handleSuccess}
                    mt={6}
                    width="50%"
                >
                    Done
                </Button>
            </VStack>
        );
    }

    return (
        <div className="mt-7 w-[100vw] md:w-[50vw]">
            <Card>
                <CardBody>
                    <p className="font-bold text-xl pb-2 text-[#60C77C] underline">Quick Saving</p>

                    <FormControl mb={4}>
                        <FormLabel>Amount of Savings</FormLabel>
                        <Input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="₦"
                            type="number"
                        />
                    </FormControl>

                    <Flex gap={4}>
                        <Button
                            variant='outline'
                            onClick={() => navigate(routes.savings.index)}
                        >
                            Cancel
                        </Button>
                        <Button
                            w='full'
                            bg='#60C77C'
                            color='white'
                            onClick={() => navigate(routes.payments.index)}
                            isLoading={isLoading}
                            loadingText="Processing..."
                        >
                            Make Payment
                        </Button>
                    </Flex>
                </CardBody>
            </Card>
        </div>
    );
}