'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, ChevronDown, Eye, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, brandRes, catRes, tagRes] = await Promise.all([
        apiFetch('/products/'),
        apiFetch('/brands/'),
        apiFetch('/categories/'),
        apiFetch('/tags/')
      ]);
      
      if (prodRes.success) setProducts(prodRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (tagRes.success) setTags(tagRes.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
      // Fallback empty if API isn't ready
      setProducts([]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (slug) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    const res = await apiFetch(`/products/${slug}/`, { method: 'DELETE' });
    if (res.success) {
      Swal.fire('Deleted!', 'The product has been deleted.', 'success');
      fetchData();
    } else {
      Swal.fire('Error!', 'Failed to delete: ' + res.message, 'error');
    }
  };

  // Modal logic removed, using dedicated edit/create routes instead

  const filteredProducts = products.filter(product => {
    const catName = product.category?.name || product.category_name || '';
    const brandName = product.brand?.name || product.brand_name || '';
    const name = product.name || '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           catName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 min-h-[80vh] w-full">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-[22px] font-bold text-gray-900">Product List</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-brand-bright-orange text-gray-700"
            />
          </div>
          
          {/* Dropdowns */}
          <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[13px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto whitespace-nowrap">
            All Categories <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button className="flex items-center justify-between gap-2 px-5 py-2.5 text-[13px] bg-gray-50 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto whitespace-nowrap">
            All Status <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          {/* Add Button */}
          <Link href="/products/create" className="flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] bg-brand-bright-orange text-white rounded-full font-medium hover:bg-brand-bright-orange/90 transition-colors w-full sm:w-auto whitespace-nowrap">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F3F4F6] text-gray-600 text-[13px] font-semibold border-b-0">
              <th className="px-5 py-4 rounded-l-lg w-12">
                <input type="checkbox" className="rounded border-gray-300 text-brand-bright-orange focus:ring-brand-bright-orange w-4 h-4" />
              </th>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4 whitespace-nowrap">Category</th>
              <th className="px-5 py-4 whitespace-nowrap">Price</th>
              <th className="px-5 py-4 whitespace-nowrap">Stock</th>
              <th className="px-5 py-4 whitespace-nowrap">Status</th>
              <th className="px-5 py-4 rounded-r-lg whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-bright-orange mx-auto" />
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, idx) => (
                <tr key={product.id || idx} className={`border-b border-gray-100 transition-colors group hover:bg-gray-100/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-5 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-bright-orange focus:ring-brand-bright-orange w-4 h-4" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
                        {(product.images && product.images.length > 0) ? (
                           <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover" />
                        ) : product.first_image ? (
                           <img src={product.first_image} alt={product.name} className="w-full h-full object-cover" />
                        ) : product.image ? (
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-gray-300 text-[10px]">No img</span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500">{product.category?.name || product.category_name || 'Uncategorized'}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-brand-bright-orange">
                      BDT {product.discounted_price || product.price || 0}
                    </div>
                    {(product.discount_amount && product.discount_amount !== "0" && product.discount_amount !== "0.00") && (
                      <div className="text-[11px] text-gray-400 line-through mt-0.5">
                        BDT {product.price}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                      product.in_stock !== false 
                        ? 'bg-blue-50 text-blue-500' 
                        : 'bg-purple-50 text-purple-500'
                    }`}>
                      {product.in_stock !== false ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {(product.status === false || product.status === 'false' || String(product.status).toLowerCase() === 'draft') ? (
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                        Draft
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-brand-bright-orange/10 text-brand-bright-orange">
                        Publish
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Link href={`/products/${product.slug}`} className="hover:text-gray-600 transition-colors"><Eye size={16} /></Link>
                      <Link href={`/products/${product.slug}/edit`} className="hover:text-blue-600 transition-colors"><Edit2 size={16} /></Link>
                      <button onClick={() => handleDelete(product.slug)} className="hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-gray-400 text-sm">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
