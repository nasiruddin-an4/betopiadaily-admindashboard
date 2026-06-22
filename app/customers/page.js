'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Users, Shield, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let endpoint = 'dashboard/users/';
      const res = await apiFetch(endpoint);

      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else if (res.success && Array.isArray(res.data?.results)) { 
        setCustomers(res.data.results);
      } else if (res.data && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        setCustomers(res.data.results);
      } else if (Array.isArray(res)) {
        setCustomers(res);
      } else {
        setCustomers([]);
        if (!res.success && res.message) {
          setError(res.message);
        } else if (res.errors) {
          setError(JSON.stringify(res.errors));
        } else {
          setError('Failed to load customers or received unexpected format.');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.employee_id?.toString().includes(q)
    );
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-[#008F7A]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[20px] font-black text-gray-900 tracking-tight">Customers & Users</h1>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white text-[13px] font-bold rounded-xl hover:shadow-lg hover:shadow-[#008F7A]/30 transition-all active:scale-95">
              Add Customer
            </button>
          </div>
          <p className="text-sm text-gray-500 font-medium">Manage all your registered customers and employees here.</p>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 min-h-[50vh] overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, employee ID or company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full text-[14px] bg-gray-50/80 border border-transparent rounded-xl focus:bg-white focus:outline-none focus:border-[#008F7A]/30 focus:ring-4 focus:ring-[#008F7A]/10 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-[#008F7A]/5 rounded-xl text-sm text-[#008F7A] font-bold border border-[#008F7A]/10">
            <Users size={16} />
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'User' : 'Users'} Found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                <th className="px-6 py-4 w-12 text-center"><input type="checkbox" className="rounded border-gray-300 text-[#008F7A] focus:ring-[#008F7A]" /></th>
                <th className="px-4 py-4">User Details</th>
                <th className="px-4 py-4">Employee ID</th>
                <th className="px-4 py-4">Company</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Date Joined</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-4 border-[#008F7A]/20 border-t-[#008F7A] rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium animate-pulse">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-red-500 font-bold">Error: {error}</td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((user, idx) => (
                  <tr key={user.uid || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 group">
                    <td className="px-6 py-4 text-center"><input type="checkbox" className="rounded border-gray-300 text-[#008F7A] focus:ring-[#008F7A]" /></td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008F7A]/10 to-[#008F7A]/5 text-[#008F7A] flex items-center justify-center font-black text-[16px] shadow-sm border border-[#008F7A]/10 group-hover:bg-[#008F7A]/10 transition-colors overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')
                          )}
                        </div>
                        <div>
                          <div className="group-hover:text-[#008F7A] transition-colors">{user.full_name || 'Unknown User'}</div>
                          <div className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5"><Mail size={12} className="text-gray-400"/> {user.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-600 font-mono">
                      {user.employee_id ? `#${user.employee_id}` : '-'}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {user.company || <span className="text-gray-400 italic">Not assigned</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm ${
                        user.role === 'admin' ? 'border border-purple-200 text-purple-700 bg-purple-50' : 
                        user.role === 'employee' ? 'border border-blue-200 text-blue-700 bg-blue-50' : 
                        'border border-gray-200 text-gray-700 bg-gray-50'
                      }`}>
                        {user.role === 'admin' ? <Shield size={12} strokeWidth={2.5}/> : <UserCheck size={12} strokeWidth={2.5}/>}
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-medium">
                      {user.created_at || user.date_joined ? new Date(user.created_at || user.date_joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                      <Users size={48} className="text-gray-200" />
                      <p className="text-[15px] font-medium">No customers found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
