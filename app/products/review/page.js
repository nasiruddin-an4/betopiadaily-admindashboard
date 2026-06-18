'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Search, ChevronDown, Star, Trash2, CheckCircle, MessageSquare } from 'lucide-react';

export default function ProductReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      try {
        // Assuming your backend review endpoint is /reviews/
        const res = await apiFetch('/reviews/');
        if (res.success && Array.isArray(res.data)) {
          setReviews(res.data);
        } else if (Array.isArray(res)) {
          setReviews(res);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const productName = review.product?.name || review.product_name || '';
    const customer = review.user?.name || review.customer_name || '';
    const comment = review.comment || review.review_text || '';

    return productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
           comment.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-[24px] font-bold text-[#1a1c21]">Product Reviews</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#EAF6F6] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-[#008F7A]" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Total Reviews</div>
            <div className="text-[24px] font-bold text-gray-900">{reviews.length}</div>
          </div>
        </div>
        
        <div className="bg-[#FFF4D9] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Star size={20} className="text-[#E5A800]" fill="currentColor" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Average Rating</div>
            <div className="text-[24px] font-bold text-gray-900">
              {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'} 
              <span className="text-sm font-normal text-gray-500"> / 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-[#E6F8ED] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-[#009A65]" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Published</div>
            <div className="text-[24px] font-bold text-gray-900">
              {reviews.filter(r => r.status === 'Published' || r.is_published === true).length}
            </div>
          </div>
        </div>

        <div className="bg-[#FDE8F1] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-[#E02424]" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Pending Review</div>
            <div className="text-[24px] font-bold text-gray-900">
              {reviews.filter(r => r.status === 'Pending' || r.is_published === false).length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 min-h-[50vh]">
        
        {/* Table Filters */}
        <div className="p-6 flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full lg:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Rating <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Status <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Newest First <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-5 py-5 w-12">
                  <input type="checkbox" className="rounded border-gray-300 w-4 h-4" />
                </th>
                <th className="px-5 py-5">Review ID</th>
                <th className="px-5 py-5">Product</th>
                <th className="px-5 py-5">Customer</th>
                <th className="px-5 py-5 w-[300px]">Review</th>
                <th className="px-5 py-5">Date</th>
                <th className="px-5 py-5">Status</th>
                <th className="px-5 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400">Loading reviews...</td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review, idx) => {
                  const rating = review.rating || 0;
                  const statusStr = review.status || (review.is_published ? 'Published' : 'Pending');
                  const productImg = review.product?.image || review.product?.first_image || review.product_image || '';
                  const productName = review.product?.name || review.product_name || 'N/A';
                  const customerName = review.user?.name || review.customer_name || 'N/A';
                  const commentText = review.comment || review.review_text || '';
                  
                  return (
                    <tr key={review.id || idx} className="border-b border-gray-100 transition-colors hover:bg-gray-50/50 items-start">
                      <td className="px-5 py-4 align-top pt-5">
                        <input type="checkbox" className="rounded border-gray-300 w-4 h-4" />
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-[12px] align-top pt-5 whitespace-nowrap">
                        #{review.id?.toString().substring(0, 8) || `REV-${idx+1}`}
                      </td>
                      <td className="px-5 py-4 align-top pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                            {productImg ? (
                              <img src={productImg} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-400">No Img</div>
                            )}
                          </div>
                          <span className="font-bold text-gray-800 text-[12px] max-w-[150px] leading-snug">{productName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium text-[12px] align-top pt-5">
                        {customerName}
                      </td>
                      <td className="px-5 py-4 align-top pt-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < rating ? "text-[#E5A800]" : "text-gray-200"} 
                                fill={i < rating ? "currentColor" : "none"} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2">
                            "{commentText}"
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-[12px] align-top pt-5 whitespace-nowrap">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('en-GB') : 'N/A'}
                      </td>
                      <td className="px-5 py-4 align-top pt-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          statusStr.toLowerCase() === 'pending' || statusStr === false
                            ? 'bg-[#FFF4D9] text-[#E5A800]'
                            : 'bg-[#EAF6F6] text-[#008F7A]'
                        }`}>
                          {statusStr === false ? 'Pending' : statusStr === true ? 'Published' : statusStr}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top pt-4">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          {statusStr.toLowerCase() === 'pending' && (
                             <button className="text-[#008F7A] hover:text-[#008F7A]/80 transition-colors tooltip" title="Approve">
                               <CheckCircle size={16} />
                             </button>
                          )}
                          <button className="hover:text-red-500 transition-colors tooltip" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-sm">
                    No reviews found.
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
