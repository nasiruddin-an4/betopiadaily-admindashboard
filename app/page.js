"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ChevronDown, Loader2, Package } from 'lucide-react';

const defaultStats = [
  { id: 'sales', title: "Total Sales", bg: "bg-[#E5F7ED]" },
  { id: 'orders', title: "Total Orders", bg: "bg-[#FEF1CD]" },
  { id: 'customers', title: "Total Customers", bg: "bg-[#FCE1CD]" },
  { id: 'pending', title: "Pending Orders", bg: "bg-[#FCE3F3]" },
  { id: 'rejected', title: "Rejected Orders", bg: "bg-[#D4E4FB]" },
  { id: 'accepted', title: "Accepted Orders", bg: "bg-[#FBD0B2]" },
  { id: 'stock', title: "Stock Products", bg: "bg-[#CCF0A9]" },
  { id: 'all', title: "All Products", bg: "bg-[#BDE4FC]" }
];

import { apiFetch } from './utils/api';

export default function Dashboard() {
  const [data, setData] = useState({
    stats: [],
    revenueData: [],
    paymentData: [],
    topSales: [],
    totalRevenue: 0,
    totalOrdered: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [summaryRes, topProductsRes, revenueRes] = await Promise.all([
          apiFetch('dashboard/summary/'),
          apiFetch('dashboard/top-products/'),
          apiFetch('dashboard/revenue-chart/')
        ]);

        const summary = summaryRes.success ? summaryRes.data : {};
        const topProducts = topProductsRes.success ? topProductsRes.data : [];
        const revenueChart = revenueRes.success ? revenueRes.data : [];

        const formattedStats = [
          { id: 'sales', value: summary?.total_sales !== undefined ? `BDT ${Number(summary.total_sales).toLocaleString()}` : "No data found" },
          { id: 'orders', value: summary?.total_orders !== undefined ? summary.total_orders : "No data found" },
          { id: 'customers', value: summary?.total_customers !== undefined ? summary.total_customers : "No data found" },
          { id: 'pending', value: summary?.total_pending_orders !== undefined ? summary.total_pending_orders : "No data found" },
          { id: 'rejected', value: summary?.total_rejected_orders !== undefined ? summary.total_rejected_orders : "No data found" },
          { id: 'accepted', value: summary?.total_accepted_orders !== undefined ? summary.total_accepted_orders : "No data found" },
          { id: 'stock', value: summary?.stock_products !== undefined ? summary.stock_products : "No data found" },
          { id: 'all', value: summary?.total_products !== undefined ? summary.total_products : "No data found" },
        ];

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const apiRevenueByMonth = {};
        if (Array.isArray(revenueChart)) {
          revenueChart.forEach(item => {
            const date = new Date(item.month + '-01');
            const monthName = date.toLocaleString('default', { month: 'short' });
            apiRevenueByMonth[monthName] = {
              revenue: parseFloat(item.amount || 0)
            };
          });
        }

        const formattedRevenue = allMonths.map(monthName => ({
          name: monthName,
          revenue: apiRevenueByMonth[monthName]?.revenue || 0
        }));

        const formattedTopProducts = Array.isArray(topProducts) ? topProducts.map(p => ({
          name: p.product_name,
          price: Number(p.total_amount).toLocaleString(),
          sales: p.total_quantity,
          image: p.product_image || null
        })) : [];

        setData({
          stats: formattedStats,
          revenueData: formattedRevenue,
          paymentData: [], // Not yet available in API
          topSales: formattedTopProducts,
          totalRevenue: summary?.total_sales || 0,
          totalOrdered: summary?.total_orders || 0
        });

      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Ensure default empty arrays if missing from API
  const stats = data?.stats || [];
  const revenueData = data?.revenueData || [];
  const paymentData = data?.paymentData || [];
  const topSales = data?.topSales || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultStats.map((defaultStat, i) => {
          // If API provides the stat, use it, otherwise use default with "No data found"
          const apiStat = stats.find(s => s.id === defaultStat.id) || stats[i];
          const title = apiStat?.title || defaultStat.title;
          const bg = apiStat?.bg || defaultStat.bg;
          const value = apiStat?.value || "No data found";

          return (
            <div key={i} className={`rounded-xl p-6 shadow-sm flex flex-col justify-between h-[120px] ${bg}`}>
              <p className="text-sm font-medium text-gray-700">{title}</p>
              <h3 className={`font-bold text-gray-900 ${value === "No data found" ? "text-lg" : "text-3xl"}`}>{value}</h3>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue</h2>
            <button className="flex items-center space-x-1 text-xs text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
              <span>Yearly</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <div className="flex space-x-8 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-brand-bright-orange"></div>
                <span className="text-xs text-gray-500 font-medium">Revenue</span>
              </div>
              <div className="flex items-end space-x-2 mt-1">
                <span className="text-lg font-bold text-gray-900">BDT {Number(data.totalRevenue || 0).toLocaleString()}</span>
                <span className="flex items-center text-[10px] text-green-500 font-medium mb-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> 0.00%
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[250px]">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                No data found
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="col-span-1 lg:col-span-3 xl:col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
            <button className="flex items-center space-x-1 text-xs text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
              <span>Weekly</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="text-lg font-bold text-gray-900">0</p>
          </div>

          <div className="flex-1 relative min-h-[180px] flex items-center justify-center">
            {paymentData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 rounded-full border-2 border-[#E81C76] mb-1"></div>
                  <span className="text-[10px] font-bold text-gray-900">bKash</span>
                  <span className="text-xs font-bold text-gray-900">0</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400">No data found</div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#E81C76]"></div>
              <span className="text-[10px] text-gray-500 font-medium">bKash</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-[#F5A623]"></div>
              <span className="text-[10px] text-gray-500 font-medium">Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* Top Sale */}
        <div className="col-span-1 lg:col-span-3 xl:col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top sale</h2>
            <button className="flex items-center space-x-1 text-xs text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
              <span>Weekly</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {topSales.length > 0 ? topSales.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 relative group">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback Icon - Hidden by default if image exists, shown on error or if no image */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400" 
                      style={{ display: product.image ? 'none' : 'flex' }}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">BDT {product.price}</p>
                  </div>
                </div>
                <div className="text-[10px] text-gray-600 font-medium shrink-0 bg-gray-50 px-2 py-1 rounded-md">
                  {product.sales} Sales
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No data found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
