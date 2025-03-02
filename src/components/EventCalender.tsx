'use client';

import Image from 'next/image';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// temporary
const events = [
  {
    id: 1,
    title: 'lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
  },
  {
    id: 2,
    title: 'lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
  },
  {
    id: 3,
    title: 'lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
  },
];

const EventCalender = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white rounded-xl p-4">
      <Calendar onChange={onChange} value={value} />
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="moreDark" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.map(event => (
          <div
            key={event.id}
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-customSky even:border-t-customPurple"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalender;
