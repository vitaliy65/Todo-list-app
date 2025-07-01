"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "../FormInput";
import { useMutation } from "@tanstack/react-query";
import { Register } from "@/api/auth/route";

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInputs>();
  const router = useRouter();
  const registerQuery = useMutation({
    mutationFn: async (data: RegisterInputs) => Register(data),
    onSuccess: () => {
      reset();
      router.push("/login");
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    if (!data.password) return;
    try {
      registerQuery.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Реєстрація
      </h2>
      <FormInput
        label="name"
        id="name"
        type="text"
        register={register("name", { required: "Введіть ім'я" })}
        error={errors.name}
      />
      <FormInput
        label="email"
        id="email"
        type="email"
        register={register("email", { required: "Введіть email" })}
        error={errors.email}
      />
      <FormInput
        label="password"
        id="password"
        type="password"
        register={register("password", {
          required: "Введіть пароль",
          minLength: {
            value: 6,
            message: "Пароль має містити мінімум 6 символів",
          },
        })}
        error={errors.password}
      />

      {registerQuery.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
          {registerQuery.error.message}
        </div>
      )}
      <button
        type="submit"
        disabled={registerQuery.isPending}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-60 cursor-pointer"
      >
        {registerQuery.isPending ? "Реєстрація..." : "Зареєструватися"}
      </button>
    </form>
  );
}
