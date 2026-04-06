import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskHub - Task Management System" },
    { name: "description", content: "Manage your tasks efficiently with TaskHub" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    // For now, redirect to login - in production, check auth state
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/app/dashboard');
    } else {
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        {/* <h1 className="text-4xl font-bold text-white mb-4">TaskHub</h1>
        <p className="text-blue-100">Loading...</p> */}
      </div>
    </div>
  );
}
