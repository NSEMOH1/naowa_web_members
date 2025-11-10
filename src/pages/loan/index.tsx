import { Button, Card, CardBody } from "@chakra-ui/react";
import { Upload, ArrowDownToLine, RefreshCcw } from "lucide-react";
import { LoanHalfPieCharts } from "../../features/loan/charts";
import { category } from "../../features/loan/data";
import PaymentsComponent from "../../components/payments";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { useLoanBalances } from "../../hooks/useLoan";

const Loan = () => {
  const navigate = useNavigate();
  const { summary, chartData } = useLoanBalances();

  return (
    <div className="mb-8">
      <p
        className="text-[#0692DE] flex gap-2 items-center justify-end cursor-pointer"
        onClick={() => navigate(routes.loan.enrollment_status)}
      >
        <RefreshCcw />
        Check Loan Status
      </p>
      <div className="flex gap-8 mt-4 flex-col md:flex-row">
        <div className="flex-1">
          <div className="p-4 bg-[#128DC1] text-white rounded-2xl h-[150px]">
            <p className="pb-3">Total Loan Balance</p>
            <div>
              <p className="text-2xl font-bold">₦{summary.totalOutstanding}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p>Pending Payment</p>
                <p>₦0</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(routes.payments.index)}
                  size="sm"
                  bg="#BBDB43"
                  leftIcon={<Upload size={14} color="black" />}
                >
                  Pay Now
                </Button>
                <Button
                  onClick={() => navigate(routes.payments.index)}
                  color="white"
                  border="1px solid white"
                  bg="transparent"
                  size="sm"
                  leftIcon={<ArrowDownToLine size={14} color="white" />}
                >
                  Pay Off
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 hidden md:block">
          <PaymentsComponent />
        </div>
      </div>
      {/* <LoanHalfPieCharts
        loanTypes={chartData()
          .slice(0, 5)
          .map((item) => ({ ...item, id: Number(item.id) }))}
      /> */}
      <div className="pt-6">
        <p className="text-xl font-bold pb-2">Loan Category</p>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
          {category.map((data) => (
            <div key={data.id} className="pt-8">
              <p className="font-bold">{data.name}</p>
              <Card
                mt={4}
                className="h-full"
                onClick={() => {
                  if (data.name === "Regular Loan") {
                    navigate(routes.loan.enrollment);
                  }
                }}
                cursor="pointer"
              >
                <CardBody className="flex flex-col justify-center items-center">
                  <img src={data.icon} alt={data.name} />
                  <p className="font-bold" style={{ color: data.color }}>
                    {data.amount}
                  </p>
                  <p className="text-xs">
                    {data.name === "Regular Loan" ? (
                      <>{data?.interest} interest rate</>
                    ) : (
                      <></>
                    )}
                  </p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loan;
