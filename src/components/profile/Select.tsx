import React from 'react';
import {cn} from '@/utilities/cn';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type SelectProps = {
  idLabel: string;
  labelName: string;
  options: { value: string; label: string }[];
  register: UseFormRegister<FieldValues>;
  errors: any;
  defaultValue?: string;
};

export default function Select({
  idLabel,
  labelName,
  options,
  register,
  errors,
  defaultValue
}: SelectProps) {
  return (
    <div className="mb-2">
      <label className="font-bold mb-1" htmlFor={idLabel}>
        {idLabel}
      </label>
      <select
        {...register(labelName, { required: 'This field is required' })}
        id={idLabel}
        className={cn(
          'border border-[#797979] outline-none focus:border-slate-600 p-3 rounded-[6px] w-full',
          { 'border-rose-400': errors[labelName] }
        )}
        defaultValue={defaultValue}
      >
        <option disabled selected>
          Select a {labelName}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[labelName] && (
        <span className="text-red-500">{errors[labelName].message}</span>
      )}
    </div>
  );
}
