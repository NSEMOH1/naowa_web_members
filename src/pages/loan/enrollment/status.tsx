import { Button } from "@chakra-ui/react";
import { PageHeader } from "../../../components/pageHeader";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";

type Status = 'success' | 'processing' | 'failed';

const steps = [
    "Personal Information",
    "Overdraft Information",
    "Processing Overdraft",
    "Disburse Overdraft"
];

const LoanEnrollmentStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const status: Status = location.state?.status || 'processing';

    return (
        <div>
            <PageHeader title="Loan Enrollment" />
            <div className="w-full mx-auto px-4 py-8 bg-[#D3E8EB] rounded-lg">
                <div className="flex justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                        <div
                            className={`h-full bg-[#0992DC] transition-all duration-500 ${status === 'success' ? 'w-full' :
                                status === 'processing' ? 'w-2/3' :
                                    'w-full'
                                } ${status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}
                        ></div>
                    </div>

                    {steps.map((step, index) => {
                        const isCompleted =
                            status === 'success' ? true :
                                status === 'processing' ? index < 2 :
                                    true;

                        const isCurrent =
                            status === 'success' ? index === 3 :
                                status === 'processing' ? index === 2 :
                                    false; 

                        return (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                    ? isCurrent
                                        ? 'bg-blue-100 border-2 border-[#0992DC]'
                                        : 'bg-[#0992DC]'
                                    : 'bg-gray-200'
                                    } ${status === 'failed' && isCompleted ? 'bg-red-500' : ''}`}>
                                    {isCompleted ? (
                                        isCurrent ? (
                                            <Clock className="text-[#0992DC]" size={20} />
                                        ) : (
                                            <CheckCircle className="text-white" size={20} />
                                        )
                                    ) : (
                                        <span className="text-gray-600">{index + 1}</span>
                                    )}
                                    {status === 'failed' && index === 3 && (
                                        <XCircle className="text-white" size={20} />
                                    )}
                                </div>
                                <span className={`text-sm mt-2 text-center ${isCurrent ? 'font-bold text-[#0992DC]' : 'text-gray-600'
                                    } ${status === 'failed' && index === 3 ? 'text-red-500 font-bold' : ''}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full mx-auto px-4 py-8">
                {status === 'success' && (
                    <div className="text-center p-8 border border-green-200 bg-green-50 rounded-lg h-[40vh]">
                        <CheckCircle className="mx-auto text-green-500" size={48} />
                        <p className="text-2xl font-bold mt-4 text-green-700 pt-4">Loan Approved</p>
                        <p className="pt-10 text-gray-600">
                            Dear Customer your Loan Request
                            will be Disbursed in 72hrs
                        </p>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="text-center p-8 border border-blue-200 bg-blue-50 rounded-lg h-[40vh]">
                        <Clock className="mx-auto text-[#0992DC]" size={48} />
                        <p className="text-2xl font-bold mt-4 text-[#0992DC]">Processing Your Loan</p>
                        <p className="text-gray-600 pt-10">
                            We are currently processing you loan, please check back
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center p-8 border border-red-200 bg-red-50 rounded-lg h-[40vh]">
                        <XCircle className="mx-auto text-red-500" size={48} />
                        <p className="text-2xl font-bold pt-4 text-red-700">Overdraft Processing Failed</p>
                        <p className="pt-2 text-gray-600">
                            Sorry you are ineligible to enrol for a Loan, We will
                            notify you once you are eligible
                        </p>
                        <Button w='md' colorScheme="blue" mt={6} onClick={() => navigate(routes.loan.index)}>
                            Okay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanEnrollmentStatus;