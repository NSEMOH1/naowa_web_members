import { useState, useEffect } from "react";
import { Button, Input, Select, useToast, Spinner } from "@chakra-ui/react";
import { useMember } from "../../hooks/useMember";
import api from "../../api";
import type { Loan, PaymentData } from "../../lib/types";

const Payment = () => {
  const { member } = useMember();
  const toast = useToast();

  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentType: "",
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  useEffect(() => {
    if (paymentData.paymentType === "LOAN_REPAYMENT") {
      fetchActiveLoans();
    }
  }, [paymentData.paymentType]);

  const fetchActiveLoans = async () => {
    setLoadingLoans(true);
    try {
      const response = await api.get(`/api/loan/active`);
      setActiveLoans(response.data.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch active loans",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingLoans(false);
    }
  };


  const handleInputChange = (
    field: keyof PaymentData,
    value: string | number
  ) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    const basicValidation =
      paymentData.paymentType && paymentData.amount > 0 && member?.email;

    if (paymentData.paymentType === "LOAN_REPAYMENT") {
      return basicValidation && paymentData.loanId;
    }

    return basicValidation;
  };

  const handlePayment = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const response = await api.post(
        `/api/payments/initialize`,
        {
          paymentType: paymentData.paymentType,
          amount: paymentData.amount,
          loanId: paymentData.loanId,
        },
      );

      if (response.data.success) {
        const { reference, authorizationUrl } = response.data.data;
        window.location.href = authorizationUrl;
      }
    } catch (error: any) {
      toast({
        title: "Payment Initialization Failed",
        description:
          error.response?.data?.message || "Failed to initialize payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Make Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment with Paystack</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type *
            </label>
            <Select
              value={paymentData.paymentType}
              onChange={(e) => handleInputChange("paymentType", e.target.value)}
              placeholder="Select payment type"
            >
              <option value="LOAN_REPAYMENT">Loan Repayment</option>
              <option value="SAVINGS_DEPOSIT">Quick Savings Deposit</option>
            </Select>
          </div>

          {paymentData.paymentType === "LOAN_REPAYMENT" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loan *
              </label>
              {loadingLoans ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : activeLoans.length > 0 ? (
                <Select
                  value={paymentData.loanId}
                  onChange={(e) => handleInputChange("loanId", e.target.value)}
                  placeholder="Select loan to repay"
                >
                  {activeLoans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.reference} - ₦{Number(loan.approvedAmount).toLocaleString()}
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="text-sm text-gray-500 py-3 px-4 bg-gray-50 rounded">
                  No active loans found
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (NGN) *
            </label>
            <Input
              type="number"
              value={paymentData.amount || ""}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || 0)
              }
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Payment Type:</span>
              <span className="font-semibold capitalize">
                {paymentData.paymentType.replace("_", " ") || "Not selected"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">
                ₦{paymentData.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span className="text-green-600">
                ₦{paymentData.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            isDisabled={!isFormValid() || loading}
            isLoading={loading}
            colorScheme={isFormValid() ? "green" : "gray"}
            width="full"
            size="lg"
            className="mt-6"
          >
            {loading
              ? "Processing..."
              : isFormValid()
              ? "Pay Now"
              : "Fill all fields to proceed"}
          </Button>

          <p className="text-xs text-center text-gray-500 pt-4">
            🔒 Secured by Paystack
          </p>
        </form>
      </div>
    </div>
  );
};

export default Payment;
