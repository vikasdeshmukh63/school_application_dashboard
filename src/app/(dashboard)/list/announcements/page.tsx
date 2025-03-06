import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserId, getUserRole } from '@/utils/utils';
import { Announcement, Class, Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

// announcement list type
type AnnouncementList = Announcement & {
  class: Class;
};

const renderRow = async (item: AnnouncementList) => {
  // user role
  const role = await getUserRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      {/* title */}
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      {/* class */}
      <td>{item.class?.name || '-'}</td>
      {/* date */}
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-IN').format(item.date)}</td>
      {/* actions */}
      <td>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const AnnouncementListPage = async ({
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
      header: 'Class',
      accessor: 'class',
    },
    {
      header: 'Date',
      accessor: 'date',
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
  const query: Prisma.AnnouncementWhereInput = {};

  // setting query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' };

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
    redirect(`/list/announcements?${newSearchParams.toString()}`);
  }

  // role conditions
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  // role conditions
  if (role !== 'admin') {
    query.OR = [
      { classId: null },
      {
        class: roleConditions[role as keyof typeof roleConditions] || {},
      },
    ];
  }

  // getting data
  const [data, count] = await prisma.$transaction([
    // get events
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    // get count
    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <ArrowUpWideNarrow className="h-6 w-6" />
            </button> */}
            {role === 'admin' && <FormContainer table="announcement" type="create" />}
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

export default AnnouncementListPage;
