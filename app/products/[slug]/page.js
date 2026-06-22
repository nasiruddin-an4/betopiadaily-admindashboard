'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Select } from '../../components/ui/Select';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const { slug } = use(params);

  const [isLoading, setIsLoading] = useState(true);
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
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('Publish');

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiFetch(`/products/${slug}/`),
          apiFetch('/categories/')
        ]);

        if (catRes.success) {
          setCategories(catRes.data || []);
        }

        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            name: p.name || '',
            slug: p.slug || '',
            category: p.category?.id || '',
            price: p.price || '',
            discount_amount: p.discount_amount || '0.00',
            stock_quantity: p.total_sold || 0,
            in_stock: p.in_stock !== false,
            delivery_date: p.delivery_date || '',
            description: p.description || '', // Keep HTML for read-only view
            sku: p.sku || ''
          });
          setStatus((p.status === false || p.status === 'false' || String(p.status).toLowerCase() === 'draft') ? 'Draft' : 'Publish');

          if (p.tags) {
            setTags(p.tags.map(t => t.name));
          }
          if (p.images) {
            setImages(p.images);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-bright-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Product Details <span className="text-gray-400 font-normal text-sm">#{formData.sku || slug}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex relative">
            <Link 
              href={`/products/${slug}/edit`}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-bright-orange text-white text-sm font-medium rounded-full hover:bg-brand-bright-orange/90 transition-colors"
            >
              <Edit2 size={16} /> Edit Product
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Basic Information */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Basic Information</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-brand-bright-orange/10 text-brand-bright-orange'}`}>
              {status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Product Name</label>
              <input 
                type="text" 
                value={formData.name}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Slug</label>
              <input 
                type="text" 
                value={formData.slug}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-default outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Category</label>
              <input 
                type="text" 
                value={categories.find(c => c.id === formData.category)?.name || 'N/A'}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Delivery Date</label>
              <input 
                type="text" 
                value={formData.delivery_date || 'N/A'}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Total Sold (Read-Only)</label>
              <input 
                type="number" 
                value={formData.stock_quantity}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Stock Status</label>
              <input 
                type="text" 
                value={formData.in_stock ? 'In stock' : 'Out of stock'}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Unit Price</label>
              <input 
                type="text" 
                value={formData.price}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Discount Amount</label>
              <input 
                type="text" 
                value={formData.discount_amount}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 cursor-default outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Selling Price</label>
              <input 
                type="text" 
                value={(parseFloat(formData.price || 0) - parseFloat(formData.discount_amount || 0)).toFixed(2)}
                disabled
                className="w-full px-4 py-3 bg-gray-50/50 border-none rounded-xl text-sm text-gray-500 cursor-default outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-bright-orange uppercase tracking-wider mb-2">Short Description</label>
            <div className="w-full px-4 py-4 bg-gray-50/50 border-none rounded-xl text-sm text-gray-800 min-h-[120px]">
               <div dangerouslySetInnerHTML={{ __html: formData.description || 'No description provided.' }} className="prose prose-sm max-w-none" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Media</h2>
          <label className="block text-[11px] font-bold text-gray-900 mb-4">Product Images</label>

          <div className="flex flex-wrap gap-4">
            {images.length > 0 ? images.map((img) => (
              <div key={img.id} className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-100">
                <img src={img.image} alt="Product" className="w-full h-full object-cover" />
              </div>
            )) : (
              <div className="text-sm text-gray-400">No images available.</div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Tags</h2>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
             <div className="text-sm text-gray-400">No tags available.</div>
          )}
        </div>

      </div>

    </div>
  );
}
