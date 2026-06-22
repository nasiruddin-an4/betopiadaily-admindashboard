'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { apiFetch } from '../../utils/api';
import { ArrowLeft, ChevronDown, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

export default function CreateProductPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    discount_amount: '0.00',
    stock_quantity: '',
    in_stock: true,
    delivery_date: '',
    description: '',
    sku: ''
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('Publish');
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await apiFetch('/categories/');
        if (catRes.success) {
          setCategories(catRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      if (name === 'name') {
        updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      return { ...prev, ...updates };
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const saveProduct = async (overrideStatus = null) => {
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('slug', formData.slug);
      if (formData.category) payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('discount_amount', formData.discount_amount);
      payload.append('in_stock', formData.in_stock);
      if (formData.delivery_date) payload.append('delivery_date', formData.delivery_date);
      payload.append('description', formData.description);
      if (formData.sku) payload.append('sku', formData.sku);
      
      const currentStatus = overrideStatus || status;
      payload.append('status', currentStatus === 'Publish' ? 'true' : 'false');

      // In a real scenario, map tags and upload image binaries here too.

      const res = await apiFetch(`/products/`, {
        method: 'POST',
        body: payload
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product created successfully.',
          confirmButtonColor: '#008F7A'
        }).then(() => {
          router.push('/products');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: res.message || JSON.stringify(res.errors),
          confirmButtonColor: '#008F7A'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving the product.',
        confirmButtonColor: '#008F7A'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    saveProduct();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-bright-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-20 px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Create Product
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex relative">
            <button 
              type="button" 
              onClick={() => saveProduct()} 
              className="px-4 py-2 bg-brand-bright-orange text-white text-sm font-medium rounded-l-full hover:bg-brand-bright-orange/90 transition-colors"
            >
              {status}
            </button>
            <button 
              type="button" 
              onClick={() => setIsPublishDropdownOpen(!isPublishDropdownOpen)} 
              className="px-2 py-2 bg-brand-bright-orange text-white border-l border-white/20 rounded-r-full hover:bg-brand-bright-orange/90 transition-colors"
            >
              <ChevronDown size={16} />
            </button>
            
            {isPublishDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                <button 
                  type="button" 
                  onClick={() => { setStatus('Publish'); setIsPublishDropdownOpen(false); saveProduct('Publish'); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Publish
                </button>
                <button 
                  type="button" 
                  onClick={() => { setStatus('Draft'); setIsPublishDropdownOpen(false); saveProduct('Draft'); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Basic Information */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Product Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-brand-bright-orange focus:bg-white transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Slug</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Category</label>
              <Select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                placeholder="Select Category"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Delivery Date</label>
              <input 
                type="text" 
                name="delivery_date"
                placeholder="e.g. 2-3 Days, 22 June"
                value={formData.delivery_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-brand-bright-orange focus:bg-white transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Total Sold (Read-Only)</label>
              <input 
                type="number" 
                name="stock_quantity"
                value="0"
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Stock Status</label>
              <Select 
                name="in_stock"
                value={formData.in_stock ? "true" : "false"}
                onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.value === "true" }))}
                options={[
                  { label: "In stock", value: "true" },
                  { label: "Out of stock", value: "false" }
                ]}
                placeholder="Select Status"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Unit Price</label>
              <input 
                type="text" 
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-brand-bright-orange focus:bg-white transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Discount Amount</label>
              <input 
                type="text" 
                name="discount_amount"
                value={formData.discount_amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-brand-bright-orange focus:bg-white transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Selling Price</label>
              <input 
                type="text" 
                value={(parseFloat(formData.price || 0) - parseFloat(formData.discount_amount || 0)).toFixed(2)}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Short Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Write a detailed product description..."
            />
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Media</h2>
          <label className="block text-[11px] font-bold text-gray-900 mb-4">Product Images</label>
          
          <div className="flex flex-wrap gap-4">
            <button type="button" className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-brand-bright-orange hover:text-brand-bright-orange transition-colors bg-gray-50">
              <Upload size={20} className="mb-2" />
              <span className="text-xs font-medium">Add Image</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Tags</h2>
          
          <input 
            type="text" 
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:border-brand-bright-orange focus:ring-1 focus:ring-brand-bright-orange transition-all outline-none mb-4"
          />
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex items-center justify-end gap-4">
        <Link href="/products" className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-6 py-2.5 bg-brand-bright-orange text-white text-sm font-bold rounded-full hover:bg-brand-bright-orange/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

    </form>
  );
}
