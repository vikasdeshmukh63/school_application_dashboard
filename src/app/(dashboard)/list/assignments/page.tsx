import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserId, getUserRole } from '@/utils/utils';
import { Assignment, Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client';
import { redirect } from 'next/navigation';

// assignment list type
type AssignmentList = Assignment & {
  lesson: Lesson & {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const renderRow = async (item: AssignmentList) => {
  // user role
  const role = await getUserRole();
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      {/* subject name */}
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      {/* class */}
      <td>{item.lesson.class.name}</td>
      {/* teacher */}
      <td className="hidden md:table-cell">
        {item.lesson.teacher.name + ' ' + item.lesson.teacher.surname}
      </td>
      {/* due date */}
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat('en-IN').format(item.dueDate)}
      </td>
      {/* actions */}
      <td>
        <div className="flex items-center gap-2">
          {(role === 'admin' || role === 'teacher') && (
            <>
              <FormContainer table="assignment" type="update" data={item} />
              <FormContainer table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const AssignmentListPage = async ({
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
      header: 'Subject Name',
      accessor: 'name',
    },
    {
      header: 'Class',
      accessor: 'class',
    },
    {
      header: 'Teacher',
      accessor: 'teacher',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
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
  const query: Prisma.AssignmentWhereInput = {};

  // setting query params
  query.lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson.classId = parseInt(value);
            break;
          case 'teacherId':
            query.lesson.teacherId = value;
            break;
          case 'search':
            query.lesson.subject = {
              name: { contains: value, mode: 'insensitive' },
            };
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
    redirect(`/list/assignments?${newSearchParams.toString()}`);
  }

  // role conditions
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.lesson.teacherId = userId!;
      break;
    case 'student':
      query.lesson.class = {
        students: {
          some: {
            id: userId!,
          },
        },
      };
      break;
    case 'parent':
      query.lesson.class = {
        students: {
          some: {
            parentId: userId!,
          },
        },
      };
      break;
    default:
      break;
  }

  // getting data
  const [data, count] = await prisma.$transaction([
    // get teachers
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    // get count
    prisma.assignment.count({
      where: query,
    }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
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
              <FormContainer table="assignment" type="create" />
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

export default AssignmentListPage;
