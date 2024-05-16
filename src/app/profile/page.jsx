import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className='flex-grow'>
      <div className="flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
          <h3 className='text-3xl'>Profile</h3>
          <hr className='my-3' />
          <p>Your email address: {session.user.email}</p>
          <p>Your user role: {session.user.role}</p>
        </div>
      </div>
    </div>
  );
}