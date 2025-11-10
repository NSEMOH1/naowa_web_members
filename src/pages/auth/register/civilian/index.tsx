import { useState } from "react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  useSteps,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Logo } from "../../../../components/icons/logo";
import { EnterInfo } from "../../../../features/auth/register/civilian/info";
import { CreateProfile } from "../../../../features/auth/register/civilian/next-of-kin";
import { UploadDocument } from "../../../../features/auth/register/civilian/document";
import { SecurityQuestions } from "../../../../features/auth/register/civilian/security-questions";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../lib/routes";
import { Guarantor } from "../../../../features/auth/register/civilian/guarantor";
import api from "../../../../api";
import type { CivilianRegistrationData } from "../../../../lib/types";
import { PreviewStep } from "../../../../features/auth/register/civilian/preview";

const steps = [
  { title: "Enter Info", description: "Basic details" },
  { title: "Next Of Kin", description: "Next Of Kin Details" },
  { title: "Guarantor", description: "Guarantor Details" },
  { title: "Upload Documents", description: "Credentials" },
  { title: "Security Questions", description: "Enhanced Security" },
  { title: "Review", description: "Confirm details" },
];

const SuccessPage = ({ onContinue }: { onContinue: () => void }) => (
  <VStack spacing={6} textAlign="center" py={10}>
    <Heading size="md" color="#0692DE">
      Registration Successful!
    </Heading>
    <Text color="#0692DE">Your account has been created successfully.</Text>
    <img width={200} src="/src/assets/success.svg" alt="success" />
    <Button colorScheme="blue" onClick={onContinue} mt={6} w="full">
      Login →
    </Button>
  </VStack>
);

const CivilianRegisteration = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<any>({});
  const [nextOfKinInfo, setNextOfKinInfo] = useState<any>({});
  const [guarantorInfo, setGuarantorInfo] = useState<any>({});
  const [documents, setDocuments] = useState<any>({});
  const [securityInfo, setSecurityInfo] = useState<any>({});

  useSteps({
    index: activeStep,
    count: steps.length,
  });

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const payload: CivilianRegistrationData = {
        email: personalInfo.email,
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        other_name: personalInfo.other_name,
        gender: personalInfo.gender,
        phone: personalInfo.phone_number,
        address: personalInfo.address,
        state_of_origin: personalInfo.state_of_origin,
        lga: personalInfo.lga,
        date_of_birth: new Date(personalInfo.date_of_birth),
        type: "CIVILIAN",
        title: personalInfo.title,
        pin: personalInfo.pin,
        monthlyDeduction: Number(personalInfo.monthlyDeduction) || 0,
        bank: {
          name: personalInfo.bank_name,
          account_number: personalInfo.account_number,
        },
        profile_picture: documents.picture || "",
        kycInfo: {
          identification: documents.personnelId || "",
          id_card: documents.validId || "",
          signature: documents.signature || "",
        },
        nextOfKin: {
          first_name: nextOfKinInfo.first_name,
          last_name: nextOfKinInfo.last_name,
          relationship: nextOfKinInfo.relationship,
          phone: nextOfKinInfo.phone,
          email: nextOfKinInfo.email,
          address: nextOfKinInfo.address,
          nationality: nextOfKinInfo.nationality,
          gender: nextOfKinInfo.gender,
          title: nextOfKinInfo.title,
        },
        guarantors: [
          {
            first_name: guarantorInfo.first_name,
            other_name: guarantorInfo.other_name,
            surname: guarantorInfo.last_name,
            nationality: guarantorInfo.nationality,
            address: guarantorInfo.address,
            gender: guarantorInfo.gender,
            phone: guarantorInfo.phone_number,
            email: guarantorInfo.email,
            rank: guarantorInfo.rank,
            state_of_origin: guarantorInfo.state_of_origin,
            lga: guarantorInfo.lga,
            unit: guarantorInfo.unit,
            service_number: guarantorInfo.service_number,
            date_of_birth: new Date(guarantorInfo.date_of_birth),
            relationship: guarantorInfo.relationship,
            title: guarantorInfo.title,
          },
        ],
        security: {
          question: securityInfo.question,
          answer: securityInfo.answer,
        },
      };

      console.log(payload);

      formData.append("data", JSON.stringify(payload));
      if (documents.picture)
        formData.append("profile_picture", documents.picture);
      if (documents.validId)
        formData.append("identification", documents.validId);
      if (documents.personnelId)
        formData.append("id_card", documents.personnelId);
      if (documents.signature)
        formData.append("signature", documents.signature);

      await api.post("/api/auth/member/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Final payload:", payload);

      await api.post("/api/auth/member/register", payload);

      setIsComplete(true);

      toast({
        title: "Registration successful",
        status: "success",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "An unknown error occurred",
        status: "error",
      });
    }
  };

  const StepForms = [
    <Box key={0} p={6} rounded="md">
      <EnterInfo
        onFormDataChange={setPersonalInfo}
        onValidationChange={setIsFormValid}
        initialData={personalInfo}
      />
    </Box>,

    <Box key={1} p={6} rounded="md">
      <CreateProfile
        onFormDataChange={setNextOfKinInfo}
        onValidationChange={setIsFormValid}
        initialData={nextOfKinInfo}
      />
    </Box>,

    <Box key={2} p={6} rounded="md">
      <Guarantor
        onFormDataChange={setGuarantorInfo}
        onValidationChange={setIsFormValid}
        initialData={guarantorInfo}
      />
    </Box>,

    <Box key={3} p={6} rounded="md">
      <UploadDocument
        onDocumentsChange={setDocuments}
        onValidationChange={setIsFormValid}
        initialData={documents}
      />
    </Box>,

    <Box key={4} p={6} rounded="md">
      <SecurityQuestions
        onSecurityDataChange={setSecurityInfo}
        initialData={securityInfo}
      />
    </Box>,

    <Box key={5} p={6} rounded="md">
      <PreviewStep
        personalInfo={personalInfo}
        nextOfKinInfo={nextOfKinInfo}
        documents={documents}
        securityInfo={securityInfo}
        guarantorInfo={guarantorInfo}
      />
    </Box>,
  ];

  if (isComplete) {
    return (
      <div
        className="min-h-screen w-full bg-[url('/src/assets/success-bg.svg')] bg-cover bg-no-repeat bg-center flex justify-end"
        style={{
          backgroundAttachment: "fixed",
          overflow: "hidden",
        }}
      >
        <div className="container w-[50vw] px-4 py-8">
          <Flex justify="center" mb={6}>
            <Logo showText={false} />
          </Flex>
          <Box bg="whiteAlpha.800" p={6} rounded="lg" backdropFilter="blur(0)">
            <SuccessPage onContinue={() => navigate(routes.index)} />
          </Box>
        </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen w-full relative flex flex-col justify-center items-center">
      <div
        className="absolute inset-0 bg-[url('/src/assets/register-bg.svg')] bg-cover bg-no-repeat bg-center"
        style={{
          position: "fixed",
          zIndex: -1,
          width: "100vw",
          height: "100vh",
        }}
      />
      <div className="container w-[90vw] sm:w-[60vw] px-4 py-8">
        <Flex justify="center" mb={6}>
          <Logo showText={false} />
        </Flex>
        <Box bg="whiteAlpha.800" p={6} rounded="lg" backdropFilter="blur(0)">
          <div className="hidden md:block">
            <Stepper index={activeStep} mb={8}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle fontSize={13}>{step.title}</StepTitle>
                    <StepDescription fontSize={11}>
                      {step.description}
                    </StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </div>

          <Box
            flexGrow={1}
            overflowY="auto"
            className="custom-scrollbar"
            pr={2}
          >
            {StepForms[activeStep]}
          </Box>

          <Flex justify="space-between" mt={8} gap={2}>
            {activeStep > 0 && (
              <Button onClick={() => setActiveStep((prev) => prev - 1)}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                bg="#109CF1"
                onClick={() => setActiveStep((prev) => prev + 1)}
                ml="auto"
                width="full"
                isDisabled={!isFormValid}
                opacity={!isFormValid ? 0.6 : 1}
              >
                Next →
              </Button>
            ) : (
              <Button
                bg="#109CF1"
                onClick={handleSubmit}
                width="full"
                isDisabled={!isFormValid}
                opacity={!isFormValid ? 0.6 : 1}
              >
                Submit →
              </Button>
            )}
          </Flex>
        </Box>
      </div>
    </div>
  );
};

export default CivilianRegisteration;
