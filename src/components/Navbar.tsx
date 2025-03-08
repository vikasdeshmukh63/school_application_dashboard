import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

const Navbar = async () => {
  const user = await currentUser();
  console.log(user?.firstName);
  return (
    <div className="flex items-center justify-between p-4">
      {/* search */}
      {/* <div className="hidden lg:flex items-center justify-between gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Search className="h-4 w-4" />
        <input placeholder="search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div> */}

      {/* user controls */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* message button (currently commented out) */}
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-between cursor-pointer">
          <MessageCircleMore className="h-6 w-6" />
        </div> */}

        {/* announcement button */}
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-between cursor-pointer relative">
          <Drum className="h-6 w-6" />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div> */}

        {/* user info */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user?.firstName || 'John Doe'}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata.role as string}
          </span>
        </div>

        {/* user avatar */}
        {/* <Image src="/avatar.png" width={36} height={36} alt="User" className="rounded-full" /> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
