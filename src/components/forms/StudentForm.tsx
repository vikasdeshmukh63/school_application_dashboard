'use client';

import { createStudent, updateStudent } from '@/lib/actions';
import { studentSchema, StudentSchema } from '@/lib/formValidationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import InputField from '../InputField';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { Upload } from 'lucide-react';

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  // image
  const [img, setImg] = useState<any>();

  // form state
  const [state, formAction] = useFormState(type === 'create' ? createStudent : updateStudent, {
    success: false,
    error: false,
  });

  // on submit
  const onSubmit = handleSubmit(data => {
    console.log('hello');
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  // router
  const router = useRouter();

  // after form submission
  useEffect(() => {
    if (state.success) {
      toast.success(`Student has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // grades, classes
  const { grades, classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* title */}
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new student' : 'Update the student'}
      </h1>
      {/* authentication information */}
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        {/* username */}
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        {/* email */}
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        {/* password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      {/* personal information */}
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      {/* image */}
      {img && <Image src={img.secure_url} alt="" width={100} height={100} />}
      {/* upload image */}
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Upload className="h-6 w-6" />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-4">
        {/* first name */}
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        {/* last name */}
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        {/* phone */}
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        {/* address */}
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        {/* blood type */}
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        {/* birthday */}
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split('T')[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
        {/* parent id */}
        <InputField
          label="Parent Id"
          name="parentId"
          defaultValue={data?.parentId}
          register={register}
          error={errors.parentId}
        />
        {/* id */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        {/* gender */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gender')}
            defaultValue={data?.gender}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>
          )}
        </div>
        {/* grade */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gradeId')}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>
          )}
        </div>
        {/* class */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId')}
            defaultValue={data?.classId}
          >
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  ({classItem.name} - {classItem._count.students + '/' + classItem.capacity}{' '}
                  Capacity)
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
          )}
        </div>
      </div>
      {/* error */}
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      {/* button */}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default StudentForm;
