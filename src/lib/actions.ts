'use server';

import { revalidatePath } from 'next/cache';
import {
  AnnouncementSchema,
  announcementSchema,
  AssignmentSchema,
  assignmentSchema,
  ClassSchema,
  EventSchema,
  eventSchema,
  ExamSchema,
  LessonSchema,
  lessonSchema,
  ParentSchema,
  parentSchema,
  ResultSchema,
  resultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from './formValidationSchemas';
import prisma from './prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { getUserId, getUserRole } from '@/utils/utils';

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map(teacherId => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map(teacherId => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.create({
      data,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  try {
    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== '' && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await (await clerkClient()).users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
  console.log(data);
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== '' && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await (await clerkClient()).users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;

  const role = await getUserRole();
  const userId = await getUserId();

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === 'teacher' ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export async function createParent(currentState: CurrentState, data: ParentSchema) {
  try {
    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        students: {
          connect: data.students?.map(studentId => ({ id: studentId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
}

export async function updateParent(currentState: CurrentState, data: ParentSchema) {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // First, update Clerk user
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // First, clear all student relationships for this parent
    await prisma.student.updateMany({
      where: {
        parentId: data.id,
      },
      data: {
        parentId: undefined,
      },
    });

    // Then, set the new relationships
    if (data.students && data.students.length > 0) {
      await prisma.student.updateMany({
        where: {
          id: {
            in: data.students,
          },
        },
        data: {
          parentId: data.id,
        },
      });
    }

    // Finally, update parent's basic information
    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== '' && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function deleteParent(currentState: CurrentState, formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.$transaction(async tx => {
      // First, remove all student relationships
      await tx.student.updateMany({
        where: {
          parentId: id,
        },
        data: {
          parentId: undefined,
        },
      });

      // Then delete the Clerk user
      await (await clerkClient()).users.deleteUser(id);

      // Finally delete the parent
      await tx.parent.delete({
        where: {
          id: id,
        },
      });
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function createLesson(currentState: CurrentState, data: LessonSchema) {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function updateLesson(currentState: CurrentState, data: LessonSchema) {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function deleteLesson(currentState: CurrentState, data: FormData) {
  const id = data.get('id') as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function createAssignment(currentState: CurrentState, data: AssignmentSchema) {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function updateAssignment(currentState: CurrentState, data: AssignmentSchema) {
  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

export async function deleteAssignment(currentState: CurrentState, data: FormData) {
  const id = data.get('id') as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}
export async function createResult(currentState: CurrentState, data: ResultSchema) {
  try {
    await prisma.result.create({
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}
export async function updateResult(currentState: CurrentState, data: ResultSchema) {
  try {
    await prisma.result.update({
      where: { id: data.id },
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function deleteResult(currentState: CurrentState, data: FormData) {
  const id = data.get('id') as string;
  try {
    await prisma.result.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function createEvent(currentState: CurrentState, data: EventSchema) {
  try {
    await prisma.event.create({
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function updateEvent(currentState: CurrentState, data: EventSchema) {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function deleteEvent(currentState: CurrentState, data: FormData) {
  const id = data.get('id') as string;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}
export async function createAnnouncement(currentState: CurrentState, data: AnnouncementSchema) {
  try {
    await prisma.announcement.create({
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function updateAnnouncement(currentState: CurrentState, data: AnnouncementSchema) {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}

export async function deleteAnnouncement(currentState: CurrentState, data: FormData) {
  const id = data.get('id') as string;
  try {
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
}
