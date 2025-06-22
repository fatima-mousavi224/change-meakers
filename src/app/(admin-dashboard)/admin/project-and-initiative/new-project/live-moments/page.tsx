"use client"
import { useForm, Controller } from "react-hook-form";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import Tabs from "@/components/create-project-tabs/Tabs";
import { FaEdit } from "react-icons/fa";

// Define your form type
type LiveMoment = {
  link: string;
};

type FormData = {
  liveMoments: LiveMoment[];
};

function LiveMoments() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      liveMoments: [{ link: "" }, { link: "" }, { link: "" }],
    },
  });

  const onSubmitLiveMoments = (data: FormData) => {
    console.log("Live Moments Data:", data);
  };

  const clearLiveMomentsForm = () => {
    reset({
      liveMoments: [{ link: "" }, { link: "" }, { link: "" }],
    });
  };

  
  return (
    <div>
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />

      <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
        <h3 className="text-sky-800 font-medium text-xl">
          13. Live Moments: Follow Us
        </h3>
        <form onSubmit={handleSubmit(onSubmitLiveMoments)}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row-reverse items-center justify-between"
            >
              <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                <span className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800">
                  <FaSquarePlus />
                </span>
                <span className="text-red-600 cursor-pointer w-4 h-4 hover:text-red-800">
                  <FaTrash />
                </span>
                <span className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800">
                  <FaEdit />
                </span>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-900">
                  Choose link or Embed code
                </label>
                <Controller
                  name={`liveMoments.${index}.link`}
                  control={control}
                  rules={{ required: "Link or embed code is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the link or embed code"
                      className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors?.liveMoments?.[index]?.link && (
                  <p className="text-red-500 text-sm">
                    {errors?.liveMoments[index]?.link?.message as string | undefined}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={clearLiveMomentsForm}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LiveMoments;
