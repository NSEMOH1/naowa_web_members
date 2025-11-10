import { Button, HStack, Input, Modal, ModalBody, Text, ModalCloseButton, ModalContent, ModalOverlay, PinInput, PinInputField, useDisclosure, Heading, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import successIcon from "../../assets/success.svg"
import bgCoop from "../../assets/sappper-logo.png"
import avatarIcon from "../../assets/jp.svg"
import { Avatar } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useSavingsBalance } from "../../hooks/useSavings";
import { useLoanBalances } from "../../hooks/useLoan";
import api from "../../api";
import { useMember } from "../../hooks/useMember";

export default function WithdrawalForm() {
    const navigate = useNavigate()
    const toast = useToast()
    const [amount, setAmount] = useState("");
    const [confirmPayment, setConfirmPayment] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentCancelled, setPaymentCancelled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const { member } = useMember()
    const [pin, setPin] = useState('')
    const { balance } = useSavingsBalance()
    const { summary, getCollectedAmount } = useLoanBalances()

    const handleOtp = (value: string) => {
        setPin(value);
    };

    const payload = {
        amount: amount,
        pin: pin,
        category_name: "QUICK"
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await api.post("/api/savings/withdraw", payload)
            onClose();
            setPaymentSuccess(true);
        } catch (error: any) {
            let errorMessage = 'Failed to submit withdrawal application';
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
                title: 'Withdrawal Failed',
                description: errorMessage,
                status: 'error',
            });
        } finally {
            setIsLoading(false)
        }

    }



    if (paymentSuccess) {
        return (
            <div className="flex justify-center mt-10">
                <VStack spacing={6} textAlign="center" py={10} w='50vw' className="shadow-lg" px={8}>
                    <Heading size="md" color='#0692DE'>Request Successful</Heading>
                    <Text color="#0692DE">Your withdrawal request has been processed successfully</Text>
                    <img width={200} src={successIcon} alt="success" />
                    <Button
                        colorScheme="blue"
                        width="full"
                        onClick={() => {
                            setPaymentSuccess(false);
                            setConfirmPayment(false);
                            setAmount("");
                            navigate(routes.savings.index)
                        }}
                    >
                        Continue
                    </Button>
                </VStack>
            </div>
        );
    }

    if (paymentCancelled) {
        return (
            <div className="flex justify-center mt-10">
                <div>
                    <div className="flex bg-[#EC4C27] w-full text-white gap-4 p-4">
                        <Avatar src={avatarIcon} />
                        <div>
                            <p>{member?.first_name} {member?.last_name}</p>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="flex gap-1">
                            <p>Total Savings:</p>
                            <p className="font-bold">₦{balance?.totalSavings}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Total Loan Balance:</p>
                            <p className="font-bold">₦{summary.totalOutstanding}</p>
                        </div>
                        {/* <div className="flex gap-1">
                            <p>Emergency Loan</p>
                            <p className="font-bold">₦{getCollectedAmount('EMERGENCY')}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Commodity Loan:</p>
                            <p className="font-bold">₦{getCollectedAmount('COMMODITY')}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Housing Loan:</p>
                            <p className="font-bold">₦{getCollectedAmount('HOUSING')}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Home Appliances:</p>
                            <p className="font-bold">₦{getCollectedAmount('HOME')}</p>
                        </div> */}
                        <div className="flex gap-1">
                            <p>Regular Loan:</p>
                            <p className="font-bold">₦{getCollectedAmount('REGULAR')}</p>
                        </div>
                    </div>
                    <Text mt={4} fontWeight='bold' color="#EC4C27">
                        You are about to initiate a withdrawal from your account.
                        Please note: Funds will be disbursed within the next two (2) months.
                    </Text>
                    <Text mt={4} fontWeight='bold' color="#EC4C27">Ensure this delay aligns with your expectations before proceeding.</Text>

                    <Button
                      color='white'
                        width="full"
                        onClick={() => {
                            navigate(routes.savings.index)
                            toast({ title: "Request Sumitted Successfully", status: "success", position: "top-right"})
                        }}
                        mt={6}
                        bg="#EC4C27"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        );
    }

    if (confirmPayment) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl p-8 rounded-xl shadow-md relative bg-white">
                    <p className="text-blue-400 font-semibold text-xl underline">Preview</p>
                    <div className="flex flex-col gap-5 mb-4">
                        <p className="font-bold text-2xl pt-3">Source Account: <span className="text-blue-500">{member?.bank[0]?.name}</span></p>
                        <p className="font-bold text-2xl">Beneficiary: <span className="text-blue-500">{member?.bank[0]?.account_number}</span></p>
                        <div className="font-bold text-2xl">
                            <p className="text-lg">Amount:</p>
                            <p className="text-green-500">₦{amount}</p>
                        </div>
                    </div>
                    <Button w='full' bg='#0692DE' color='white' onClick={onOpen}
                    >
                        Continue
                    </Button>
                </div>
                <Modal onClose={onClose} isOpen={isOpen} isCentered >
                    <ModalOverlay />
                    <ModalContent
                        h="50vh"
                        style={{
                            backgroundImage: `url('${bgCoop}')`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "50%",
                        }}
                    >
                        <ModalCloseButton />
                        <ModalBody className="flex flex-col justify-center items-center gap-8">
                            <Text fontWeight='semibold'>Enter Your Pin</Text>
                            <HStack w='100%' justify='center'>
                                <PinInput onComplete={handleOtp} type='number' mask>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                            <Button isLoading={isLoading} w='full' bg='#0692DE' color='white' onClick={() => {
                                handleSubmit()
                            }}
                            >Submit
                            </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div
                className="w-full max-w-2xl p-8 rounded-xl shadow-md relative bg-white"
                style={{
                    backgroundImage: `url('${bgCoop}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "40%",
                }}
            >
                <p className="pb-4 font-bold text-2xl text-gray-800">Withdraw Form</p>

                <div className="flex gap-8 mb-6">
                    <Button bg="#53B175" color='white' onClick={() => navigate(routes.savings.personal)}>
                        Quick Saving
                    </Button>
                    <Button variant='outline' onClick={() => setPaymentCancelled(true)}>
                        Close Account
                    </Button>
                </div>

                <p className="text-gray-600 mb-6">
                    Verification UI: Include options for verifying withdrawal requests, such as two-factor
                    authentication (2FA), email confirmations, or security questions.
                </p>

                <div className="mb-8 mt-3">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="amount">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="amount"
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="bankName">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="bankName"
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                                type="text"
                                value={`${member?.bank[0]?.name}`}
                                isDisabled
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="accountNumber">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="accountNumber"
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                                type="text"
                                value={`${member?.bank[0]?.account_number}`}
                                isDisabled
                            />
                        </div>
                    </div>
                </div>
                <Button w='full' bg='#0692DE' color='white'
                    onClick={() => setConfirmPayment(true)}
                    isDisabled={!member?.bank[0]?.account_number || !member?.bank[0]?.name || !amount}
                >
                    Preview and Withdraw
                </Button>
            </div>
        </div>
    );
}