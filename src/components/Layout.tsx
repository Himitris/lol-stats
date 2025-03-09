import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sword, Search, Trophy, BarChart3, Layout as LayoutIcon, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Recherche', href: '/', icon: Search },
  { name: 'Analyse', href: '/analysis', icon: BarChart3 },
  { name: 'Champions', href: '/champions', icon: Sword },
  { name: 'Classements', href: '/rankings', icon: Trophy },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutIcon },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Hexagon pattern overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 0l9 6v12l-9 6-9-6V6z" fill="white" fill-opacity="1" fill-rule="evenodd"%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-b border-blue-500/20 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-gray-800 p-2 rounded-lg border border-blue-500/30 group-hover:border-blue-500/80 transition-all duration-300">
                  <Sword className="h-7 w-7 text-blue-500" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">LoL Stats Pro</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                          : "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-gray-400")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-4 rounded-md text-base font-medium",
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-gray-400")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="mt-auto py-6 border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 LoL Stats Pro. Non affilié à Riot Games.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}