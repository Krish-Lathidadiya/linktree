"use client";

import { signOut } from "next-auth/react";
import { LogoutIcon } from "../../../public/icons";
import { twMerge } from "tailwind-merge";

interface ILogoutButton {
  className?: string; 
  isIconRight?: boolean; 
  isIconLeft?: boolean; 
}

const LogoutButton: React.FC<ILogoutButton> = ({
  className,
  isIconRight = false,
  isIconLeft = false,
}) => {
  return (
    <button
      onClick={() => signOut()}
      className={twMerge('flex items-center border gap-2 py-2 px-2 shadow', className)}
    >
      {isIconLeft && <LogoutIcon className="w-5 h-5" />}
      <span>Logout</span>
      {isIconRight && <LogoutIcon className="w-5 h-5" />}
    </button>
  );
};

export default LogoutButton;
