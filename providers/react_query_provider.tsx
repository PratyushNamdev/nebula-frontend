"use client";
import { getQueryClient } from "@/constants/react_query";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

interface props {
  children: React.ReactNode;
}
export default function ReactQueryProvider({ children }: props) {
  const queryclient = useMemo(getQueryClient, []);
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
}
