import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import AppSidebar from "@/components/layout/AppSidebar";
import { Toaster } from "react-hot-toast";
import Page from "@/models/Page";
import connectDB from "@/libs/connect";
import { LinkIcon } from "../../../public/icons";
import Link from "next/link";
import DynamicIcon from "@/utils/DynamicIcon";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }

  // Connect to the database
  connectDB();

  // Fetch the page data for the logged-in user
  const page = await Page.findOne({ owner: session.user?.email });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="md:flex min-h-screen">
          <label
            htmlFor="navCb"
            className="inline-flex md:hidden ml-12 mt-4 p-4 rounded-md bg-white shadow  items-center gap-2 cursor-pointer"
          >
            <DynamicIcon iconName="FaBars" library="fa" />
            <span>Open navigation</span>
          </label>
          <input id="navCb" type="checkbox" className="hidden" />
          <label htmlFor="navCb" className="hidden backdrop fixed inset-0 bg-black/80 z-10"></label>
          <aside className="bg-white  w-48 p-4 pt-5 shadow fixed md:static -left-48 top-0 bottom-0 z-20 transition-all">
            <div className="sticky top-0 pt-2">
              <div className="rounded-full overflow-hidden w-20 h-20 mx-auto">
                <Image
                  src={session?.user?.image || "/image/employee_icon.jpg"}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              {/* Links */}
              {page && (
                <Link
                  target="_blank"
                  href={"/" + page.uri}
                  className="text-center mt-4 flex items-center justify-center gap-1"
                >
                  <LinkIcon className="text-blue-500 text-lg" />
                  <span className="text-xl text-gray-300">/</span>
                  <span>{page.uri}</span>
                </Link>
              )}
              <div></div>
              <div className="text-center">
                <AppSidebar />
              </div>
            </div>
          </aside>

          <div className="grow">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
