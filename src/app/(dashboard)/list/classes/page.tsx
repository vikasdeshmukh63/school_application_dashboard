import FormContainer from '@/components/FormContainer';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { classesData, role } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserId, getUserRole } from '@/utils/utils';
import { Class, Grade, Prisma, Teacher } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';

type ClassList = Class & {
  supervisor: Teacher;
};

const renderRow = async (item: ClassList) => {
  const role = await getUserRole();
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.name[0]}</td>
      <td className="hidden md:table-cell">
        {item.supervisor.name + ' ' + item.supervisor.surname}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormContainer table="class" type="update" data={item} />
              <FormContainer table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const role = await getUserRole();
  const userId = await getUserId();

  const columns = [
    {
      header: 'Class Name',
      accessor: 'name',
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Grade',
      accessor: 'grade',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Supervisor',
      accessor: 'supervisor',
      className: 'hidden md:table-cell',
    },
    ...(role === 'admin'
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
  const query: Prisma.ClassWhereInput = {};

  // setting query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'supervisorId':
            query.supervisorId = value;
            break;

          case 'search':
            query.name = {
              contains: value,
              mode: 'insensitive',
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
    redirect(`/list/classes?${newSearchParams.toString()}`);
  }

  const [data, count] = await prisma.$transaction([
    // get teachers
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    // get count
    prisma.class.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <ArrowUpWideNarrow className="h-6 w-6" />
            </button> */}
            {role === 'admin' && <FormContainer table="class" type="create" />}
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

export default ClassListPage;
