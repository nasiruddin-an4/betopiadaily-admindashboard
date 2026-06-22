'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, API_BASE_URL } from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, ShoppingBag, Truck, DollarSign, Download, Calendar } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const COLORS = ['#008F7A', '#F5A623', '#3B82F6', '#E81C76', '#8B5CF6', '#10B981'];

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        let salesEndpoint = 'dashboard/sales-report/';
        let revenueEndpoint = 'dashboard/revenue-chart/';
        
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        const queryString = params.toString();
        
        if (queryString) {
          salesEndpoint += `?${queryString}`;
          revenueEndpoint += `?${queryString}`;
        }
        
        const [salesRes, revenueRes] = await Promise.all([
          apiFetch(salesEndpoint),
          apiFetch(revenueEndpoint)
        ]);

        if (salesRes.success && salesRes.data) {
          setReportData(salesRes.data);
        } else {
          setError(salesRes.message || 'Failed to load sales report');
        }

        if (revenueRes.success && Array.isArray(revenueRes.data)) {
          const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const apiRevenueByMonth = {};
          
          revenueRes.data.forEach(item => {
            const date = new Date(item.month + '-01');
            const monthName = date.toLocaleString('default', { month: 'short' });
            apiRevenueByMonth[monthName] = parseFloat(item.amount || 0);
          });

          const formattedRevenue = allMonths.map(monthName => ({
            name: monthName,
            revenue: apiRevenueByMonth[monthName] || 0
          }));
          
          setRevenueData(formattedRevenue);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [startDate, endDate]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Add a small delay so any loaders can hide
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const element = document.getElementById('report-content');
      if (!element) throw new Error("Report content not found");

      // Temporarily add a white background to the element for clean capture
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#FAFBFC'; // Match standard body bg
      element.style.padding = '20px';
      
      const imgData = await toPng(element, { 
        cacheBust: true,
        backgroundColor: '#FAFBFC',
        pixelRatio: 2
      });
      
      // Restore styles
      element.style.backgroundColor = originalBg;
      element.style.padding = '';

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // Calculate aspect ratio height based on the DOM element's dimensions
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      // Add title to PDF
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Betopia Daily - Sales Report`, 15, 15);
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const dateText = (startDate || endDate) 
        ? `Date Range: ${startDate || 'Start'} to ${endDate || 'End'}`
        : 'Date Range: All Time';
      pdf.text(dateText, 15, 22);

      // Add image snapshot below title
      pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
      
      pdf.save(`Betopia_Sales_Report_${startDate || 'Start'}_to_${endDate || 'End'}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert('Error generating the beautiful PDF report.');
    } finally {
      setIsDownloading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Revenue', 
      value: reportData?.total_revenue !== undefined ? `BDT ${Number(reportData.total_revenue).toLocaleString()}` : '-',
      icon: DollarSign, 
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100'
    },
    { 
      title: 'Average Order Value', 
      value: reportData?.average_order_value !== undefined ? `BDT ${Number(reportData.average_order_value).toLocaleString()}` : '-',
      icon: TrendingUp, 
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    { 
      title: 'Total Orders', 
      value: reportData?.total_orders !== undefined ? reportData.total_orders : '-',
      icon: ShoppingBag, 
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100'
    },
    { 
      title: 'Orders Delivered', 
      value: reportData?.total_orders_delivered !== undefined ? reportData.total_orders_delivered : '-',
      icon: Truck, 
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  const categoryData = reportData?.category_sales_percentage?.map((item, index) => ({
    name: item.category_name,
    value: item.amount,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length]
  })) || [];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-[#008F7A]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-black text-gray-900 tracking-tight">Sales & Revenue Reports</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Analyze your sales performance and category breakdowns.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#008F7A]">
              <Calendar size={14} className="text-gray-400 mr-2" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-[13px] text-gray-600 focus:outline-none"
              />
              <span className="mx-2 text-gray-300">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-[13px] text-gray-600 focus:outline-none"
              />
            </div>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold text-[13px] rounded-xl transition-colors active:scale-95 border border-gray-200 disabled:opacity-50"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></span>
              ) : (
                <Download size={16} />
              )}
              {isDownloading ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-[50vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#008F7A]/20 border-t-[#008F7A] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Analyzing sales data...</p>
        </div>
      ) : error ? (
        <div className="p-8 max-w-2xl mx-auto mt-10 bg-red-50/50 border border-red-100 rounded-2xl text-center">
          <h3 className="text-lg font-bold text-red-800 mb-1">Error Loading Report</h3>
          <p className="text-red-600/80">{error}</p>
        </div>
      ) : (
        <div id="report-content" className="space-y-6 pt-2 pb-4 -mx-2 px-2">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`rounded-[20px] p-6 border border-gray-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] bg-white flex flex-col justify-between transition-transform hover:-translate-y-1 relative overflow-hidden`}>
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] ${stat.color.split(' ')[0]}`}></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[13px] font-bold text-gray-500">{stat.title}</span>
                </div>
                <h3 className="font-black text-gray-900 text-2xl relative z-10">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Revenue Chart Section */}
          <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-6">Revenue Trend</h2>
            <div className="h-[300px] w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `৳${value.toLocaleString()}`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value) => [`BDT ${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#008F7A" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#008F7A', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, fill: '#008F7A', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No revenue data available.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Pie Chart */}
            <div className="lg:col-span-1 bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6 flex flex-col">
              <h2 className="text-[16px] font-bold text-gray-900 mb-6">Sales by Category</h2>
              <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value, name, props) => [`BDT ${value.toLocaleString()}`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[20px] font-black text-gray-900">{categoryData.length}</span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Categories</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No category data available</div>
                )}
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="lg:col-span-2 bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-6">Category Breakdown</h2>
              
              <div className="space-y-4">
                {categoryData.length > 0 ? categoryData.map((category, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/50">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                      <ShoppingBag size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-[15px]">{category.name}</h3>
                        <span className="font-black text-gray-900">BDT {Number(category.value).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                          ></div>
                        </div>
                        <span className="text-[12px] font-bold w-12 text-right" style={{ color: category.color }}>
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No sales data available to break down.
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
