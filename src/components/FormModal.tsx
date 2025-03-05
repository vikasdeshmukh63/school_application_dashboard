'use client';

import { deleteClass, deleteSubject } from '@/lib/actions';
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
const deleteActionMap: Record<TableType, ServerAction> = {
  subject: deleteSubject,
  // teacher: deleteSubject, // temporary placeholder
  // student: deleteSubject, // temporary placeholder
  // parent: deleteSubject, // temporary placeholder
  class: deleteClass, // temporary placeholder
  // lesson: deleteSubject, // temporary placeholder
  // exam: deleteSubject, // temporary placeholder
  // assignment: deleteSubject, // temporary placeholder
  // result: deleteSubject, // temporary placeholder
  // attendance: deleteSubject, // temporary placeholder
  // event: deleteSubject, // temporary placeholder
  // announcement: deleteSubject, // temporary placeholder
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
    <TeacherForm type={type} data={data} setOpen={setOpen} />
  ),
  student: (type, setOpen, data, relatedData) => (
    <StudentForm type={type} data={data} setOpen={setOpen} />
  ),
  class: (type, setOpen, data, relatedData) => (
    <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};

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

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.success(`${table} has been deleted successfully`);
        router.refresh();
        setOpen(false);
      }
    }, [state]);

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
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
