import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import FormContainer from '@/components/FormContainer';
import Performance from '@/components/Performance';
import StudentAttendanceCard from '@/components/StudentAttendanceCard';
import prisma from '@/lib/prisma';
import { getUserRole } from '@/utils/utils';
import { Class, Student } from '@prisma/client';
import { CalendarDays, HeartPulse, MailCheck, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const StudentDetails = async ({ params }: { params: { id: string } }) => {
  // user role
  const role = await getUserRole();

  // student
  const student: (Student & { class: Class & { _count: { lessons: number } } }) | null =
    await prisma.student.findUnique({
      where: {
        id: params.id,
      },
      include: {
        class: {
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
    });

  // if not found
  if (!student) {
    return notFound();
  }

  // rendering
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* top  */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* user info card  */}
          <div className="bg-customSky py-6 px-4 rounded-md flex-1 flex gap-4">
            {/* user photo */}
            <div className="w-1/3">
              <Image
                src={student.img || '/noAvatar.png'}
                alt="user"
                width={144}
                height={144}
                className="rounded-full w-36 h-36 object-cover"
              />
            </div>
            {/* user info */}
            <div className="w-2/3 flex flex-col justify-between gap-4">
              {/* name */}
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{`${student.name} ${student.surname}`}</h1>
                {role === 'admin' && <FormContainer table="student" type="update" data={student} />}
              </div>
              {/* description */}
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, eom architecto vel.
              </p>
              {/* info */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                {/* blood type */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  <span>{student.bloodType}</span>
                </div>
                {/* birthday */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Intl.DateTimeFormat('en-IN').format(student.birthday)}</span>
                </div>
                {/* email */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MailCheck className="h-4 w-4" />
                  <span>{student.email || '-'}</span>
                </div>
                {/* phone */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small cards */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* card 1 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              <Image
                src="/singleAttendance.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>
            {/* card 2 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              <Image
                src="/singleBranch.png"
                alt="singleBranch"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* grade */}
              <div>
                <h1 className="text-xl font-semibold">{student.class.name.charAt(0)}th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* card 3 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              <Image
                src="/singleLesson.png"
                alt="singleLessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* lessons */}
              <div>
                <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* card 4 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              <Image
                src="/singleClass.png"
                alt="singleClass"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* class */}
              <div>
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          {/* title */}
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          {/* shortcuts */}
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {/* lessons */}
            <Link className="p-3 rounded-md bg-customSkyLight" href="/list/lessons?classId==2">
              Student&apos;s Lessons
            </Link>
            {/* teachers */}
            <Link className="p-3 rounded-md bg-customPurpleLight" href="/list/teachers?classId=2">
              Student&apos;s Teachers
            </Link>
            {/* exams */}
            <Link className="p-3 rounded-md bg-pink-50" href="/list/exams?classId=2/">
              Student&apos;s Exams
            </Link>
            {/* assignments */}
            <Link className="p-3 rounded-md bg-customSkyLight" href="/list/assignments?classId=2">
              Student&apos;s Assignments
            </Link>
            {/* results */}
            <Link
              className="p-3 rounded-md bg-customYellowLight"
              href="/list/results?studentId=student1"
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        {/* performance */}
        <Performance />
        {/* announcements */}
        <Announcements />
      </div>
    </div>
  );
};

export default StudentDetails;
