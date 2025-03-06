import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import prisma from '@/lib/prisma';
import { getUserId } from '@/utils/utils';
import { auth } from '@clerk/nextjs/server';

const ParentPage = async () => {
  // user id
  const userId = await getUserId();

  // students
  const students = await prisma.student.findMany({
    where: {
      parentId: userId!,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* left */}
      <div className="">
        {students.map(student => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              {/* title */}
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + ' ' + student.surname})
              </h1>
              {/* calendar */}
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
