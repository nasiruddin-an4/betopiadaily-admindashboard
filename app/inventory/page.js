'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Edit2, AlertCircle, CheckCircle2, PackageSearch } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/products/');
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res)) {
          setProducts(res);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Inventory Management</h1>
          <p className="text-[13px] text-gray-500">Monitor and track your product stock levels</p>
        </div>
        <div className="flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
           <AlertCircle size={20} className="text-orange-500" />
           <div className="text-[13px] font-bold text-orange-800">
             {products.filter(p => !p.in_stock).length} Out of Stock
           </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 min-h-[60vh]">
        
        {/* Search & Count Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full max-w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
            {filteredProducts.length} Items Found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-6 py-5 w-[35%]">Product Details</th>
                <th className="px-6 py-5 w-[15%]">SKU</th>
                <th className="px-6 py-5 w-[15%] text-center">Total Sold</th>
                <th className="px-6 py-5 w-[20%] text-center">Status</th>
                <th className="px-6 py-5 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">Loading inventory data...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                          {product.first_image ? (
                            <img src={product.first_image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <PackageSearch size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-[14px] mb-0.5 line-clamp-1">{product.name}</div>
                          <div className="text-[12px] text-gray-500">{product.category_name || 'Uncategorized'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[12px] font-mono tracking-wide">
                        {product.sku || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-900 text-[14px]">{product.total_sold || 0}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.in_stock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[12px] font-bold border border-green-100">
                          <CheckCircle2 size={14} /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[12px] font-bold border border-red-100">
                          <AlertCircle size={14} /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/products/${product.slug}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-[#008F7A] hover:bg-teal-50 transition-colors tooltip" 
                        title="Update Stock"
                      >
                        <Edit2 size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No products found in inventory.
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
