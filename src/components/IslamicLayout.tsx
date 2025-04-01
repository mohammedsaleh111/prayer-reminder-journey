
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface IslamicLayoutProps {
  children: React.ReactNode;
}

const IslamicLayout: React.FC<IslamicLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tracker', label: 'Prayer Tracker' },
    { path: '/plans', label: 'Makeup Plans' },
    { path: '/progress', label: 'Reports' },
    { path: '/settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      {/* Header */}
      <header className="py-4 bg-islamic-primary text-white islamic-border shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-amiri text-center">Prayer Makeup Tracker</h1>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-islamic-primary/20 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 space-x-4 no-scrollbar">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors",
                  location.pathname === item.path 
                    ? "bg-islamic-primary text-white" 
                    : "text-islamic-primary hover:bg-islamic-primary/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="py-4 bg-islamic-primary text-white islamic-border before:bottom-0 before:top-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-amiri">
            Prayer Makeup Tracker • Helping you make up missed prayers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IslamicLayout;
