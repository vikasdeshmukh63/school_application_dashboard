'use client';

import { createSubject, updateSubject } from '@/lib/actions';
import { SubjectSchema, subjectSchema } from '@/lib/formValidationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import InputField from '../InputField';

const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // form state
  const [state, formAction] = useFormState(type === 'create' ? createSubject : updateSubject, {
    success: false,
    error: false,
  });

  // router
  const router = useRouter();

  // on submit
  const onSubmit = handleSubmit(formData => {
    formAction(formData);
  });

  // after form submission
  useEffect(() => {
    if (state.success) {
      toast.success(`Subject has been ${type === 'create' ? 'created' : 'updated'} successfully`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, type, setOpen]);

  // teachers
  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* title  */}
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new subject' : 'Update subject'}
      </h1>
      {/* subject name */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        {/* id */}
        {data && (
          <InputField
            label="ID"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden={true}
          />
        )}
        {/* teachers */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('teachers')}
            defaultValue={data?.teachers}
          >
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name + ' ' + teacher.surname}
              </option>
            ))}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">{errors.teachers.message.toString()}</p>
          )}
        </div>
      </div>
      {/* error */}
      {state.error && <span className="text-red-400">Something went wrong</span>}
      {/* button */}
      <button className="bg-blue-400 text-white p-2 rounded-md" type="submit">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
