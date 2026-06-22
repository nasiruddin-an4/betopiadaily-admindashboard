'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Package, User, MapPin, Box, Calendar, CreditCard, Building2, Mail, BadgeInfo, Truck } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/orders/${orderId}/`);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError(err.message || 'Error fetching order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (status, note = null) => {
    setIsUpdating(true);
    try {
      const payload = { status };
      if (note) payload.reject_note = note;

      const res = await apiFetch(`/admin/orders/${orderId}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        await Swal.fire({
          title: 'Success!',
          text: `Order successfully marked as ${status}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchOrder();
      } else {
        Swal.fire('Failed', res.message || res.errors || 'Unknown error', 'error');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const onReject = async () => {
    const { value: note } = await Swal.fire({
      title: 'Reject Order',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter rejection reason (optional)...',
      showCancelButton: true,
      confirmButtonText: 'Reject Order',
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (note !== undefined) {
      handleUpdateStatus('rejected', note);
    }
  };

  const onAccept = async () => {
    const result = await Swal.fire({
      title: 'Accept Order',
      text: "Are you sure you want to accept this order?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept it!',
      confirmButtonColor: '#008F7A',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      handleUpdateStatus('accepted');
    }
  };

  const onDeliver = async () => {
    const result = await Swal.fire({
      title: 'Mark as Delivered',
      text: "Has this order been delivered to the customer?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delivered!',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      handleUpdateStatus('delivered');
    }
  };

  if (isLoading) return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#008F7A]/20 border-t-[#008F7A] rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading order details...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-red-50/50 border border-red-100 rounded-2xl text-center">
      <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-red-800 mb-1">Error Loading Order</h3>
      <p className="text-red-600/80">{error}</p>
      <button onClick={fetchOrder} className="mt-4 px-6 py-2 bg-white rounded-lg text-red-600 font-medium shadow-sm hover:bg-red-50 transition-colors">Try Again</button>
    </div>
  );
  
  if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>;

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-500/10';
      case 'accepted': return 'bg-blue-50 text-blue-600 border-blue-200 shadow-blue-500/10';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-200 shadow-rose-500/10';
      default: return 'bg-amber-50 text-amber-600 border-amber-200 shadow-amber-500/10';
    }
  };

  return (
    <div className="w-full mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden">
        {/* Subtle decorative background gradient inside header */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-[#008F7A]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10">
          <Link href="/orders" className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-200/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-gray-500 hover:text-[#008F7A]">
            <ArrowLeft size={20} className="group-hover:stroke-[2.5px]" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">#{order.order_id}</h1>
              <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyles(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
              <Calendar size={14} className="text-gray-400" />
              {new Date(order.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {order.status === 'pending' && (
            <>
              <button
                onClick={onReject}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-[14px] font-bold hover:bg-rose-50 hover:border-rose-300 shadow-sm transition-all disabled:opacity-50 active:scale-95"
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                onClick={onAccept}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white rounded-xl text-[14px] font-bold hover:shadow-lg hover:shadow-[#008F7A]/30 transition-all disabled:opacity-50 active:scale-95"
              >
                <CheckCircle size={18} /> Accept Order
              </button>
            </>
          )}
          {order.status === 'accepted' && (
            <button
              onClick={onDeliver}
              disabled={isUpdating}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-[14px] font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 active:scale-95"
            >
              <Truck size={18} /> Mark Delivered
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column - Order Items */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-[17px] font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-[#008F7A]/10 rounded-lg text-[#008F7A]">
                  <Package size={20} />
                </div>
                Order Items
                <span className="ml-auto bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-semibold">
                  {order.items?.length || 0} Items
                </span>
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="w-20 h-20 bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Box size={28} /></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-gray-900 truncate mb-1.5 group-hover:text-[#008F7A] transition-colors">{item.product_name}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wider">
                        Unit: {item.unit}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-gray-900">BDT {item.discounted_price || item.price}</span>
                        {item.discounted_price && item.discounted_price !== item.price && (
                          <span className="text-[12px] text-gray-400 line-through font-medium">BDT {item.price}</span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-[13px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">Total</p>
                    <p className="text-[16px] font-black text-[#008F7A]">
                      BDT {(parseFloat(item.discounted_price || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50/50 p-6 sm:p-8 border-t border-gray-100/80 flex flex-col items-end">
              <div className="w-full sm:max-w-xs space-y-4">
                <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">BDT {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
                {/* Placeholder for shipping/taxes if ever needed */}
                <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-semibold">BDT 0.00</span>
                </div>
                <div className="pt-4 border-t border-gray-200 border-dashed flex justify-between items-end">
                  <span className="text-[15px] font-bold text-gray-900">Total Amount</span>
                  <span className="text-[22px] font-black text-[#008F7A]">
                    BDT {parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">

          {/* Customer Details Card */}
          <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="p-6 sm:p-7 relative z-10">
              <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2.5 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                  <User size={18} />
                </div>
                Customer Details
              </h2>

              {order.user ? (
                <div className="space-y-5 text-[14px]">
                  <div className="flex items-start gap-3">
                    <Building2 size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Company Name</span>
                      <span className="font-bold text-gray-900">{order.user.company || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</span>
                      <span className="text-gray-800 font-medium">{order.user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BadgeInfo size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Employee ID</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[12px] font-bold">
                        {order.user.employee_id || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">User Type</span>
                      <span className="text-gray-800 font-medium capitalize">{order.user.user_type || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <p className="text-[13px] font-medium">No customer info available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info Card */}
          <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="p-6 sm:p-7 relative z-10">
              <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                  <MapPin size={18} />
                </div>
                Delivery Info
              </h2>
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Company Address</span>
                <p className="text-[14px] text-gray-800 leading-relaxed font-medium">
                  {order.user?.company_address || order.company_address || 'Address not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Note */}
          {order.reject_note && (
            <div className="bg-rose-50 rounded-[24px] shadow-sm border border-rose-100 p-6 sm:p-7">
              <h2 className="text-[15px] font-bold text-rose-800 flex items-center gap-2 mb-3">
                <XCircle size={18} className="text-rose-500" /> Rejection Note
              </h2>
              <p className="text-[14px] text-rose-700/90 leading-relaxed font-medium bg-white/60 p-4 rounded-xl border border-rose-100/50">
                {order.reject_note}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
