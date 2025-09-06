"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();
  if (!session) redirect("/login");
  console.log(session)

  return (
    <main>
      <div className="flex-grow text-center p-10">
        <h3 className="text-5xl">This is your profile page, {session?.user?.name}</h3>
        <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
        <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>
      </div>
    </main>

  );
}
