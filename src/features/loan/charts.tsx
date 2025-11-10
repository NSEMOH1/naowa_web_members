import { Card, CardBody } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface LoanType {
    id: number;
    name: string;
    amount: string;
    collected: number;
}

interface HalfPieChartProps {
    loan: LoanType;
    color: string;
}

const renderGradient = (id: any) => {
    return (
        <defs>
            <linearGradient id={`colorGradient${id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0095D8" />
                <stop offset="100%" stopColor="#EDED1B" />
            </linearGradient>
        </defs>
    );
};

const TOTAL_AMOUNT = 5000000;

const HalfPieChart = ({ loan }: HalfPieChartProps) => {
    const chartData = [
        { name: 'collected', value: loan.amount },
        { name: 'remaining', value: TOTAL_AMOUNT - loan.collected }
    ];

    const percentValue = ((loan.collected / TOTAL_AMOUNT) * 100).toFixed(1);

    return (
        <div className="flex flex-col">
            <div className="mb-2">
                <p className="font-bold">{loan.name}</p>
                <p className="text-sm font-thin">{loan.amount.toLocaleString()}</p>
            </div>
            <div className="w-full h-[90px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {renderGradient(loan.id)}
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="90%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={65}
                            outerRadius={75}
                            paddingAngle={2}
                            dataKey="value"
                            labelLine={false}
                            label={false}
                        >
                            <Cell fill={`url(#colorGradient${loan.id})`} />
                            <Cell fill="#f5f5f5" />
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `₦${value.toLocaleString()}`,
                                name === 'collected' ? 'Collected' : 'Remaining'
                            ]}
                        />
                        <text
                            x="50%"
                            y="65%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-bold"
                            style={{ fontSize: '16px', fontWeight: 'bold' }}
                        >
                            {percentValue}%
                        </text>
                        <text
                            x="50%"
                            y="95%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ fontSize: '9px' }}
                        >
                            {loan.amount.toLocaleString()}
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

interface LoanHalfPieChartsProps {
    loanTypes: LoanType[];
}

export const LoanHalfPieCharts = ({ loanTypes }: LoanHalfPieChartsProps) => {
    if (!loanTypes || loanTypes.length === 0) {
        return <div>No loan data available</div>;
    }

    return (
        <div>
            <div className="flex gap-2 w-full mt-6 flex-col md:flex-row">
                {loanTypes.map((loan) => (
                    <Card key={loan.id} w='100%'>
                        <CardBody>
                            <HalfPieChart
                                loan={loan}
                                color=""
                            />
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};