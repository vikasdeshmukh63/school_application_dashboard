import prisma from '@/lib/prisma';
import { Ellipsis } from 'lucide-react';
import AttendanceChart from './AttendanceChart';

const AttendanceChartContainer = async () => {
  // get today's date
  const today = new Date();

  // get the day of the week
  const dayOfWeek = today.getDay();

  // get the number of days since Monday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // get the date of the last Monday
  const lastMonday = new Date(today);

  // set the date of the last Monday
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  // get the attendance data
  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  // get the days of the week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const attendanceMap: { [key: string]: { present: number; absent: number } } = {
    Mon: { present: 0, absent: 0 },
    Tue: { present: 0, absent: 0 },
    Wed: { present: 0, absent: 0 },
    Thu: { present: 0, absent: 0 },
    Fri: { present: 0, absent: 0 },
  };

  // loop through the attendance data
  resData.forEach(item => {
    // get the date of the attendance
    const itemDate = new Date(item.date);

    // get the day of the week
    const dayOfWeek = itemDate.getDay();

    // check if the day of the week is between 1 and 5
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // get the name of the day
      const dayName = daysOfWeek[dayOfWeek - 1];

      // check if the attendance is present
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  // get the data for the chart
  const data = daysOfWeek.map(day => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      {/* title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Ellipsis className="h-6 w-6" />
      </div>
      {/* chart */}
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
