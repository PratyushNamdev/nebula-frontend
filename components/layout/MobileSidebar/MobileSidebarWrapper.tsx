"use client";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./MobileSidebar";

export function MobileSidebarWrapper() {
  const pathname = usePathname();
  const showMobileSidebar = pathname !== "/signin";

  if (!showMobileSidebar) return null;
  return <MobileSidebar />;
}
