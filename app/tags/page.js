'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Search, Plus, Edit2, Trash2, Tag, X } from 'lucide-react';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSaveTag = async () => {
    // Basic validation
    if (!formData.name) return;

    // API integration would go here:
    // await apiFetch('/tags/', { method: 'POST', body: JSON.stringify(formData) });
    
    // For now, just close the modal
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
  };

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/tags/');
        if (res.success && Array.isArray(res.data)) {
          setTags(res.data);
        } else if (Array.isArray(res)) {
          setTags(res);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag => 
    (tag.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">Tags</h1>
          <p className="text-[13px] text-gray-500">Manage your product tags</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold bg-[#008F7A] text-white rounded-full hover:bg-[#008F7A]/90 transition-colors shrink-0"
        >
          <Plus size={16} /> Add Tag
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
              placeholder="Search tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-[13px] bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-gray-700"
            />
          </div>
          <div className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
            {filteredTags.length} Tags Found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-gray-900 text-[12px] font-bold border-b border-gray-100">
                <th className="px-8 py-5 w-[80%]">Tag Details</th>
                <th className="px-8 py-5 w-[20%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-8 py-16 text-center text-gray-400">Loading tags...</td>
                </tr>
              ) : filteredTags.length > 0 ? (
                filteredTags.map((tag, idx) => (
                  <tr key={tag.id || idx} className="border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center shrink-0">
                          <Tag size={20} className="text-[#3B82F6] transform -rotate-90" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-[14px] mb-0.5">{tag.name}</div>
                          <div className="text-[12px] text-gray-500">{tag.slug || tag.description || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button className="hover:text-[#008F7A] transition-colors tooltip" title="Edit">
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
                  <td colSpan={2} className="px-8 py-16 text-center text-gray-400 text-sm">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-gray-900">Add Tag</h2>
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
                  placeholder="e.g. Organic"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008F7A]/20 focus:border-[#008F7A] transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Brief description of the tag..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
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
                onClick={handleSaveTag}
                className="px-6 py-2.5 bg-[#008F7A] text-white text-[14px] font-bold rounded-full hover:bg-[#008F7A]/90 transition-colors shadow-sm"
              >
                Save Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
