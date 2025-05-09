import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserId, getUserRole } from '@/utils/utils';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

// result list type
type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
  examId?: number;
  assignmentId?: number;
  studentId?: number;
};

const renderRow = async (item: ResultList) => {
  // user role
  const role = await getUserRole();
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      {/* title */}
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      {/* student */}
      <td>{item.studentName + ' ' + item.studentName}</td>
      {/* score */}
      <td className="hidden md:table-cell">{item.score}</td>
      {/* teacher */}
      <td className="hidden md:table-cell">{item.teacherName + ' ' + item.teacherSurname}</td>
      {/* class */}
      <td className="hidden md:table-cell">{item.className}</td>
      {/* date */}
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat('en-IN').format(item.startTime)}
      </td>
      {/* actions */}
      <td>
        <div className="flex items-center gap-2">
          {(role === 'admin' || role === 'teacher') && (
            <>
              <FormContainer table="result" type="update" data={item} />
              <FormContainer table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  // user role
  const role = await getUserRole();
  // user id
  const userId = await getUserId();

  // columns
  const columns = [
    {
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Student',
      accessor: 'student',
    },
    {
      header: 'Score',
      accessor: 'score',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Teacher',
      accessor: 'teacher',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Class',
      accessor: 'class',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Date',
      accessor: 'date',
      className: 'hidden md:table-cell',
    },
    ...(role === 'admin' || role === 'teacher'
      ? [
          {
            header: 'Actions',
            accessor: 'action',
          },
        ]
      : []),
  ];

  // getting page from url
  const pageParams = searchParams?.page;

  // getting query params
  const queryParams = { ...searchParams };

  // removing page from query params
  delete queryParams?.page;

  // getting page
  const page = parseInt(pageParams || '1');

  // getting query
  const query: Prisma.ResultWhereInput = {};

  // setting query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value;
            break;
          case 'search':
            query.OR = [
              { exam: { title: { contains: value, mode: 'insensitive' } } },
              { student: { name: { contains: value, mode: 'insensitive' } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // redirecting if page is 0 or invalid
  if (page <= 0 || isNaN(page)) {
    const newSearchParams = new URLSearchParams(searchParams || {});
    newSearchParams.set('page', '1');
    redirect(`/list/results?${newSearchParams.toString()}`);
  }

  // role conditions
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { exam: { lesson: { teacherId: userId! } } },
        { assignment: { lesson: { teacherId: userId! } } },
      ];
      break;

    case 'student':
      query.studentId = userId!;
      break;

    case 'parent':
      query.student = {
        parentId: userId!,
      };
      break;
    default:
      break;
  }

  // getting data
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  // mapping data
  const data = dataRes.map(item => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = 'startTime' in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      examId: item.examId,
      assignmentId: item.assignmentId,
      studentId: item.studentId,
    };
  });
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <ArrowUpWideNarrow className="h-6 w-6" />
            </button> */}
            {(role === 'admin' || role === 'teacher') && (
              <FormContainer table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* pagination */}
      <Pagination count={count} page={page} />
    </div>
  );
};

export default ResultListPage;
