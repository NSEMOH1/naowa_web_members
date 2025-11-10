import { useState } from "react";
import { PageHeader } from "../../../components/pageHeader";
import {
  Box,
  Button,
  Heading,
  Icon,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FolderUp } from "lucide-react";
import { routes } from "../../../lib/routes";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const UploadPayment = () => {
  const [isSuccess, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        setError("File size exceeds 3MB limit");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
        setError("Invalid file type. Only JPG and PNG are allowed");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("paymentDoc", file);

    try {
      await api.post("/api/payment-uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to upload file");
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (isSuccess) {
    return (
      <div className="flex justify-center">
        <VStack spacing={6} textAlign="center" py={10} w="50vw">
          <Heading size="md" color="#0692DE">
            Request Submitted
          </Heading>
          <Text color="#0692DE">
            We will notify you as soon as your request is approved
          </Text>
          <Image width={200} src="/src/assets/success.svg" alt="Success" />
          <Button
            colorScheme="blue"
            onClick={() => navigate(routes.loan.index)}
            mt={6}
            w="full"
          >
            Continue
          </Button>
        </VStack>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Upload Payment"
        showSearch={false}
        showBreadcrumb={false}
      />
      <div className="flex justify-center">
        <div className="md:w-[50vw] w-[100vw]">
          <Box>
            <VStack
              spacing={3}
              bg="white"
              _hover={{
                borderColor: "blue.500",
                bg: "blue.50",
                boxShadow: "sm",
              }}
              _focusWithin={{
                borderColor: "blue.500",
                boxShadow: "outline",
              }}
              p={6}
              textAlign="center"
              cursor="pointer"
              transition="all 0.3s"
              as="label"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
            >
              <Icon as={FolderUp} boxSize={8} color="gray.500" />
              <Text
                fontSize="md"
                fontWeight="medium"
                color="gray.600"
                _hover={{ color: "blue.500" }}
              >
                Click to upload Payment Image
              </Text>
              <Text fontSize="xs" color="gray.400">
                Supports JPG, PNG (Max 3MB)
              </Text>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </VStack>
            {previewUrl && (
              <Box mt={4} textAlign="center">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Preview:
                </Text>
                <Image
                  src={previewUrl}
                  alt="Payment preview"
                  maxW="300px"
                  maxH="300px"
                  objectFit="contain"
                  borderRadius="md"
                  boxShadow="sm"
                />
                <Button
                  size="sm"
                  mt={2}
                  colorScheme="gray"
                  onClick={handleReset}
                >
                  Remove
                </Button>
              </Box>
            )}
            {error && (
              <Text color="red.500" mt={2} fontSize="sm">
                {error}
              </Text>
            )}
          </Box>
          <Button
            colorScheme="blue"
            w="full"
            mt={6}
            onClick={handleUpload}
            isDisabled={!file}
          >
            Upload Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPayment;
