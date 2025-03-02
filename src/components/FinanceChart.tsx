'use client';

import Image from 'next/image';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Feb',
    income: 4000,
    expense: 3311,
  },
  {
    name: 'Mar',
    income: 2555,
    expense: 6666,
  },
  {
    name: 'Apr',
    income: 1000,
    expense: 6444,
  },
  {
    name: 'May',
    income: 7433,
    expense: 3444,
  },
  {
    name: 'Jun',
    income: 1345,
    expense: 5833,
  },
  {
    name: 'Jul',
    income: 3362,
    expense: 6788,
  },
  {
    name: 'Aug',
    income: 9564,
    expense: 4444,
  },
  {
    name: 'Sep',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Oct',
    income: 4544,
    expense: 6334,
  },
  {
    name: 'Nov',
    income: 3333,
    expense: 2222,
  },
  {
    name: 'Dec',
    income: 5333,
    expense: 5424,
  },
];

const FinanceChart = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl p-4">
      {/* title  */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance Chart</h1>
        <Image src="/moreDark.png" alt="moreDark" width={20} height={20} />
      </div>
      {/* chart  */}

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#d1d5db' }}
            tickMargin={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#d1d5db' }} />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              borderColor: 'lightgray',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: 10, paddingBottom: 30 }}
          />
          <Line type="monotone" dataKey="income" stroke="#C3EBFA" strokeWidth={5} />
          <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
