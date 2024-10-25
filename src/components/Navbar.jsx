"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="text-white bg-sky-600 p-4 flex items-center justify-between border-b-2 md:h-16 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Home</Link>
      </div>

      {/* CENTER LINKS */}
      <div className="flex-1 text-center justify-center">
        <Link href="/" className="text-xl font-bold">Board</Link>
      </div>

      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center flex-1 justify-end">
        {session?.user?.role === "admin" && (
          <Link href="/userList">Users</Link>
        )}

        {status === "loading" ? (
          <p>Loading...</p>
        ) : !session ? (
          <Link href="/login">Login</Link>
        ) : (
          <>
            <Link href="/profile">Profile</Link>
            <button
              className="px-3 py-1 rounded"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
