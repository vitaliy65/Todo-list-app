"use client";
import { store } from "@/store/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import CheckAuthProvider from "./CheckAuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CheckAuthProvider>{children}</CheckAuthProvider>
    </Provider>
  );
}
