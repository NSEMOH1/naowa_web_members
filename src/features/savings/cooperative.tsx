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
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { useState } from "react";
import successIcon from "../../assets/success.svg";
import { useSavingsBalance } from "../../hooks/useSavings";
import api from "../../api";

export default function NewCoopSavings() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const { balance } = useSavingsBalance();
  const [amount, setAmount] = useState("");

  const payload = {
    amount: amount,
  };
  const handleDone = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    try {
      await api.put("/api/savings/deduction", payload);
      setIsComplete(true);
      toast({ title: "Savings Adjusted", status: "success" });
    } catch (err) {
      console.error(err);
    }
  };

  if (isComplete) {
    return (
      <VStack
        className="shadow-lg"
        w="45vw"
        spacing={6}
        py={10}
        borderRadius={10}
        mt={6}
      >
        <Heading color="#0692DE" size="lg">
          Success!!!
        </Heading>
        <p className="text-[#0692DE]">Saving Adjusted WEF</p>
        <img width={200} src={successIcon} alt="success" />
        <Button bg="#60C77C" onClick={handleDone} mt={6} width="50%">
          Done
        </Button>
      </VStack>
    );
  }

  return (
    <div className="mt-7 w-[100vw] md:w-[61vw]">
      <Card>
        <CardBody>
          <p className="font-bold text-xl pb-2 text-[#60C77C] underline">
            Savings Adjustment
          </p>
          <FormControl mb={4}>
            <FormLabel fontStyle="sm" fontWeight="xs">
              Current Monthly Savings
            </FormLabel>
            <Input
              isDisabled
              placeholder={`₦ ${balance?.monthlyDeduction.toString()}`}
              type="text"
            />
          </FormControl>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            mb={4}
            placeholder="₦"
            type="number"
          />
          <Flex gap={4}>
            <Button
              variant="outline"
              onClick={() => navigate(routes.savings.index)}
            >
              Cancel
            </Button>
            <Button w="full" bg="#60C77C" color="white" onClick={handleSubmit}>
              Save
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </div>
  );
}
