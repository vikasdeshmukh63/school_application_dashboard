'use client';

import { ITEM_PER_PAGE } from '@/lib/settings';
import { useRouter } from 'next/navigation';

const Pagination = ({ count, page }: { count: number; page: number }) => {
  const router = useRouter();

  // changing page
  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // checking if there is a previous or next page
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hadNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      {/* prev  */}
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasPrev}
        onClick={() => {
          handleChangePage(page - 1);
        }}
      >
        Prev
      </button>
      {/* page number */}
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${page === pageIndex ? 'bg-customSky' : ''}`}
              onClick={() => handleChangePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      {/* next */}
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hadNext}
        onClick={() => {
          handleChangePage(page + 1);
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
