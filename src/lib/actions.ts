'use server';

import { getUserId, getUserRole } from '@/utils/utils';
import { clerkClient } from '@clerk/nextjs/server';
import {
  AnnouncementSchema,
  AssignmentSchema,
  ClassSchema,
  EventSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from './formValidationSchemas';
import prisma from './prisma';

// current state
type CurrentState = { success: boolean; error: boolean };

// ! create subject
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

// ! update subject
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

// ! delete subject
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

// ! create class
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

// ! update class
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

// ! delete class
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

// ! create teacher
export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  try {
    // create user in clerk
    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    });

    // create teacher in database
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

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ! update teacher
export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  // if id is not provided, return error
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // update user in clerk
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // update teacher in database
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

// ! delete teacher
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

// ! create student
export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
  try {
    // get the class
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    // if the class is full, return error
    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    // create user in clerk
    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    });

    // create student in database
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

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ! update student
export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
  // if id is not provided, return error
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // update user in clerk
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // update student in database
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

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ! delete student
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

// ! create exam
export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
  // get the role and user id
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    // if the role is teacher, check if the lesson exists
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      // if the lesson does not exist, return error
      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    // create exam in database
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

// ! update exam
export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
  // get the role and user id
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    // if the role is teacher, check if the lesson exists
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      // if the lesson does not exist, return error
      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    // update exam in database
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

// ! delete exam
export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;

  // get the role and user id
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

// ! create parent
export async function createParent(currentState: CurrentState, data: ParentSchema) {
  try {
    // create user in clerk
    const user = await (
      await clerkClient()
    ).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    });

    // create parent in database
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

// ! update parent
export async function updateParent(currentState: CurrentState, data: ParentSchema) {
  // if id is not provided, return error
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // update user in clerk
    const user = await (
      await clerkClient()
    ).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // clear all student relationships for this parent
    await prisma.student.updateMany({
      where: {
        parentId: data.id,
      },
      data: {
        parentId: undefined,
      },
    });

    // set the new relationships
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

    // update parent's basic information
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

// ! delete parent
export async function deleteParent(currentState: CurrentState, formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await prisma.$transaction(async tx => {
      // remove all student relationships
      await tx.student.updateMany({
        where: {
          parentId: id,
        },
        data: {
          parentId: undefined,
        },
      });

      // delete the user in clerk
      await (await clerkClient()).users.deleteUser(id);

      // delete the parent
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

// ! create lesson
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

// ! update lesson
export async function updateLesson(currentState: CurrentState, data: LessonSchema) {
  // if id is not provided, return error
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

// ! delete lesson
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

// ! create assignment
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

// ! update assignment
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

// ! delete assignment
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

// ! create result
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

// ! update result
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

// ! delete result
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

// ! create event
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

// ! update event
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

// ! delete event
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

// ! create announcement
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

// ! update announcement
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

// ! delete announcement
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
