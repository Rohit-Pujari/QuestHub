import React from "react";
import Button from "../Button/Button";

interface Field {
  name: string;
  value: string;
  type: string;
  style?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface FormProps {
  fields: Field[];
  onSubmit?: (e: React.FormEvent) => void;
  title: string;
  submitValue?: string;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, title, submitValue }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="container mx-auto p-10 mt-5 w-fit border border-gray-300 shadow-lg rounded-lg bg-white"
    >
      {/* Form Title */}
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {title}
      </h1>

      {/* Form Fields */}
      <div className="space-y-5">
        {fields.map((field, index) => (
          <div key={index}>
            <label
              htmlFor={field.name}
              className="block text-gray-700 font-medium mb-1"
            >
              {field.name}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                field.style ? field.style : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <Button
          type="submit"
          style="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
        >{submitValue}</Button>
      </div>
    </form>
  );
};

export default Form;
