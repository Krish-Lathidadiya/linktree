import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import LogoutButton from "./buttons/LogoutButton";
import { LinkIcon } from "../../public/icons";
async function Header() {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  return (
    <header className="bg-white border-b p-4">
      <div className="max-w-4xl items-center flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6 ">
          <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="text-blue-500" />
            <span className="text-blue-500 font-bold">LinkList</span>
          </Link>
          <nav className="flex items-center gap-4 text-slate-700 text-sm ">
            <Link href={"/about"}>About</Link>
            <Link href={"/pricing"}>Pricing</Link>
            <Link href={"/contact"}>Contact</Link>
          </nav>
        </div>

        <nav className="flex items-center justify-center gap-4 text-sm text-slate-500">
          {!!session && (
            <>
              <Link href={"/account"} className="hidden sm:block">
                Hello , {session?.user?.name}
              </Link>
              <LogoutButton isIconRight />
            </>
          )}
          {!session && (
            <>
              <Link href={"/login"}>Sing In</Link>
              <Link href={"/login"}>Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
