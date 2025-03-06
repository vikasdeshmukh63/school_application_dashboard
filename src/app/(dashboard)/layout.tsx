import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-red-50 p-4">
        {/* logo*/}
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
          <span className="hidden lg:block font-bold">School</span>
        </Link>
        {/* menu */}
        <Menu />
      </div>

      {/* main content area */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        {/* navgar */}
        <Navbar />
        {/* pages */}
        {children}
      </div>
    </div>
  );
}
