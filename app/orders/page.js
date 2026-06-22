'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Eye, Box, CreditCard, RefreshCw, Truck, CheckCircle2, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let endpoint = '/admin/orders/';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('company', searchQuery);
      
      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      console.log('Fetching endpoint:', endpoint);
      const res = await apiFetch(endpoint);
      console.log('API Response:', res);

      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.success && Array.isArray(res.data?.results)) { 
        setOrders(res.data.results);
      } else if (res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        setOrders(res.data.results);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        console.error('Unexpected response format:', res);
        setOrders([]);
        if (!res.success && res.message) {
          setError(res.message);
        } else if (res.errors) {
          setError(JSON.stringify(res.errors));
        } else {
          setError('Failed to load orders or received unexpected format.');
        }
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300); // debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [fetchOrders]);

  // Calculate stats dynamically from current view or backend data
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
  };

  const statCards = [
    { title: 'TOTAL', count: stats.total, icon: Box, bgColor: 'bg-[#C2DEFF]', textColor: 'text-[#2563EB]', iconBg: 'bg-white' },
    { title: 'PENDING', count: stats.pending, icon: RefreshCw, bgColor: 'bg-[#FDE68A]', textColor: 'text-[#B45309]', iconBg: 'bg-white' },
    { title: 'ACCEPTED', count: stats.accepted, icon: CheckCircle2, bgColor: 'bg-[#A7F3D0]', textColor: 'text-[#047857]', iconBg: 'bg-white' },
    { title: 'REJECTED', count: stats.rejected, icon: XCircle, bgColor: 'bg-[#FDBA74]', textColor: 'text-[#C2410C]', iconBg: 'bg-white' },
    { title: 'DELIVERED', count: stats.delivered, icon: Truck, bgColor: 'bg-[#FBCFE8]', textColor: 'text-[#BE185D]', iconBg: 'bg-white' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Stats Section */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[18px] font-bold text-gray-900">Total Orders</h1>
          <button className="px-6 py-2 bg-[#008F7A] text-white text-[13px] font-bold rounded-full hover:bg-[#008F7A]/90 transition-colors">
            Export
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className={`${stat.bgColor} rounded-[16px] p-5 flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon size={16} className={stat.textColor} />
                </div>
                <span className={`text-[11px] font-bold ${stat.textColor} tracking-wider`}>{stat.title}</span>
              </div>
              <div className={`text-[28px] font-bold ${stat.textColor}`}>
                {stat.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 min-h-[50vh]">
        
        {/* Filters Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-6 py-5 w-12 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-5">Order ID</th>
                <th className="px-4 py-5">Company / User</th>
                <th className="px-4 py-5">Amount</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5">Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">Loading orders...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-red-500 font-bold">Error: {error}</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, idx) => (
                  <tr key={order.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-6 py-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-4 font-mono text-gray-600">{order.order_id || 'N/A'}</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900">{order.user?.company || order.company || 'Unknown'}</div>
                      <div className="text-[11px] text-gray-500">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">BDT {parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase inline-block ${
                        order.status === 'delivered' ? 'border-green-200 text-green-700 bg-green-50' : 
                        order.status === 'accepted' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                        order.status === 'rejected' ? 'border-red-200 text-red-700 bg-red-50' : 
                        'border-yellow-200 text-yellow-700 bg-yellow-50'
                      }`}>
                        {order.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/orders/${order.order_id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-[#008F7A] hover:bg-teal-50 transition-colors tooltip" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No orders found.
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
