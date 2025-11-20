import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from "react-router-dom";
import { fetchRandomUser } from '../services/userService';
import { RandomUser } from '../types';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [randomUser, setRandomUser] = useState<RandomUser | null>(null);
  const [randomUserError, setRandomUserError] = useState<string>('');
  const [isRandomUserLoading, setIsRandomUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRandomUser = async () => {
      try {
        setIsRandomUserLoading(true);
        const userData = await fetchRandomUser();
        setRandomUser(userData);
        setRandomUserError('');
      } catch (err: any) {
        setRandomUserError('Failed to load user data.');
        console.error('Error fetching random user for layout:', err);
      } finally {
        setIsRandomUserLoading(false);
      }
    };

    loadRandomUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/devices" className="text-2xl font-bold text-indigo-600">
                  Device Manager
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {isRandomUserLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ) : randomUserError ? (
                <div className="text-red-500 text-sm">{randomUserError}</div>
              ) : randomUser && (
                <div className="flex items-center space-x-4">
                  <img 
                    src={randomUser.picture.medium} 
                    alt={`${randomUser.name.first} ${randomUser.name.last}`} 
                    className="rounded-full h-10 w-10 border-2 border-indigo-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{randomUser.name.first} {randomUser.name.last}</p>
                    <p className="text-sm text-gray-600">{randomUser.location.city}, {randomUser.location.country}</p>
                    <p className="text-xs text-gray-500">@{randomUser.login.username}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Iuvity Device Manager - Prueba técnica - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
