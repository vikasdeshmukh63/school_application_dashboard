'use client';

import {
  deleteAnnouncement,
  deleteAssignment,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteLesson,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from '@/lib/actions';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { FormContainerProps, TableType } from './FormContainer';

type ServerAction = (
  currentState: { success: boolean; error: boolean },
  data: FormData
) => Promise<{ success: boolean; error: boolean }>;

// delete action map
const deleteActionMap: Partial<Record<TableType, ServerAction>> = {
  subject: deleteSubject,
  teacher: deleteTeacher,
  class: deleteClass,
  student: deleteStudent,
  parent: deleteParent,
  lesson: deleteLesson,
  exam: deleteExam,
  assignment: deleteAssignment,
  result: deleteResult,
  // attendance: deleteSubject, // temporary placeholder
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

// using lazy loading
const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import('./forms/ClassForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import('./forms/ExamForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import('./forms/ParentForm'), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import('./forms/LessonForm'), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import('./forms/AssignmentForm'), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import('./forms/EventForm'), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import('./forms/AnnouncementForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import('./forms/ResultForm'), {
  loading: () => <h1>Loading...</h1>,
});

// form components map
const forms: {
  [key: string]: (
    type: 'create' | 'update',
    setOpen: Dispatch<SetStateAction<boolean>>,
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (type, setOpen, data, relatedData) => (
    <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  teacher: (type, setOpen, data, relatedData) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  student: (type, setOpen, data, relatedData) => (
    <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  class: (type, setOpen, data, relatedData) => (
    <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  exam: (type, setOpen, data, relatedData) => (
    <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  parent: (type, setOpen, data, relatedData) => (
    <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  lesson: (type, setOpen, data, relatedData) => (
    <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  assignment: (type, setOpen, data, relatedData) => (
    <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  result: (type, setOpen, data, relatedData) => (
    <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  event: (type, setOpen, data, relatedData) => (
    <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  announcement: (type, setOpen, data, relatedData) => (
    <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};

// form modal component
const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData: any }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create' ? 'bg-customYellow' : type === 'update' ? 'bg-customSky' : 'bg-customPurple';

  const [open, setOpen] = useState(false);

  // form component
  const Form = () => {
    // delete action
    const deleteAction = deleteActionMap[table];
    // form state
    const [state, formAction] = useFormState(
      deleteAction || (() => Promise.resolve({ success: false, error: false })),
      {
        success: false,
        error: false,
      }
    );
    // router
    const router = useRouter();

    // after completion of action
    useEffect(() => {
      if (state.success) {
        toast.success(`${table} has been deleted successfully`);
        router.refresh();
        setOpen(false);
      }
    }, [router, state]);

    return type === 'delete' && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](type, setOpen, data, relatedData)
    ) : (
      'Form not found!'
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
