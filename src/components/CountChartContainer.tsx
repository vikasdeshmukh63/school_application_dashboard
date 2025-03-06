import Image from 'next/image';
import CountChart from './CountChart';
import prisma from '@/lib/prisma';
import { Ellipsis } from 'lucide-react';

const CountChartContainer = async () => {
  // get the students
  const data = await prisma.student.groupBy({
    by: ['gender'],
    _count: true,
  });

  // get the number of boys and girls
  const boys = data.find(d => d.gender === 'MALE')?._count || 0;
  const girls = data.find(d => d.gender === 'FEMALE')?._count || 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Ellipsis className="h-6 w-6" />
      </div>
      {/* chart */}
      <CountChart boys={boys} girls={girls} />
      {/* bottom */}
      <div className="flex justify-center gap-16">
        {/* boys */}
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-customSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((boys / (boys + girls)) * 100)}%)
          </h2>
        </div>
        {/* girls */}
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-customYellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
