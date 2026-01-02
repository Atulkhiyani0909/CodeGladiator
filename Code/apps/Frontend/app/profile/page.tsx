'use client'

import React, { useEffect } from 'react';
import useAuth from '../store';

const UserProfile = () => {
  // 1. Destructure the state and the function from the store
  const { user, isLoading, error, getUserData } : any = useAuth();

  // 2. Use useEffect to call the function when the component mounts
  useEffect(() => {
    getUserData();
  }, [getUserData]); // Dependency ensures no stale closures

  // 3. Handle the UI states
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user logged in</div>;
  }

  // 4. Render the user data
  return (
    <div className="p-4 border rounded shadow">
      <h1>Welcome, {JSON.stringify(user)}</h1>
    </div>
  );
};

export default UserProfile;