import prisma from '@/lib/prisma';

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  // get the attendance
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  // get the total days
  const totalDays = attendance.length;

  // get the present days
  const presentDays = attendance.filter(day => day.present).length;

  // get the percentage
  const percentage = (presentDays / totalDays) * 100;

  return (
    <div>
      <h1 className="text-xl font-semibold">{percentage || '-'}%</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
