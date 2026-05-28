import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth
} from "@clerk/clerk-react";

import React from 'react'

const Login = () => {
  const { getToken } = useAuth();

  const syncUser = async () => {
    const token = await getToken();
    console.log("TOKEN",token);

    const res = await fetch("http://localhost:3000/login/syncUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
  };
   return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center gap-4">
      
      {/* NOT SIGNED IN */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn btn-primary px-2 py-1 rounded-full">
            Login
          </button>
        </SignInButton>
      </SignedOut>

      {/* SIGNED IN */}
      <SignedIn>
        <div className="flex items-center gap-3">
          
          {/* Sync Button */}
        
          {/* User Profile */}
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-10 h-10 border-2 border-indigo-500 shadow-md",
              },
            }}
          />
        </div>
      </SignedIn>

    </div>
  </div>

  )
}

export default Login
