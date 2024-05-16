"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <div className="flex-grow text-center p-10">
        <div className="flex justify-center my-10">
        </div>

      </div>
    </main>
  );
}
