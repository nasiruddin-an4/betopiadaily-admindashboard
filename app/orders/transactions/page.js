'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Search, Eye, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/transactions/');
        if (res.success && Array.isArray(res.data)) {
          setTransactions(res.data);
        } else if (Array.isArray(res)) {
          setTransactions(res);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(txn => 
    (txn.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (txn.order_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (txn.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Transactions</h1>
          <p className="text-[13px] text-gray-500">Monitor and manage all financial transactions</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold bg-[#008F7A] text-white rounded-full hover:bg-[#008F7A]/90 transition-colors shrink-0">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 min-h-[60vh]">
        
        {/* Filters Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full max-w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by TXN, Order ID or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
              <option>Payment Method</option>
              <option>bKash</option>
              <option>Credit Card</option>
              <option>Cash on Delivery</option>
            </select>
            <select className="px-4 py-2 bg-gray-50 border-none rounded-full text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008F7A]">
              <option>Status</option>
              <option>SUCCESS</option>
              <option>PENDING</option>
              <option>FAILED</option>
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
                <th className="px-6 py-5">TXN ID</th>
                <th className="px-4 py-5">Order Ref</th>
                <th className="px-4 py-5">Customer</th>
                <th className="px-4 py-5">Method</th>
                <th className="px-4 py-5">Amount</th>
                <th className="px-4 py-5 text-center">Status</th>
                <th className="px-4 py-5">Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, idx) => (
                  <tr key={txn.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-6 py-4 font-mono text-gray-600">{txn.id || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}</td>
                    <td className="px-4 py-4">
                      <Link href={`/orders/${txn.order_id || 'unknown'}`} className="text-[#008F7A] hover:underline font-bold">
                        {txn.order_id || `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">{txn.customer_name || 'Unknown'}</td>
                    <td className="px-4 py-4 text-gray-500">{txn.payment_method || 'bKash'}</td>
                    <td className="px-4 py-4 font-bold text-gray-900">BDT {parseFloat(txn.amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      {txn.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold border border-green-100">
                          <CheckCircle2 size={12} /> SUCCESS
                        </span>
                      ) : txn.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-bold border border-red-100">
                          <AlertCircle size={12} /> FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[11px] font-bold border border-yellow-100">
                          <Clock size={12} /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {txn.created_at ? new Date(txn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '04 Jun, 2026'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-[#008F7A] hover:bg-teal-50 transition-colors tooltip" 
                        title="View Receipt"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No transactions found.
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
