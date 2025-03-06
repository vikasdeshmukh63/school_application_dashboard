import prisma from '@/lib/prisma';
import BigCalendar from './BigCalender';
import { adjustScheduleToCurrentWeek } from '@/utils/utils';

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: 'teacherId' | 'classId';
  id: string | number;
}) => {
  // get the lessons
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === 'teacherId' ? { teacherId: id as string } : { classId: id as number }),
    },
  });

  // get the data for the calendar
  const data = dataRes.map(lesson => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  // adjust the schedule to the current week
  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="h-full">
      {/* calendar */}
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
