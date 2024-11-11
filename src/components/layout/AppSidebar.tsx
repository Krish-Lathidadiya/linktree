"use client";
import Link from "next/link";
import React from "react";
import { AnalyticsIcon, FileIcon, LeftArrowIcon } from "../../../public/icons";
import LogoutButton from "../buttons/LogoutButton";
import { usePathname } from "next/navigation";

function AppSidebar() {
  const path = usePathname();
  console.log(path);

  return (
    <nav className="inline-flex flex-col text-center mt-8 gap-6 text-gray-500">
      <Link
        href="/account"
        className={`flex items-center gap-4 ${
          path === "/account" ? "text-blue-500" : ""
        }`}
      >
        <FileIcon />
        <span>My Page</span>
      </Link>
      <Link
        href="/analytics"
        className={`flex items-center gap-4 ${
          path === "/analytics" ? "text-blue-500" : ""
        }`}
      >
        <AnalyticsIcon />
        <span>Analytics</span>
      </Link>
      <LogoutButton
        isIconLeft
        className="flex gap-4 shadow-none p-0 border-0 text-gray-500"
      />
      <Link
        href="/"
        className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4"
      >
        <LeftArrowIcon />
        <span>Back to website</span>
      </Link>
    </nav>
  );
}

export default AppSidebar;
