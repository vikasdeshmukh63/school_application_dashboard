import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import FormContainer from '@/components/FormContainer';
import Performance from '@/components/Performance';
import prisma from '@/lib/prisma';
import { getUserRole } from '@/utils/utils';
import { Teacher } from '@prisma/client';
import { CalendarDays, HeartPulse, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TeacherDetails = async ({ params }: { params: { id: string } }) => {
  // user role
  const role = await getUserRole();

  // teacher
  const teacher:
    | (Teacher & { _count: { subjects: number; lessons: number; classes: number } })
    | null = await prisma.teacher.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  // if not found
  if (!teacher) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* top  */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* user info card  */}
          <div className="bg-customSky py-6 px-4 rounded-md flex-1 flex gap-4">
            {/* image */}
            <div className="w-1/3">
              <Image
                src={teacher.img || '/noAvatar.png'}
                alt="user"
                width={144}
                height={144}
                className="rounded-full w-36 h-36 object-cover"
              />
            </div>
            {/* info */}
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* name */}
                <h1 className="text-xl font-semibold">{`${teacher.name} ${teacher.surname}`}</h1>
                {role === 'admin' && <FormContainer table="teacher" type="update" data={teacher} />}
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
                  <span>{teacher.bloodType}</span>
                </div>
                {/* birthday */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(
                      new Date(teacher.birthday)
                    )}
                  </span>
                </div>
                {/* email */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span> {teacher.email || '-'}</span>
                </div>
                {/* phone */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span> {teacher.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small cards */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* card 1 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              {/* image */}
              <Image
                src="/singleAttendance.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* info */}
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* card 2 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              {/* image */}
              <Image
                src="/singleBranch.png"
                alt="singleBranch"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* info */}
              <div>
                <h1 className="text-xl font-semibold">{teacher._count.subjects}</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* card 3 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              {/* image */}
              <Image
                src="/singleLesson.png"
                alt="singleLessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* info */}
              <div>
                <h1 className="text-xl font-semibold">{teacher._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* card 4 */}
            <div className="bg-white w-full rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4">
              {/* image */}
              <Image
                src="/singleClass.png"
                alt="singleClass"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* info */}
              <div>
                <h1 className="text-xl font-semibold">{teacher._count.classes}</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          {/* title */}
          <h1 className="text-xl font-semibold">Teacher&apos;s Schedule</h1>
          {/* calendar */}
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          {/* title */}
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          {/* shortcuts */}
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {/* classes */}
            <Link
              className="p-3 rounded-md bg-customSkyLight"
              href="/list/classes?supervisorId=teacher2"
            >
              Teacher&apos;s Classes
            </Link>
            {/* students */}
            <Link
              className="p-3 rounded-md bg-customPurpleLight"
              href="/list/students?teacherId=teacher2"
            >
              Teacher&apos;s Students
            </Link>
            {/* lessons */}
            <Link
              className="p-3 rounded-md bg-customYellowLight"
              href="/list/lessons?teacherId=teacher2"
            >
              Teacher&apos;s Lessons
            </Link>
            {/* exams */}
            <Link className="p-3 rounded-md bg-pink-50" href="/list/exams?teacherId=teacher2">
              Teacher&apos;s Exams
            </Link>
            {/* assignments */}
            <Link
              className="p-3 rounded-md bg-customSkyLight"
              href="/list/assignments?teacherId=teacher2"
            >
              Teacher&apos;s Assignments
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

export default TeacherDetails;
