'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Table } from '../components/ui/Table';
import { Search, Filter } from 'lucide-react';

export default function HotDealsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHotDeals = async () => {
    setIsLoading(true);
    const res = await apiFetch('/hot-deals/');
    if (res.success) setProducts(res.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHotDeals();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search hot deals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <Table headers={['Product', 'Category', 'Price', 'Discount', 'Status']} isLoading={isLoading}>
        {filteredProducts.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {product.first_image ? (
                  <img src={product.first_image} alt={product.name} className="h-10 w-10 rounded object-cover bg-gray-100" />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.brand_name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{product.category_name}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">${product.discounted_price}</div>
              {product.discount_amount !== "0.00" && (
                <div className="text-xs text-gray-500 line-through">${product.price}</div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                -${product.discount_amount}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </td>
          </tr>
        ))}
        {!isLoading && filteredProducts.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
              {searchQuery ? 'No hot deals match your search.' : 'No active hot deals.'}
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
}
