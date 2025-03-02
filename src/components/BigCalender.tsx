'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import { calendarEvents } from '@/lib/data';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

const BigCalender = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleViewChange = (selectedView: View) => {
    setView(selectedView);
  };

  // Create Date objects for min and max times
  const minTime = new Date();
  minTime.setHours(11, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(18, 0, 0);

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={['work_week', 'day']}
      view={view}
      style={{ height: '98%' }}
      onView={handleViewChange}
      min={minTime}
      max={maxTime}
    />
  );
};

export default BigCalender;
