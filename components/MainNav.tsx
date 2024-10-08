import Link from "next/link";
import React from "react";
import ToggleMode from "./ToggleMode";
import MainNavLinks from "./MainNavLinks";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

const MainNav = async () => {
  const session = await getServerSession(options);

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <MainNavLinks role={session?.user?.role} />
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <Link href="/auth/signout">Logout</Link>
        ) : (
          <Link href="/auth/signin">Login</Link>
        )}
        <ToggleMode />
      </div>
    </div>
  );
};

export default MainNav;
