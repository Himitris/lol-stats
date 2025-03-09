import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sword, Search, Trophy, BarChart3, Layout as LayoutIcon } from 'lucide-react';

const navigation = [
  { name: 'Recherche', href: '/', icon: Search },
  { name: 'Analyse', href: '/analysis', icon: BarChart3 },
  { name: 'Champions', href: '/champions', icon: Sword },
  { name: 'Classements', href: '/rankings', icon: Trophy },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutIcon },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Sword className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">LoL Stats Pro</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}