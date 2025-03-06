'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    params.set('search', value);

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center justify-between gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <Search className="h-4 w-4" />
      <input placeholder="search..." className="w-[200px] p-2 bg-transparent outline-none" />
    </form>
  );
};

export default TableSearch;
