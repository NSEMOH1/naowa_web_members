import { Button, Card, CardBody, Input } from "@chakra-ui/react";
import { Upload, TrendingUp, Send, ArrowRight, HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { useSavingsBalance } from "../../hooks/useSavings";
import { useLoanBalances } from "../../hooks/useLoan";
import PaymentsComponent from "../../components/payments";
import { useMember } from "../../hooks/useMember";

const Dashboard = () => {
  const navigate = useNavigate();
  const { balance } = useSavingsBalance();
  const { summary } = useLoanBalances();
  const { getCollectedAmount } = useLoanBalances();
  const { member } = useMember();

  return (
    <div className="w-full gap-4 mt-4">
      <p className="pb-8 font-bold text-xl">Hello {member?.full_name} 👋</p>
      <div>
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="p-4 shadow-lg bg-center text-white bg-[black] rounded-2xl h-[130px] w-full">
                <p className="pb-10 font-bold">Total Savings Balance</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">₦{balance?.totalSavings}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      leftIcon={<Upload size={14} color="black" />}
                      onClick={() => navigate(routes.payments.index)}
                    >
                      Deposit
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 text-white bg-[#982323] rounded-2xl h-[130px] w-full">
                <p className="pb-10 font-bold">Total Loan Balance</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">
                    ₦{summary.totalOutstanding.toString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      border="1px solid white"
                      bg="transparent"
                      color="white"
                      size="sm"
                      leftIcon={<Upload size={14} color="white" />}
                      onClick={() => navigate(routes.payments.index)}
                    >
                      Pay Off
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 hidden md:block">
                <PaymentsComponent />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-bold text-xl">Loan Categories</p>
              <div className="flex mt-2 flex-col gap-4 md:flex-row">
                <div
                  style={{ background: "#060402" }}
                  className="p-4 py-6 text-white w-full rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">Regular Loan</p>
                    <div
                      style={{
                        background: "#060402",
                        border: "1px solid gray",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <TrendingUp color="white" />
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    ₦{getCollectedAmount("REGULAR")}
                  </p>
                </div>
                <div
                  style={{ background: "#065535" }}
                  className="p-4 py-6 text-white w-full rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">Emergency Loan</p>
                    <div
                      style={{
                        background: "#065535",
                        border: "1px solid gray",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <TrendingUp color="white" />
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    <p className="text-lg font-bold">COMING SOON</p>
                  </p>
                </div>
                <div
                  style={{ background: "#000080" }}
                  className="p-4 py-6 text-white w-full rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">Commodity Loan</p>
                    <div
                      style={{
                        background: "#000080",
                        border: "1px solid gray",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <TrendingUp color="white" />
                    </div>
                  </div>
                  <p className="text-lg font-bold">COMING SOON</p>
                </div>
                <div
                  style={{ background: "#daa520" }}
                  className="p-4 py-6 text-white w-full rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">Housing Loan</p>
                    <div
                      style={{
                        background: "#daa520",
                        border: "1px solid gray",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <TrendingUp color="white" />
                    </div>
                  </div>
                  <p className="text-lg font-bold">COMING SOON</p>
                </div>
                <div
                  style={{ background: "#66cccc" }}
                  className="p-4 py-6 text-white w-full rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">Home Appliances</p>
                    <div
                      style={{
                        background: "#66cccc",
                        border: "1px solid gray",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <TrendingUp color="white" />
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    <p className="text-lg font-bold">COMING SOON</p>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-16 flex gap-6 flex-col md:flex-row">
              <Card width="full">
                <CardBody>
                  <p className="flex gap-2 text-sm font-thin items-center">
                    <Send color="#982323" size={15} />
                    Transfer
                  </p>
                  <div className="flex gap-2 items-center">
                    <Input
                      mt={2}
                      fontWeight="thin"
                      placeholder="2387809074343034"
                    />
                    <div
                      style={{
                        background: "#982323",
                        border: "1px solid white",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <ArrowRight color="white" />
                    </div>
                  </div>
                  <p className="text-xs font-thin pt-2">
                    Visa or MasterCard of any Poland Bank
                  </p>
                </CardBody>
              </Card>
              <Card width="full">
                <CardBody>
                  <p className="flex gap-2 text-sm font-thin items-center">
                    <HandCoins color="#982323" size={15} />
                    Deposit
                  </p>
                  <div className="flex gap-2 items-center">
                    <Input
                      mt={2}
                      fontWeight="thin"
                      placeholder="2387809074343034"
                    />
                    <div
                      style={{
                        background: "#982323",
                        border: "1px solid white",
                      }}
                      className={`inline-flex p-1 rounded-full`}
                    >
                      <ArrowRight color="white" />
                    </div>
                  </div>
                  <p className="text-xs font-thin pt-2">
                    Visa or MasterCard of any Poland Bank
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        {/* <div className="flex gap-2 w-full flex-col md:flex-row">
          <Card mt={14} background="#FFFAFA" className="flex-1">
            <CardBody>
              <Flex direction="row" align="center" justify="space-between">
                <Box width={["100%", "50%"]} textAlign="left">
                  <p className="font-bold text-2xl pb-3 pt-8">
                    Cashback up to 60% 🎁{" "}
                  </p>
                  <p className="text-xs pb-10">
                    Redesign concept for online bank mBank. This is online
                    service that allows you to pay bills for a variety of goods
                    and services using your personal device.
                  </p>
                  <Button bg="black" color="white">
                    Apply Now
                  </Button>
                </Box>
                <div className="hidden md:block">
                  <img src={productImg} alt="" />
                </div>
              </Flex>
            </CardBody>
          </Card>
          <div className="flex-shrink-0 mt-4">
            <DashboardWithrawal />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
