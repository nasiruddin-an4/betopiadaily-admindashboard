'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Plus, Edit2, Trash2, Star, X, Upload } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: null });
  const fileInputRef = useRef(null);

  const handleAddClick = () => {
    setEditingBrand(null);
    setFormData({ name: '', description: '', icon: null });
    setIsModalOpen(true);
  };

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    setFormData({ 
      name: brand.name || '', 
      description: brand.slug || brand.description || '', 
      icon: brand.icon || null 
    });
    setIsModalOpen(true);
  };

  const handleSaveBrand = async () => {
    // Basic validation
    if (!formData.name) return;

    // API integration would go here:
    // const payload = new FormData();
    // payload.append('name', formData.name);
    // if (formData.icon) payload.append('icon', formData.icon);
    // await apiFetch('/brands/', { method: 'POST', body: payload });
    
    // For now, just close the modal
    setIsModalOpen(false);
    setFormData({ name: '', description: '', icon: null });
  };

  useEffect(() => {
    async function fetchBrands() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/brands/');
        if (res.success && Array.isArray(res.data)) {
          setBrands(res.data);
        } else if (Array.isArray(res)) {
          setBrands(res);
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand => 
    (brand.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Brands</h1>
          <p className="text-[13px] text-gray-500">Manage your product brands</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold bg-[#008F7A] text-white rounded-full hover:bg-[#008F7A]/90 transition-colors shrink-0"
        >
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 min-h-[60vh]">
        
        {/* Search & Count Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full max-w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
            {filteredBrands.length} Brands Found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-8 py-5 w-24">Image</th>
                <th className="px-5 py-5">Name</th>
                <th className="px-5 py-5">Slug</th>
                <th className="px-8 py-5 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400">Loading brands...</td>
                </tr>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand, idx) => (
                  <tr key={brand.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-8 py-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                        {brand.icon ? (
                          <img src={brand.icon} alt={brand.name} className="w-full h-full object-cover" />
                        ) : (
                          <Star size={20} className="text-[#A855F7]" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 text-[14px]">{brand.name}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[13px] text-gray-500">{brand.slug || '-'}</div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => handleEditClick(brand)}
                          className="hover:text-[#008F7A] transition-colors tooltip" title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="hover:text-red-500 transition-colors tooltip" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400 text-sm">
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-gray-900">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Apple"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008F7A]/20 focus:border-[#008F7A] transition-all"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Brand Logo
                </label>
                
                {formData.icon ? (
                  <div className="relative w-full h-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group">
                    <img 
                      src={typeof formData.icon === 'string' ? formData.icon : URL.createObjectURL(formData.icon)} 
                      alt="Preview" 
                      className="w-auto h-full max-h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setFormData({...formData, icon: null})}
                        className="px-4 py-2 bg-white text-red-500 text-[12px] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center border border-gray-100 mb-2 group-hover:border-[#008F7A]/30 group-hover:text-[#008F7A] transition-all">
                      <Upload size={18} className="text-gray-400 group-hover:text-[#008F7A]" />
                    </div>
                    <div className="text-[13px] font-medium text-gray-700">Click to upload image</div>
                    <div className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({...formData, icon: e.target.files[0]});
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Brief description of the brand..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008F7A]/20 focus:border-[#008F7A] transition-all resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[14px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveBrand}
                className="px-6 py-2.5 bg-[#008F7A] text-white text-[14px] font-bold rounded-full hover:bg-[#008F7A]/90 transition-colors shadow-sm"
              >
                {editingBrand ? 'Update Brand' : 'Save Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
