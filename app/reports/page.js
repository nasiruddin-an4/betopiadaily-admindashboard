'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Download, DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Error fetching orders for reports:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Calculate dynamic stats
  const successfulOrders = orders.filter(o => o.status === 'DELIVERED' || o.payment_status === 'SUCCESS');
  
  // Since we might not have real data, we'll gracefully fallback to calculating what we have.
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || o.amount || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;
  const itemsSold = orders.reduce((sum, o) => sum + parseInt(o.total_items || 1), 0);

  // Mock data for charts to match screenshot since API doesn't provide historical grouping yet
  const barData = [
    { day: '4', value: 705 }, { day: '5', value: 0 }, { day: '6', value: 0 },
    { day: '7', value: 0 }, { day: '8', value: 0 }, { day: '9', value: 0 },
    { day: '10', value: 0 }, { day: '11', value: 0 }, { day: '12', value: 0 },
    { day: '13', value: 0 }, { day: '14', value: 0 }, { day: '15', value: 0 },
    { day: '16', value: 0 }, { day: '17', value: 0 }, { day: '18', value: 0 },
  ];

  const pieData = [
    { name: 'Kids', value: 100 }
  ];
  const COLORS = ['#008F7A'];

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Sales Reports</h1>
          <p className="text-[13px] text-gray-500">Analyze your store's performance and revenue</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold bg-[#008F7A] text-white rounded-xl hover:bg-[#008F7A]/90 transition-colors shrink-0 shadow-sm">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="relative w-full xl:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="pl-10 pr-4 py-2 w-full text-[13px] bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-start xl:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase">FROM:</span>
            <input type="date" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase">TO:</span>
            <input type="date" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]" />
          </div>
          <select className="px-4 py-2 bg-gray-50 border-none rounded-lg text-[12px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
            <option>All Successful</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <button className="text-[12px] font-bold text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#D1FAE5] rounded-[20px] p-6 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <DollarSign size={20} className="text-[#059669]" />
            </div>
            <span className="px-2 py-1 bg-white rounded-md text-[11px] font-bold text-[#059669] flex items-center gap-1 shadow-sm">
              +0.0% <TrendingUp size={12} />
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#059669] tracking-wider mb-1">TOTAL REVENUE</div>
          <div className="text-[28px] font-bold text-[#064E3B]">
            BDT {totalRevenue.toFixed(2)}
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#D9F99D] rounded-[20px] p-6 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ShoppingCart size={20} className="text-[#4D7C0F]" />
            </div>
            <span className="px-2 py-1 bg-white rounded-md text-[11px] font-bold text-[#4D7C0F] flex items-center gap-1 shadow-sm">
              +0.0% <TrendingUp size={12} />
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#4D7C0F] tracking-wider mb-1">TOTAL ORDERS</div>
          <div className="text-[28px] font-bold text-[#3F6212]">
            {totalOrdersCount}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#FEF08A] rounded-[20px] p-6 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-[#A16207]" />
            </div>
            <span className="px-2 py-1 bg-white rounded-md text-[11px] font-bold text-[#A16207] flex items-center gap-1 shadow-sm">
              +0.0% <TrendingUp size={12} />
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#A16207] tracking-wider mb-1">AVERAGE ORDER VALUE</div>
          <div className="text-[28px] font-bold text-[#713F12]">
            BDT {avgOrderValue.toFixed(2)}
          </div>
        </div>

        {/* Items Sold */}
        <div className="bg-[#FCE7F3] rounded-[20px] p-6 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Package size={20} className="text-[#BE185D]" />
            </div>
            <span className="px-2 py-1 bg-white rounded-md text-[11px] font-bold text-[#BE185D] flex items-center gap-1 shadow-sm">
              +0.0% <TrendingUp size={12} />
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#BE185D] tracking-wider mb-1">ITEMS SOLD</div>
          <div className="text-[28px] font-bold text-[#831843]">
            {itemsSold} pcs
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart - Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[16px] font-bold text-gray-900">Revenue Overview (Last 15 Days)</h2>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#008F7A]"></div>
              <span className="text-[12px] font-bold text-gray-500">Current Period</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  tickCount={5}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#D1FAE5" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Sales by Category */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
          <h2 className="text-[16px] font-bold text-gray-900 mb-8">Sales by Category</h2>
          
          <div className="h-[220px] w-full relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-gray-400">TOTAL</span>
              <span className="text-[18px] font-bold text-gray-900">100%</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#008F7A]"></div>
              <span className="text-[13px] font-medium text-gray-600">Kids</span>
            </div>
            <span className="text-[13px] font-bold text-gray-900">100.0%</span>
          </div>

        </div>

      </div>
    </div>
  );
}
