"use client";
import React, { ReactNode } from 'react';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface FormProps {
  fields: Field[];
  onSubmit: (formData: FormData) => void;
  children?: ReactNode;
  className?: string;
  title: string;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, children, className, title }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    onSubmit(formData); // Trigger onSubmit callback
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-md p-6 ${className}`}
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{title}</h1>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col mb-4">
          <label htmlFor={field.name} className="text-sm text-gray-600 mb-1">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          />
        </div>
      ))}
      <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">
        Submit
      </button>
      {children}
    </form>
  );
};

export default Form;
