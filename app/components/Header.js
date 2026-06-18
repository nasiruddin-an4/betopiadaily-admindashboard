'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.first_name || user.name) {
            setAdminName(user.first_name || user.name);
          }
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/products': return 'All Products';
      case '/products/draft': return 'Draft Products';
      case '/products/stock': return 'Stock Products';
      case '/products/review': return 'Product Review';
      case '/inventory': return 'Manage Inventory';
      case '/brands': return 'Brand List';
      case '/categories': return 'Categories List';
      case '/tags': return 'Tags List';
      case '/orders': return 'Orders';
      default: 
        if (pathname.includes('/edit')) return 'Edit Product';
        if (pathname.includes('/create')) return 'Create Product';
        
        // Fallback: format the url path
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          const lastPart = parts.pop();
          return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return '';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex-1">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">{getTitle()}</h1>
      </div>
      <div className="flex items-center space-x-4 relative">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>
        
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 pr-3 bg-gray-50 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="bg-brand-bright-orange rounded-full p-1.5 text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-bold text-gray-700">{adminName}</span>
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-[16px] shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                <p className="text-sm font-bold text-gray-900 truncate">{adminName}</p>
              </div>
              <div className="px-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left font-bold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
