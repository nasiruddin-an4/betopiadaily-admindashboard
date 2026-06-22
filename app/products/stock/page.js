'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Search, ChevronDown, Package, Download } from 'lucide-react';
import Link from 'next/link';

export default function StockProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [summaryStats, setSummaryStats] = useState({ total: 0, inStock: 0, outOfStock: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, summaryRes] = await Promise.all([
          apiFetch(`/products/?page=${currentPage}`),
          apiFetch('/dashboard/summary/')
        ]);

        if (prodRes.success) {
          setProducts(prodRes.data || []);
          if (prodRes.meta && prodRes.meta.pagination) {
            setPagination(prodRes.meta.pagination);
          }
        }

        if (summaryRes.success && summaryRes.data) {
          const total = summaryRes.data.total_products || 0;
          const inStock = summaryRes.data.stock_products || 0;
          setSummaryStats({
            total,
            inStock,
            outOfStock: Math.max(0, total - inStock)
          });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentPage]);

  const filteredProducts = products.filter(product => {
    const name = product.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-[24px] font-bold text-[#1a1c21]">Stock Products</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 text-[13px] bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            Download
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-[13px] bg-[#008F7A] text-white rounded-full font-medium hover:bg-[#008F7A]/90 transition-colors">
            Add Stock
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#EAF6F6] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Total Products</div>
            <div className="text-[24px] font-bold text-gray-900">{summaryStats.total}</div>
          </div>
        </div>

        <div className="bg-[#FFF4D9] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">In Stock Products</div>
            <div className="text-[24px] font-bold text-gray-900">{summaryStats.inStock}</div>
          </div>
        </div>

        <div className="bg-[#E6F8ED] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Low Stock Products</div>
            <div className="text-[24px] font-bold text-gray-900">0</div>
          </div>
        </div>

        <div className="bg-[#FDE8F1] rounded-[20px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 font-medium mb-1">Out of Stock</div>
            <div className="text-[24px] font-bold text-gray-900">{summaryStats.outOfStock}</div>
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Category <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Status <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Stock Range <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[12px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Newest First <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-5 py-5 w-12">
                  <input type="checkbox" className="rounded border-gray-300 w-4 h-4" />
                </th>
                <th className="px-5 py-5">Product</th>
                <th className="px-5 py-5">Category</th>
                <th className="px-5 py-5">Price</th>
                <th className="px-5 py-5">Status</th>
                <th className="px-5 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-5 py-16 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id || idx} className="border-b border-gray-100 transition-colors hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <input type="checkbox" className="rounded border-gray-300 w-4 h-4" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {(product.images && product.images.length > 0) ? (
                            <img src={product.images[0].image} alt="" className="w-full h-full object-cover" />
                          ) : product.first_image ? (
                            <img src={product.first_image} alt="" className="w-full h-full object-cover" />
                          ) : product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-400">No Img</div>
                          )}
                        </div>
                        <span className="font-bold text-gray-800 text-[13px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-[12px]">{product.category?.name || product.category_name || 'N/A'}</td>
                    <td className="px-5 py-4 font-bold text-gray-800 text-[12px]">
                      BDT {product.discounted_price || product.price || '0.00'}
                    </td>


                    <td className="px-5 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${(product.status === false || product.status === 'false' || String(product.status).toLowerCase() === 'draft' || product.is_published === false)
                        ? 'bg-[#FFF4D9] text-[#E5A800]'
                        : 'bg-[#EAF6F6] text-[#008F7A]'
                        }`}>
                        {(product.status === false || product.status === 'false' || String(product.status).toLowerCase() === 'draft' || product.is_published === false) ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-4 py-1.5 bg-[#008F7A] text-white text-[11px] font-bold rounded-full hover:bg-[#008F7A]/90 transition-colors whitespace-nowrap">
                          Order Now
                        </button>
                        <Link href={`/products/${product.slug || product.id}/edit`} className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-5 py-16 text-center text-gray-400 text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-[12px] text-gray-500">
              Showing {(pagination.page - 1) * pagination.page_size + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.has_previous}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${currentPage === page ? 'bg-[#008F7A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
                disabled={!pagination.has_next}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
