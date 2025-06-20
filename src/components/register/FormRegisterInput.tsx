import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormInputProps<T> {
  label: string;
  id: string;
  type?: string;
  register: ReturnType<UseFormRegister<T>>;
  error?: FieldError;
}

export default function FormRegisterInput<T>({
  label,
  id,
  type = "text",
  register,
  error,
}: FormInputProps<T>) {
  return (
    <div>
      <label className="register-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} {...register} className="register-input" />
      {error && <p className="register-label-error">{error.message}</p>}
    </div>
  );
}
