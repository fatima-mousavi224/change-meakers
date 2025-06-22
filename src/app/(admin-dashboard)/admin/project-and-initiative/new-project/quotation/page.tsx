'use client'
import Tabs from "@/components/create-project-tabs/Tabs";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  addQuote: string;
  nameRole: string;
};

export default function QuotationSection() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      addQuote: "",
      nameRole: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Quotation Section Data:", data);
  };

  const handleClear = () => {
    reset();
  };

  return (
      <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
            Create New Project
          </h2>
          <Tabs />
    <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
      <h3 className="text-sky-800 text-xl font-semibold">10. Quotation Section</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 mt-4">
        <div className="col-span-1">
          <label className="block text-sm/6 font-medium text-gray-900">Add Quote</label>
          <Controller
            name="addQuote"
            control={control}
            rules={{ required: "Quote is required", maxLength: 500 }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              />
            )}
          />
          {errors.addQuote && (
            <p className="text-red-500 text-sm">{errors.addQuote.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm/6 font-medium text-gray-900">Name + Role</label>
          <Controller
            name="nameRole"
            control={control}
            rules={{ required: "Name + Role is required", maxLength: 100 }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="write something here..."
                className="block w-full md:w-1/2 rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              />
            )}
          />
          {errors.nameRole && (
            <p className="text-red-500 text-sm">{errors.nameRole.message}</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
    </div>
  );
}
