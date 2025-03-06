import { currentUser } from '@clerk/nextjs/server';
import {
  BookOpenCheck,
  CalendarDays,
  ClipboardPenLine,
  ContactRound,
  Drum,
  FileUser,
  HomeIcon,
  IdCard,
  LogOut,
  Notebook,
  ScrollText,
  Settings,
  TextSelect,
  UserRoundPen,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: <HomeIcon className="h-6 w-6" />,
        label: 'Home',
        href: '/',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <ContactRound className="h-6 w-6" />,
        label: 'Teachers',
        href: '/list/teachers',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <FileUser className="h-6 w-6" />,
        label: 'Students',
        href: '/list/students',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <Users className="h-6 w-6" />,
        label: 'Parents',
        href: '/list/parents',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <Notebook className="h-6 w-6" />,
        label: 'Subjects',
        href: '/list/subjects',
        visible: ['admin'],
      },
      {
        icon: <IdCard className="h-6 w-6" />,
        label: 'Classes',
        href: '/list/classes',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <BookOpenCheck className="h-6 w-6" />,
        label: 'Lessons',
        href: '/list/lessons',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <ScrollText className="h-6 w-6" />,
        label: 'Exams',
        href: '/list/exams',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <ClipboardPenLine className="h-6 w-6" />,
        label: 'Assignments',
        href: '/list/assignments',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <TextSelect className="h-6 w-6" />,
        label: 'Results',
        href: '/list/results',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      // {
      //   icon: '/attendance.png',
      //   label: 'Attendance',
      //   href: '/list/attendance',
      //   visible: ['admin', 'teacher', 'student', 'parent'],
      // },
      {
        icon: <CalendarDays className="h-6 w-6" />,
        label: 'Events',
        href: '/list/events',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      // {
      //   icon: '/message.png',
      //   label: 'Messages',
      //   href: '/list/messages',
      //   visible: ['admin', 'teacher', 'student', 'parent'],
      // },
      {
        icon: <Drum className="h-6 w-6" />,
        label: 'Announcements',
        href: '/list/announcements',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: <UserRoundPen className="h-6 w-6" />,
        label: 'Profile',
        href: '/profile',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <Settings className="h-6 w-6" />,
        label: 'Settings',
        href: '/settings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <LogOut className="h-6 w-6" />,
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

const Menu = async () => {
  // role and user id
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map(i => (
        <div key={i.title} className="flex flex-col gap-2">
          {/* title */}
          <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
          {/* items */}
          {i.items.map(item => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-customSkyLight"
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
