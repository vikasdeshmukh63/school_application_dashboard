'use client';

import { createAnnouncement, updateAnnouncement } from '@/lib/actions';
import { announcementSchema, AnnouncementSchema } from '@/lib/formValidationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import InputField from '../InputField';

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  // form state
  const [state, formAction] = useFormState(
    type === 'create' ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
    }
  );

  // on submit
  const onSubmit = handleSubmit(data => {
    formAction(data);
  });

  // router
  const router = useRouter();

  // after form submission
  useEffect(() => {
    if (state.success) {
      toast.success(`Announcement has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // classes
  const { classes } = relatedData;

  // format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* title */}
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new announcement' : 'Update the announcement'}
      </h1>
      {/* form */}
      <div className="flex justify-between flex-wrap gap-4">
        {/* title */}
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        {/* description */}
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        {/* date */}
        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date ? formatDateForInput(new Date(data.date)) : ''}
          register={register}
          error={errors?.date}
          type="datetime-local"
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
        {/* class */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId')}
            defaultValue={data?.classId}
          >
            <option value="">Select a class</option>
            {classes.map((classItem: { id: number; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name}
              </option>
            ))}
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

export default AnnouncementForm;
