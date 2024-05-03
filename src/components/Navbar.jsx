import React from "react";
import Menu from "./Menu";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const user = false;
  return (
    <nav className="h-12 text-white bg-red-700 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Home</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">Restaurant</Link>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        {!user ? (
          <Link href="/login">Login</Link>
        ) : (
          <Link href="/profile">Profile</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;