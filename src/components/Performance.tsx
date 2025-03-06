'use client';

import { Ellipsis } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 92, fill: '#C3EBFA' },
  { name: 'Group B', value: 8, fill: '#FAE27C' },
];

const Performance = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      {/* title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Ellipsis className="h-6 w-6" />
      </div>
      {/* chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      {/* bottom */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">9.2</h1>
        <p className="text-xs text-gray-300">of 10 max LTS</p>
      </div>
      {/* term */}
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        1st Term - 2nd Term
      </h2>
    </div>
  );
};

export default Performance;
