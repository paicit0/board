"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

function UserList() {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/getUser')
      const data = await response.json()
      setUsers(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();

  }, [])

  function handleAdmin() {
    if (admin===true) {


    } else {

    }
  }
  return (
    <div className="flex flex-row">
      {users.map(user => (
        <div key={user.id}>
          {/* <div>ID: {user.id}</div> */}
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
          <div>Created At: {user.date}</div>
          {user.role ==="user" ?           
          <Button 
            className=""
            handle={handleAdmin}
            content="Make Admin"
          /> : <div>Admin</div>}

        </div>
      ))
      }
    </div>
  )
}

export default UserList;