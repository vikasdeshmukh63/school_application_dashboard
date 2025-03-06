import React from 'react';
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { getUserId, getUserRole } from '@/utils/utils';

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
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const role = await getUserRole();
  const userId = await getUserId();

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

      case 'class':
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { grades: classGrades, teachers: classTeachers };
        break;

      case 'teacher':
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = { subjects: teacherSubjects };
        break;

      case 'student':
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });

        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });

        relatedData = { classes: studentClasses, grades: studentGrades };
        break;

      case 'exam':
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });

        relatedData = { lessons: examLessons };
        break;

      case 'lesson':
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
        };
        break;

      case 'assignment':
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });

        relatedData = { lessons: assignmentLessons };
        break;

      case 'result':
        const resultStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        const resultExams = await prisma.exam.findMany({
          select: { id: true, title: true },
        });
        const resultAssignments = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });

        relatedData = {
          students: resultStudents,
          exams: resultExams,
          assignments: resultAssignments,
        };
        break;

      case 'event':
      case 'announcement':
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = { classes: eventClasses };
        break;

      case 'parent':
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { students: parentStudents };
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
