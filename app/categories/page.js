'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Plus, Edit2, Trash2, Folder, X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: null });
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/categories/');
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (Array.isArray(res)) {
        setCategories(res);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async () => {
    if (!formData.name) return;

    const payload = new FormData();
    payload.append('name', formData.name);
    if (formData.icon && typeof formData.icon !== 'string') {
      payload.append('icon', formData.icon);
      payload.append('image', formData.icon);
      payload.append('logo', formData.icon);
    }

    const endpoint = editingCategory ? `/categories/${editingCategory.slug || editingCategory.id}/` : '/categories/';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await apiFetch(endpoint, { method, body: payload });
      if (res.success) {
        Swal.fire('Success', `Category ${editingCategory ? 'updated' : 'created'} successfully!`, 'success');
        fetchCategories();
      } else {
        const errorDetails = res.errors ? '<br/><br/>' + Object.values(res.errors).flat().join('<br/>') : '';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: (res.message || 'Failed to save category') + errorDetails
        });
      }
    } catch (e) {
      Swal.fire('Error', 'An unexpected error occurred', 'error');
    }
    
    setIsModalOpen(false);
    setFormData({ name: '', icon: null });
    setEditingCategory(null);
  };

  const handleDelete = async (slug) => {
    if (!slug) return;
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

    try {
      const res = await apiFetch(`/categories/${slug}/`, { method: 'DELETE' });
      if (res.success) {
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        fetchCategories();
      } else {
        Swal.fire('Error!', res.message || 'Failed to delete category.', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'An unexpected error occurred', 'error');
    }
  };

  const filteredCategories = categories.filter(cat => 
    (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Categories</h1>
          <p className="text-[13px] text-gray-500">Manage your product catalog structure</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', icon: null });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold bg-[#008F7A] text-white rounded-full hover:bg-[#008F7A]/90 transition-colors shrink-0"
        >
          <Plus size={16} /> Add Category
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
              placeholder="Search categories or subcategories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
            {filteredCategories.length} Categories Found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-8 py-5 w-[50%]">Category Details</th>
                <th className="px-5 py-5 w-[30%]">Subcategories</th>
                <th className="px-8 py-5 w-[20%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-gray-400">Loading categories...</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, idx) => (
                  <tr key={category.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FFF4D9] flex items-center justify-center shrink-0">
                          {category.icon ? (
                            <img src={category.icon} alt={category.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Folder size={20} className="text-[#E5A800]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-[14px] mb-0.5">{category.name}</div>
                          <div className="text-[12px] text-gray-500">Shop the latest {category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-400 text-[11px] font-bold rounded-full">
                        Empty
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => {
                            setEditingCategory(category);
                            setFormData({ name: category.name, icon: category.icon || null });
                            setIsModalOpen(true);
                          }}
                          className="hover:text-[#008F7A] transition-colors tooltip" title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.slug || category.id)}
                          className="hover:text-red-500 transition-colors tooltip" title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-gray-400 text-sm">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
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
                  placeholder="e.g. Electronics"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008F7A]/20 focus:border-[#008F7A] transition-all"
                />
              </div>

              {/* Category Icon / Image */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Category Icon
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
                        Remove Icon
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
                onClick={handleSaveCategory}
                className="px-6 py-2.5 bg-[#008F7A] text-white text-[14px] font-bold rounded-full hover:bg-[#008F7A]/90 transition-colors shadow-sm"
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
