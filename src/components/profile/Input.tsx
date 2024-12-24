import {cn} from '@/utilities/cn';
import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type inputProps = {
  idLabel: string;
  labelName: string;
  nameRegister: string;
  register: UseFormRegister<FieldValues>;
  errors: any;
  type: 'text' | 'password' | 'email' | 'tel' | 'file';
  placeholder: string;
  defaultValue?: string;
};
export default function Input({
  errors,
  idLabel,
  labelName,
  nameRegister,
  register,
  type,
  placeholder,
  defaultValue
}: inputProps) {
  return (
    <div className="mb-2">
      <label className="font-bold mb-1 inline-block" htmlFor={idLabel}>
        {labelName}
      </label>
      <input
        {...register(nameRegister, { required: 'This field is required' })}
        type={type}
        placeholder={placeholder}
        id={idLabel}
        className={cn(
          'border border-[#797979] outline-none focus:border-slate-600  p-2 rounded-[6px] w-full',
          { 'border-rose-400': errors[nameRegister] }
        )}
        multiple={false}
        defaultValue={defaultValue}
      />
      {errors[nameRegister] && (
        <span className="text-red-500">{errors[nameRegister].message}</span>
      )}
    </div>
  );
}
