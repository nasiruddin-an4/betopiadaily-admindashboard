'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Eye, Box, CreditCard, RefreshCw, Truck, CheckCircle2, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/orders/');
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (Array.isArray(res)) {
          setOrders(res);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats dynamically
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.payment_status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    returned: orders.filter(o => o.status === 'RETURNED').length,
    failed: orders.filter(o => o.status === 'FAILED').length,
  };

  const statCards = [
    { title: 'TOTAL ORDER', count: stats.total, icon: Box, bgColor: 'bg-[#C2DEFF]', textColor: 'text-[#2563EB]', iconBg: 'bg-white' },
    { title: 'PENDING PAYMENT', count: stats.pending, icon: CreditCard, bgColor: 'bg-[#FDE68A]', textColor: 'text-[#B45309]', iconBg: 'bg-white' },
    { title: 'PROCESSING', count: stats.processing, icon: RefreshCw, bgColor: 'bg-[#A7F3D0]', textColor: 'text-[#047857]', iconBg: 'bg-white' },
    { title: 'SHIPPED', count: stats.shipped, icon: Truck, bgColor: 'bg-[#FED7AA]', textColor: 'text-[#C2410C]', iconBg: 'bg-white' },
    { title: 'DELIVERED', count: stats.delivered, icon: CheckCircle2, bgColor: 'bg-[#FBCFE8]', textColor: 'text-[#BE185D]', iconBg: 'bg-white' },
    { title: 'CANCEL', count: stats.cancelled, icon: XCircle, bgColor: 'bg-[#FDBA74]', textColor: 'text-[#C2410C]', iconBg: 'bg-white' },
    { title: 'RETURNED', count: stats.returned, icon: RotateCcw, bgColor: 'bg-[#D9F99D]', textColor: 'text-[#4D7C0F]', iconBg: 'bg-white' },
    { title: 'FAILED', count: stats.failed, icon: AlertCircle, bgColor: 'bg-[#BAE6FD]', textColor: 'text-[#0369A1]', iconBg: 'bg-white' },
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
              <option>Payment status</option>
            </select>
            <select className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
              <option>Received status</option>
            </select>
            <select className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
              <option>Date</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-6 py-5 w-12 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-5">ID</th>
                <th className="px-4 py-5">Customer</th>
                <th className="px-4 py-5">Items</th>
                <th className="px-4 py-5">Amount</th>
                <th className="px-4 py-5">Payment status</th>
                <th className="px-4 py-5">Received status</th>
                <th className="px-4 py-5">Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-400">Loading orders...</td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-6 py-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-4 font-mono text-gray-600">{order.id || `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}</td>
                    <td className="px-4 py-4 font-bold text-gray-900">{order.customer_name || 'Unknown'}</td>
                    <td className="px-4 py-4 text-gray-500">{order.total_items || 1} pcs</td>
                    <td className="px-4 py-4 font-bold text-gray-900">BDT {parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 uppercase focus:outline-none focus:border-[#008F7A]">
                        <option>{order.payment_status || 'PENDING'}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select className={`px-3 py-1.5 bg-white border rounded-lg text-[11px] font-bold uppercase focus:outline-none ${
                        order.status === 'DELIVERED' ? 'border-green-200 text-green-700 bg-green-50' : 
                        order.status === 'CANCELLED' ? 'border-red-200 text-red-700 bg-red-50' : 
                        'border-gray-200 text-gray-600'
                      }`}>
                        <option>{order.status || 'PENDING'}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '04 Jun, 2026'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/orders/${order.id}`}
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
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-400 text-sm">
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
