"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TeacherFormProps {
  type: "create" | "update";
  data?: any;
}

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be less than 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(15, { message: "Phone number must be less than 15 digits long" }),
  address: z.string().min(1, { message: "Address is required" }),
  birthDate: z.date({ message: "Birth date is required" }),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

const TeacherForm = ({ type, data }: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">Create a New Teacher</h1>
      <span className="text-xs text-gray-500 font-medium">Authentication Information</span>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label htmlFor="username" className="text-xs text-gray-500">
          Username
        </label>
        <input type="text" {...register("username")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
        {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username.message?.toString()}</p>}
      </div>
      <span className="text-xs text-gray-500 font-medium">Personal Information</span>
      <button className="bg-customPurple text-white p-2 rounded-md text-sm" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
