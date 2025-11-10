import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    Divider,
    VStack,
    HStack,
    Box,
    PinInput,
    PinInputField
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import otpIcon from "../../assets/verify-otp.svg";
import { Decimal } from 'decimal.js';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';

export interface LoanDetails {
    amount: number;
    months: number;
    interestRate: number;
    category_name: LoanName;
    memberType: MemberType;
    rank?: string;
    memberId?: string;
}

export const LoanName = {
    REGULAR: 'REGULAR',
    EMERGENCY: 'EMERGENCY',
    HOME: 'HOME',
    COMMODITY: 'COMMODITY',
    HOUSING: 'HOUSING',
} as const;
export type LoanName = typeof LoanName[keyof typeof LoanName];

export const MemberType = {
    CIVILIAN: 'CIVILIAN',
    PERSONEL: 'PERSONEL',
} as const;
export type MemberType = typeof MemberType[keyof typeof MemberType];

interface LoanCategory {
    id: string | number;
    name: string;
    description?: string;
    interestRate?: string;
    minAmount?: string;
    maxAmount?: string;
    minDuration?: number;
    maxDuration?: number;
}

interface LoanSelectionStep1Props {
    updateLoanData: (data: Partial<LoanDetails>) => void;
    loanData: LoanDetails;
    categories: LoanCategory[];
}

export const LoanSelectionStep1 = ({ updateLoanData, loanData, categories }: LoanSelectionStep1Props) => {
    const { user } = useAuth();
    const [availableTerms, setAvailableTerms] = useState<{
        value: number;
        label: string;
        interestRate: number;
        maxAmount: number
    }[]>([]);


    const selectedCategory = categories.find(cat => cat.name === loanData.category_name);

    useEffect(() => {
        if (loanData.category_name === LoanName.REGULAR && user?.rank) {
            getRegularLoanDurations();
        }
    }, [loanData.category_name, user?.rank]);


    const calculateTotal = () => {
        const { amount = 0, interestRate = 5 } = loanData;
        return new Decimal(amount).plus(new Decimal(amount).times(interestRate).dividedBy(100))
    };

    const getStandardDurations = () => [
        { value: 3, label: '3 months' },
        { value: 6, label: '6 months' },
        { value: 12, label: '12 months' }
    ];

    const getRegularLoanDurations = useCallback(async () => {
        if (!user?.rank) return [];

        try {
            const response = await api.get(`/api/loan/terms?rank=${user.rank}`);
            const terms = response.data
                .filter((term: any) => [10, 20, 30].includes(term.durationMonths))
                .map((term: any) => ({
                    value: term.durationMonths,
                    label: `${term.durationMonths} months`,
                    interestRate: term.interestRate,
                    maxAmount: term.maximumAmount
                }));

            setAvailableTerms(terms);
            return terms;
        } catch (error) {
            console.error("Failed to fetch terms:", error);
            return [];
        }
    }, [user?.rank]);

    const handleCategoryChange = async (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        if (!category) return;

        const isRegular = categoryName === LoanName.REGULAR;
        let interestRate = category.interestRate ? parseFloat(category.interestRate) : 5;
        let months = loanData.months || (isRegular ? 10 : 3);

        if (isRegular && user?.rank) {
            const terms = await getRegularLoanDurations();
            if (terms.length > 0) {
                const defaultTerm = terms.find((t: any) => t.value === 10) || terms[0];
                interestRate = defaultTerm.interestRate;
                months = defaultTerm.value;
            }
        }

        updateLoanData({
            category_name: categoryName as LoanName,
            interestRate,
            months,
            amount: Math.max(loanData.amount || 0, category.minAmount ? parseFloat(category.minAmount) : 1000)
        });
    };

    const handleDurationChange = (months: number) => {
        if (loanData.category_name === LoanName.REGULAR) {
            const selectedTerm = availableTerms.find(term => term.value === months);
            updateLoanData({
                months,
                interestRate: selectedTerm?.interestRate || loanData.interestRate
            });
        } else {
            updateLoanData({ months });
        }
    };

    const getAmountConstraints = () => {
        if (!selectedCategory) return { min: 5000, max: 100000 };

        if (loanData.category_name === LoanName.REGULAR && availableTerms.length > 0) {
            const selectedTerm = availableTerms.find(term => term.value === loanData.months);
            return {
                min: selectedCategory.minAmount ? parseFloat(selectedCategory.minAmount) : 1000,
                max: selectedTerm?.maxAmount || 1000000
            };
        }

        return {
            min: selectedCategory.minAmount ? parseFloat(selectedCategory.minAmount) : 1000,
            max: selectedCategory.maxAmount ? parseFloat(selectedCategory.maxAmount) : 1000000
        };
    };

    const amountConstraints = getAmountConstraints();

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Loan Category</FormLabel>
                    <Select
                        value={loanData.category_name}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        placeholder="Select loan category"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name === 'HOME' ? 'HOME APPLIANCES' : category.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                {selectedCategory && (
                    <Box p={3} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm" color="blue.600">
                            <strong>Category Details:</strong> {selectedCategory.description}
                        </Text>
                        {loanData.category_name === LoanName.REGULAR && user?.rank ? (
                            <Text fontSize="sm" color="blue.600">
                                Interest Rate: Varies by duration (5-10%)
                            </Text>
                        ) : (
                            <Text fontSize="sm" color="blue.600">
                                Interest Rate: {selectedCategory.interestRate ? `${selectedCategory.interestRate}%` : 'Variable'}
                            </Text>
                        )}
                        <Text fontSize="sm" color="blue.600">
                            Amount Range: ₦{amountConstraints.min.toLocaleString()} - ₦{amountConstraints.max.toLocaleString()}
                        </Text>
                    </Box>
                )}

                <FormControl isRequired>
                    <FormLabel>Amount (₦)</FormLabel>
                    <Input
                        type="number"
                        value={loanData.amount ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            updateLoanData({
                                amount: value === '' ? undefined : parseFloat(value)
                            });
                        }}
                        min={amountConstraints.min}
                        max={amountConstraints.max}
                        placeholder={`Enter amount between ₦${amountConstraints.min.toLocaleString()} - ₦${amountConstraints.max.toLocaleString()}`}
                    />
                    {loanData.amount !== undefined &&
                        (loanData.amount < amountConstraints.min ||
                            loanData.amount > amountConstraints.max) && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                Amount must be between ₦{amountConstraints.min.toLocaleString()} and ₦{amountConstraints.max.toLocaleString()}
                            </Text>
                        )}
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Tenure (Months)</FormLabel>
                    <Select
                        value={loanData.months}
                        onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                        placeholder="Select tenure"
                    >
                        {loanData.category_name === LoanName.REGULAR ? (
                            availableTerms.map((duration) => (
                                <option key={duration.value} value={duration.value}>
                                    {duration.label} ({duration.interestRate}%)
                                </option>
                            ))
                        ) : (
                            getStandardDurations().map((duration) => (
                                <option key={duration.value} value={duration.value}>
                                    {duration.label}
                                </option>
                            ))
                        )}
                    </Select>
                </FormControl>

                <Box mt={6}>
                    <Text fontWeight="bold">Loan Details</Text>
                    <VStack spacing={2} mt={2} align="stretch">
                        <HStack justify="space-between">
                            <Text>Loan Amount</Text>
                            <Text>₦{new Decimal(loanData.amount || 0).toFixed(2)}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text>Interest Rate</Text>
                            <Text>{loanData.interestRate}%</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text>Tenure</Text>
                            <Text>{loanData.months} months</Text>
                        </HStack>
                        <Divider />
                        <HStack justify="space-between" fontWeight="semibold">
                            <Text>Total Repayment</Text>
                            <Text>₦{calculateTotal().toFixed(2)}</Text>
                        </HStack>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export const LoanSelectionStep2 = () => {
    const { user } = useAuth()

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                        value={`${user?.first_name} ${user?.last_name}`}
                        isDisabled
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        value={`${user?.email}`}
                        isDisabled
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Rank</FormLabel>
                    <Input
                        value={user?.rank}
                        isDisabled
                    />
                </FormControl>
            </VStack>
        </Box>
    );
};

interface LoanSelectionStep3Props {
    loanData: LoanDetails;
}

export const LoanSelectionStep3 = ({ loanData }: LoanSelectionStep3Props) => {
    const totalRepayment = new Decimal(loanData.amount)
        .plus(new Decimal(loanData.amount).times(loanData.interestRate).dividedBy(100));
    const monthlyPayment = totalRepayment.dividedBy(loanData.months);

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Loan Summary</Text>

                <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                        <Text>Loan Amount:</Text>
                        <Text>₦{new Decimal(loanData.amount).toFixed(2)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text>Interest Rate:</Text>
                        <Text>{loanData.interestRate}%</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text>Tenure:</Text>
                        <Text>{loanData.months} months</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text>Loan Type:</Text>
                        <Text>{loanData.category_name}</Text>
                    </HStack>
                </VStack>

                <Divider my={4} />

                <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                        <Text>Monthly Payment:</Text>
                        <Text fontWeight="semibold">₦{monthlyPayment.toFixed(2)}</Text>
                    </HStack>
                    <HStack justify="space-between" mt={2}>
                        <Text fontSize="lg" fontWeight="bold">Total Repayment:</Text>
                        <Text fontSize="lg" fontWeight="bold">₦{totalRepayment.toFixed(2)}</Text>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    );
};

interface LoanOtpVerificationProps {
    onVerify: (otp: string) => void;
    error?: string;
    isLoading?: boolean;
}

export const LoanOtpVerification = ({ onVerify, error, isLoading }: LoanOtpVerificationProps) => {
    const [otp, setOtp] = useState('');

    const handleComplete = (value: string) => {
        setOtp(value);
        onVerify(value);
    };

    return (
        <Box>
            <div className='flex flex-col items-center'>
                <img src={otpIcon} alt="OTP verification" />
                <p className='font-semibold pt-3'>OTP Verification</p>
                <p className='text-xs font-thin pb-4'>Enter your OTP Code sent to your registered contact</p>
            </div>
            <HStack justifyContent='center'>
                <PinInput
                    otp
                    size="lg"
                    onComplete={handleComplete}
                    isDisabled={isLoading}
                >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                </PinInput>
            </HStack>
            {error && (
                <Text color="red.500" textAlign="center" pt={4}>
                    {error}
                </Text>
            )}
        </Box>
    );
};
