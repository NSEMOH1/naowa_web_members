import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast, Spinner } from "@chakra-ui/react";
import api from "../../api";
import { routes } from "../../lib/routes";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      toast({
        title: "Invalid Payment",
        description: "No payment reference found",
        status: "error",
        duration: 5000,
      });
      navigate(routes.payments.index);
      return;
    }

    verifyPayment(reference);
  }, []);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await api.get(`/api/payments/verify/${reference}`);

      if (response.data.success) {
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully",
          status: "success",
          duration: 5000,
        });

        setTimeout(() => {
          if (response.data.data.transaction.type === "SAVINGS_DEPOSIT") {
            navigate(routes.savings.index);
          } else {
            navigate(routes.loan.index);
          }
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Payment Verification Failed",
        description:
          error.response?.data?.message || "Failed to verify payment",
        status: "error",
        duration: 5000,
      });
      navigate(routes.payments.index);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Spinner size="xl" color="green.500" className="mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentVerification;
