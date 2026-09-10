import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Please log in to view your profile.</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-12 flex justify-center">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-400"><strong>Name:</strong> {user.name || 'User'}</p>
        <p className="text-gray-400"><strong>Email:</strong> {user.email}</p>
        <button onClick={logout} className="w-full bg-red-600 text-white font-bold py-2 rounded mt-6">Logout</button>
      </div>
    </div>
  );
}
