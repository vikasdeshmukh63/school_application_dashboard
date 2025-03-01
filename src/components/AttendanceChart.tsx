"use client";

import Image from "next/image";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Mon",
    present: 60,
    absent: 40,
  },
  {
    name: "Tue",
    present: 70,
    absent: 30,
  },
  {
    name: "Wed",
    present: 80,
    absent: 20,
  },
  {
    name: "Thu",
    present: 90,
    absent: 10,
  },
  {
    name: "Fri",
    present: 100,
    absent: 0,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-xl h-full p-4">
      {/* title  */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance Chart</h1>
        <Image src="/moreDark.png" alt="moreDark" width={20} height={20} />
      </div>
      {/* chart  */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, borderColor: "lightgray", borderWidth: 1, borderStyle: "solid" }} />
          <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: 20, paddingBottom: 40 }} />
          <Bar dataKey="present" fill="#FAE27C" legendType="circle" radius={[10, 10, 0, 0]} />
          <Bar dataKey="absent" fill="#C3EBFA" legendType="circle" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
