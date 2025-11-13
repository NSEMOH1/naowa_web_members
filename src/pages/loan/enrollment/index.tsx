import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  useDisclosure,
  Heading,
  Text,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";
import api from "../../../api";
import { Upload, FileText, X } from "lucide-react";
import { useMember } from "../../../hooks/useMember";
import { useSavingsBalance } from "../../../hooks/useSavings";
import { useLoanBalances } from "../../../hooks/useLoan";

interface LoanFormData {
  loanType: string;
  isServicingLoan: string;
  amount: number;
  duration: number;
  applicationLetter: File | null;
  letterOfIndebtedness: File | null;
  validId: File | null;
  incomeProof: File | null;
  accountStatement: File | null;
  utilityBill: File | null;
  guarantorLetter: File | null;
  guarantorPassport: File | null;
  personalPassport: File | null;
}

interface OTPResponse {
  success: boolean;
  message?: string;
}

interface LoanApplicationResponse {
  loan: {
    id: string;
    reference: string;
  };
}

const steps = [
  { title: "Loan Information" },
  { title: "Member Information" },
  { title: "Upload Documents (1/3)" },
  { title: "Upload Documents (2/3)" },
  { title: "Upload Documents (3/3)" },
  { title: "Summary" },
  { title: "OTP Verification" },
  { title: "Success" },
];

const LoanEnrollment = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { member } = useMember();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loanId, setLoanId] = useState("");
  const [loanReference, setLoanReference] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const { balance } = useSavingsBalance();
  const { summary } = useLoanBalances();

  const [formData, setFormData] = useState<LoanFormData>({
    loanType: "REGULAR",
    isServicingLoan: "",
    amount: 0,
    duration: 0,
    applicationLetter: null,
    letterOfIndebtedness: null,
    validId: null,
    incomeProof: null,
    accountStatement: null,
    utilityBill: null,
    guarantorLetter: null,
    guarantorPassport: null,
    personalPassport: null,
  });

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleInputChange = useCallback(
    (field: keyof LoanFormData, value: string) => {
      if (field === "amount" || field === "duration") {
        setFormData((prev) => ({ ...prev, [field]: Number(value) }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  const handleFileUpload = (
    field: keyof Omit<
      LoanFormData,
      "loanType" | "isServicingLoan" | "amount" | "duration"
    >,
    file: File
  ) => {
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File must be less than 3MB",
        status: "error",
      });
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, or PDF files only",
        status: "error",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const removeFile = (
    field: keyof Omit<
      LoanFormData,
      "loanType" | "isServicingLoan" | "amount" | "duration"
    >
  ) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.isServicingLoan) return false;
        if (!formData.amount || formData.amount <= 0) return false;
        if (!formData.duration || ![12, 24].includes(formData.duration))
          return false;
        return true;
      case 1:
        return true;
      case 2:
        return !!(
          formData.applicationLetter &&
          formData.letterOfIndebtedness &&
          formData.validId
        );
      case 3:
        return !!(
          formData.incomeProof &&
          formData.accountStatement &&
          formData.utilityBill
        );
      case 4:
        return !!(
          formData.guarantorLetter &&
          formData.guarantorPassport &&
          formData.personalPassport
        );
      case 5:
        return true;
      case 6:
        return otp.length === 6;
      default:
        return true;
    }
  };

  const isStepValid = () => {
    return validateForm(activeStep);
  };

  const nextStep = () => {
    if (activeStep === 5) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      const payload = {
        category: formData.loanType,
        servicingLoan: formData.isServicingLoan,
        amount: formData.amount,
        durationMonths: formData.duration,
      };

      if (formData.applicationLetter) {
        formDataToSend.append("application", formData.applicationLetter);
      }
      if (formData.letterOfIndebtedness) {
        formDataToSend.append("nonIndebtedness", formData.letterOfIndebtedness);
      }
      if (formData.validId) {
        formDataToSend.append("validId", formData.validId);
      }
      if (formData.incomeProof) {
        formDataToSend.append("incomeProof", formData.incomeProof);
      }
      if (formData.accountStatement) {
        formDataToSend.append("accountStatement", formData.accountStatement);
      }
      if (formData.utilityBill) {
        formDataToSend.append("utilityBill", formData.utilityBill);
      }
      if (formData.guarantorLetter) {
        formDataToSend.append("guarantorLetter", formData.guarantorLetter);
      }
      if (formData.guarantorPassport) {
        formDataToSend.append("guarantorPassport", formData.guarantorPassport);
      }
      if (formData.personalPassport) {
        formDataToSend.append("personalPassport", formData.personalPassport);
      }
      formDataToSend.append("data", JSON.stringify(payload));

      const response = await api.post<LoanApplicationResponse>(
        "/api/loan/apply",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setLoanId(response.data.loan.id);
        setLoanReference(response.data.loan.reference);
        setActiveStep(6);
        toast({
          title: "Application Submitted",
          description: "OTP has been sent to your registered contact",
          status: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error.response?.data?.message || "Failed to submit application",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsSubmitting(true);
    setOtpError("");

    try {
      const response = await api.post<OTPResponse>(
        `/api/loan/${loanId}/verify`,
        { otp }
      );

      if (response.data && response.data.success) {
        setActiveStep(7);
        toast({
          title: "Verification Successful",
          description: "Your loan application has been verified",
          status: "success",
        });
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInterestRate = () => {
    return formData.duration === 12 ? 5 : formData.duration === 24 ? 7 : 0;
  };

  const calculateTotalRepayment = () => {
    const principal = formData.amount || 0;
    const interestRate = getInterestRate();
    const interest = (principal * interestRate) / 100;
    return principal + interest;
  };

  const calculateMonthlyRepayment = () => {
    const total = calculateTotalRepayment();
    const months = formData.duration || 1;
    return total / months;
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setActiveStep(0);
    onClose();
    navigate(routes.loan.index);
  };

  const handleSuccessClose = () => {
    setActiveStep(0);
    onClose();
    navigate(routes.loan.enrollment_status);
  };

  const renderLoanInfo = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Loan Type</FormLabel>
        <Input value="Regular Loan" isReadOnly bg="gray.50" />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Are you currently servicing a loan?</FormLabel>
        <RadioGroup
          value={formData.isServicingLoan}
          onChange={(value) => handleInputChange("isServicingLoan", value)}
        >
          <Stack direction="row">
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Savings Balance</FormLabel>
        <Input
          value={`₦${balance?.totalSavings || "0".toLocaleString()}`}
          isReadOnly
          bg="gray.50"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Loan Balance</FormLabel>
        <Input
          value={`₦${summary?.totalOutstanding || "0".toLocaleString()}`}
          isReadOnly
          bg="gray.50"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Loan Amount</FormLabel>
        <Input
          type="number"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          min="1"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Duration</FormLabel>
        <RadioGroup
          value={formData.duration.toString()}
          onChange={(value) => handleInputChange("duration", value)}
        >
          <Stack direction="column" spacing={3}>
            <Radio value="12">12 Months (5% Interest Rate)</Radio>
            <Radio value="24">24 Months (7% Interest Rate)</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
    </VStack>
  );

  const renderMemberInfo = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input value={`${member?.full_name}`} isReadOnly />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input type="email" value={member?.email} isReadOnly />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input type="tel" value={member?.phone} isReadOnly />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Address</FormLabel>
        <Textarea value={member?.address} isReadOnly />
      </FormControl>
    </VStack>
  );

  const renderFileUploadBox = (
    label: string,
    field: keyof Omit<
      LoanFormData,
      "loanType" | "isServicingLoan" | "amount" | "duration"
    >
  ) => {
    const file = formData[field];

    return (
      <FormControl isRequired>
        <FormLabel>{label}</FormLabel>
        {file ? (
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            bg="gray.50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <Text fontSize="sm">{file.name}</Text>
              </div>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => removeFile(field)}
              >
                <X size={16} />
              </Button>
            </div>
          </Box>
        ) : (
          <Box
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={6}
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "blue.500", bg: "blue.50" }}
            onClick={() => document.getElementById(field)?.click()}
          >
            <Upload
              size={24}
              style={{ margin: "0 auto", marginBottom: "8px" }}
            />
            <Text fontSize="sm" color="gray.600">
              Click to upload or drag and drop
            </Text>
            <Text fontSize="xs" color="gray.500">
              JPEG, PNG, PDF (Max 3MB)
            </Text>
            <input
              id={field}
              type="file"
              accept=".jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(field, file);
              }}
            />
          </Box>
        )}
      </FormControl>
    );
  };

  const renderDocumentUpload1 = () => (
    <VStack spacing={4} align="stretch">
      {renderFileUploadBox("Application Letter", "applicationLetter")}
      {renderFileUploadBox(
        "Letter of Non-Indebtedness",
        "letterOfIndebtedness"
      )}
      {renderFileUploadBox("Valid ID Card", "validId")}
    </VStack>
  );

  const renderDocumentUpload2 = () => (
    <VStack spacing={4} align="stretch">
      {renderFileUploadBox("Proof of Income", "incomeProof")}
      {renderFileUploadBox("Bank Account Statement", "accountStatement")}
      {renderFileUploadBox("Utility Bill", "utilityBill")}
    </VStack>
  );

  const renderDocumentUpload3 = () => (
    <VStack spacing={4} align="stretch">
      {renderFileUploadBox("Guarantor's Letter", "guarantorLetter")}
      {renderFileUploadBox("Guarantor's Passport", "guarantorPassport")}
      {renderFileUploadBox("Personal Passport Photo", "personalPassport")}
    </VStack>
  );

  const renderSummary = () => (
    <VStack spacing={4} align="stretch">
      <Box bg="blue.50" p={4} borderRadius="md">
        <Heading size="sm" mb={2}>
          Loan Details
        </Heading>
        <Text fontSize="sm">Type: Regular Loan</Text>
        <Text fontSize="sm">Amount: ₦{formData.amount.toLocaleString()}</Text>
        <Text fontSize="sm">Duration: {formData.duration} months</Text>
        <Text fontSize="sm">Interest Rate: {getInterestRate()}%</Text>
        <Text fontSize="sm" fontWeight="bold">
          Total Repayment: ₦{calculateTotalRepayment().toLocaleString()}
        </Text>
        <Text fontSize="sm">
          Monthly Repayment: ₦{calculateMonthlyRepayment().toLocaleString()}
        </Text>
        <Text fontSize="sm">
          Servicing Loan: {formData.isServicingLoan === "yes" ? "Yes" : "No"}
        </Text>
      </Box>

      <Box bg="gray.50" p={4} borderRadius="md">
        <Heading size="sm" mb={2}>
          Member Information
        </Heading>
        <Text fontSize="sm">{`${member?.full_name}`}</Text>
        <Text fontSize="sm">{member?.email}</Text>
        <Text fontSize="sm">{member?.phone}</Text>
      </Box>

      <Box bg="green.50" p={4} borderRadius="md">
        <Heading size="sm" mb={2}>
          Documents
        </Heading>
        <Text fontSize="sm">✓ Application Letter</Text>
        <Text fontSize="sm">✓ Letter of Non-Indebtedness</Text>
        <Text fontSize="sm">✓ Valid ID Card</Text>
        <Text fontSize="sm">✓ Proof of Income</Text>
        <Text fontSize="sm">✓ Bank Account Statement</Text>
        <Text fontSize="sm">✓ Utility Bill</Text>
        <Text fontSize="sm">✓ Guarantor's Letter</Text>
        <Text fontSize="sm">✓ Guarantor's Passport</Text>
        <Text fontSize="sm">✓ Personal Passport Photo</Text>
      </Box>
    </VStack>
  );

  const renderOTPVerification = () => (
    <VStack spacing={4} align="stretch">
      <Text textAlign="center">
        Enter the 6-digit OTP sent to your registered contact
      </Text>
      <FormControl isInvalid={!!otpError}>
        <Input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          textAlign="center"
          fontSize="2xl"
          letterSpacing="wide"
        />
        {otpError && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {otpError}
          </Text>
        )}
      </FormControl>
    </VStack>
  );

  const renderSuccess = () => (
    <Box textAlign="center" py={6}>
      <VStack spacing={6}>
        <Box color="green.500" fontSize="5xl">
          ✓
        </Box>
        <Heading size="md" color="blue.600">
          Loan Application Successful!
        </Heading>
        <Text fontSize="md">
          Your loan request of{" "}
          <strong>₦{formData.amount.toLocaleString()}</strong> has been
          received.
        </Text>
        <Text fontSize="sm">
          Reference: <strong>{loanReference}</strong>
        </Text>
        <Text color="gray.600" fontSize="sm">
          Your application is being processed. You'll receive updates via email
          and SMS.
        </Text>
      </VStack>
    </Box>
  );

  const stepContents = [
    renderLoanInfo(),
    renderMemberInfo(),
    renderDocumentUpload1(),
    renderDocumentUpload2(),
    renderDocumentUpload3(),
    renderSummary(),
    renderOTPVerification(),
    renderSuccess(),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={activeStep === 7 ? handleSuccessClose : handleClose}
      size="lg"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <Heading size="md">{steps[activeStep].title}</Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Step {activeStep + 1} of {steps.length}
          </Text>
        </ModalHeader>
        {activeStep !== 7 && <ModalCloseButton isDisabled={isSubmitting} />}

        <ModalBody pb={6}>{stepContents[activeStep]}</ModalBody>

        <ModalFooter>
          {activeStep === 7 ? (
            <Button colorScheme="blue" onClick={handleSuccessClose} w="full">
              Return to Dashboard
            </Button>
          ) : activeStep === 6 ? (
            <Button
              colorScheme="blue"
              onClick={handleVerifyOTP}
              isLoading={isSubmitting}
              isDisabled={!isStepValid()}
              w="full"
            >
              Verify OTP
            </Button>
          ) : (
            <>
              {activeStep > 0 && (
                <Button
                  mr={3}
                  onClick={prevStep}
                  isDisabled={isSubmitting}
                  variant="outline"
                >
                  Back
                </Button>
              )}
              <Button
                colorScheme="blue"
                onClick={nextStep}
                isLoading={isSubmitting}
                loadingText={
                  activeStep === 5 ? "Submitting..." : "Processing..."
                }
                isDisabled={!isStepValid()}
              >
                {activeStep === 5 ? "Submit Application" : "Continue"}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoanEnrollment;
