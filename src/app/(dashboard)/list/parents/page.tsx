import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserRole } from '@/utils/utils';
import { Parent, Prisma, Student } from '@prisma/client';
import { redirect } from 'next/navigation';

// parent list type
type ParentList = Parent & {
  students: Student[];
};

const renderRow = async (item: ParentList) => {
  // user role
  const role = await getUserRole();
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      {/* info */}
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      {/* student names */}
      <td className="hidden md:table-cell">
        {item.students.map(student => student.name).join(',')}
      </td>
      {/* phone */}
      <td className="hidden md:table-cell">{item.phone}</td>
      {/* address */}
      <td className="hidden md:table-cell">{item.address}</td>
      {/* actions */}
      <td>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  // user role
  const role = await getUserRole();

  // columns
  const columns = [
    {
      header: 'Info',
      accessor: 'info',
    },
    {
      header: 'Student Names',
      accessor: 'students',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Phone',
      accessor: 'phone',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Address',
      accessor: 'address',
      className: 'hidden lg:table-cell',
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
  const query: Prisma.ParentWhereInput = {};

  // setting query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
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
    redirect(`/list/parents?${newSearchParams.toString()}`);
  }

  const [data, count] = await prisma.$transaction([
    // get teachers
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    // get count
    prisma.parent.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <ArrowUpWideNarrow className="h-6 w-6" />
            </button> */}
            {role === 'admin' && <FormContainer table="parent" type="create" />}
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

export default ParentListPage;
