'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Package, 
  Layers, 
  Store, 
  ShoppingCart, 
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { 
    name: 'Manage Product', 
    icon: Package,
    subItems: [
      { name: 'All Products', href: '/products' },
      { name: 'Draft Products', href: '/products/draft' },
      { name: 'Stock Products', href: '/products/stock' },
      { name: 'Product Review', href: '/products/review' },
    ]
  },
  { 
    name: 'Categories', 
    icon: Layers,
    subItems: [
      { name: 'Categories List', href: '/categories' },
      { name: 'Tags List', href: '/tags' },
      { name: 'Brand List', href: '/brands' },
    ]
  },
  { name: 'Manage Inventory', href: '/inventory', icon: Store },
  { 
    name: 'Orders', 
    icon: ShoppingCart,
    subItems: [
      { name: 'All Orders', href: '/orders' },
      { name: 'Transactions', href: '/orders/transactions' },
    ]
  },
  { name: 'Sales reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin', icon: Users },
  { name: 'Customer', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    // On route change, automatically expand the menu that contains the active route
    const activeMenu = menuItems.find(item => 
      item.subItems && item.subItems.some(sub => pathname === sub.href)
    );
    
    if (activeMenu) {
      setExpandedMenus({ [activeMenu.name]: true });
    } else {
      // If navigating to a standard link (like Inventory), close all accordions
      setExpandedMenus({});
    }
  }, [pathname]);

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => {
      if (prev[menuName]) {
        // If clicking the currently open menu, close it
        return { [menuName]: false };
      } else {
        // Otherwise, open only the newly clicked menu (closing others)
        return { [menuName]: true };
      }
    });
  };

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#0B1120] text-gray-300 shadow-xl ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-5 flex items-center justify-center w-6 h-6 bg-brand-bright-orange text-white rounded-full shadow-md hover:bg-brand-bright-orange/90 transition-colors z-50 focus:outline-none"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 shrink-0 bg-[#0B1120] border-b border-[#1E293B]">
          {isOpen ? (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-bright-orange to-brand-red whitespace-nowrap">
              Betopia Daily
            </span>
          ) : (
            <span className="text-xl font-bold text-brand-bright-orange">
              BD
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden no-scrollbar">
          <ul className="space-y-1 font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              // Determine active state
              let isActive = false;
              if (item.href && pathname === item.href) {
                isActive = true;
              } else if (item.subItems) {
                isActive = item.subItems.some(sub => pathname === sub.href);
              }
              // Specifically for Dashboard since pathname is '/'
              if (item.name === 'Dashboard' && pathname === '/') {
                isActive = true;
              }

              const isExpanded = expandedMenus[item.name];
              const isItemActive = isActive || isExpanded; // Highlight parent if expanded or active

              return (
                <li key={item.name} className="flex flex-col relative">
                  <div 
                    onClick={() => (item.subItems || item.hasSubmenu) ? toggleSubmenu(item.name) : null}
                    className={`cursor-pointer flex items-center justify-between rounded-lg transition-all duration-200 ${
                      isOpen ? 'px-4 py-3' : 'justify-center py-3'
                    } ${
                      isItemActive
                        ? 'bg-[#1E293B] text-white' 
                        : 'text-slate-300 hover:bg-[#1E293B]/60 hover:text-white'
                    }`}
                  >
                    {item.href && !item.subItems ? (
                      <Link href={item.href} className="flex items-center w-full" title={!isOpen ? item.name : ''}>
                        <Icon className={`shrink-0 w-5 h-5 transition duration-75 ${isItemActive ? 'text-brand-bright-orange' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                          {item.name}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center w-full">
                        <Icon className={`shrink-0 w-5 h-5 transition duration-75 ${isItemActive ? 'text-brand-bright-orange' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                          {item.name}
                        </span>
                      </div>
                    )}

                    {isOpen && (item.subItems || item.hasSubmenu) && (
                      <div className="shrink-0">
                        {isExpanded 
                          ? <ChevronUp size={16} className={isItemActive ? 'text-brand-bright-orange' : 'text-slate-400'} /> 
                          : <ChevronDown size={16} className="text-slate-400" />
                        }
                      </div>
                    )}
                  </div>

                  {/* Submenu Items */}
                  {isOpen && item.subItems && isExpanded && (
                    <ul className="relative mt-2 pb-2">
                      {/* Vertical connector line */}
                      <div className="absolute top-0 bottom-5 left-[25px] w-[2px] bg-[#334155]"></div>
                      
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.name} className="relative group mt-1">
                            {/* Circle Node */}
                            <div className={`absolute left-[22px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-[#0B1120] z-10 transition-colors ${
                              isSubActive ? 'border-brand-bright-orange' : 'border-[#475569] group-hover:border-slate-400'
                            }`}></div>
                            
                            <Link 
                              href={sub.href}
                              className={`block pl-[44px] py-2 text-[15px] font-medium transition-colors ${
                                isSubActive ? 'text-brand-bright-orange' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
      </div>
    </aside>
  );
}
