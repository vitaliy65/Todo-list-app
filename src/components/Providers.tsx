"use client";
import React, { ReactNode } from "react";
import CheckAuthProvider from "./CheckAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: ReactNode }) {
  const quaryClient = new QueryClient();

  return (
    <QueryClientProvider client={quaryClient}>
      <CheckAuthProvider>{children}</CheckAuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
