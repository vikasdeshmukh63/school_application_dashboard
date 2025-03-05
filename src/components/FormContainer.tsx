import React from 'react';
import FormModal, { TableType } from './FormModal';
import prisma from '@/lib/prisma';

export type TableType =
  | 'teacher'
  | 'student'
  | 'parent'
  | 'subject'
  | 'class'
  | 'lesson'
  | 'exam'
  | 'assignment'
  | 'result'
  | 'attendance'
  | 'event'
  | 'announcement';

export type FormContainerProps = {
  table: TableType;
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: number;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== 'delete') {
    switch (table) {
      case 'subject':
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });

        relatedData = { teachers: subjectTeachers };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  );
};

export default FormContainer;
