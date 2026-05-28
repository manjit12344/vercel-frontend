import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser
} from "@clerk/clerk-react";

import React, { useEffect } from 'react'

const Login = () => {
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      syncUser();
    }
  }, [user, isLoaded]);

  const syncUser = async () => {
    try {
      const token = await getToken();
      console.log("TOKEN", token);

      const res = await fetch("http://localhost:3000/login/syncUser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Sync failed:", res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Sync success:", data);
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center gap-4">
        
        {/* NOT SIGNED IN */}
        <SignedOut>
          <SignInButton 
            mode="modal"
            forceRedirectUrl="/"
            signUpForceRedirectUrl="/"
          >
            <button className="btn btn-primary px-2 py-1 rounded-full">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        {/* SIGNED IN */}
        <SignedIn>
          <div className="flex items-center gap-3">
            
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
