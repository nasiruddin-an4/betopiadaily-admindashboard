'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  // Mock form state
  const [formData, setFormData] = useState({
    full_name: 'Nasir Uddin',
    email: 'nasir.uddin@betopiagroup.com',
    phone: '01815654292',
    company: 'Betopia Group',
    notifications_email: true,
    notifications_push: false,
    theme: 'light'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        title: 'Settings Saved',
        text: 'Your preferences have been updated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 800);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to sign out of your account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, Sign Out',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle logout logic here
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  };

  return (
    <div className="w-full px-6 mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-[#008F7A]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-black text-gray-900 tracking-tight">System Settings</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your account preferences and system configurations.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[13px] rounded-xl transition-colors active:scale-95 border border-rose-100"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'account'
              ? 'bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
          >
            <User size={18} /> Account Details
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'notifications'
              ? 'bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
          >
            <Bell size={18} /> Notifications
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'security'
              ? 'bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
          >
            <Shield size={18} /> Security
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'appearance'
              ? 'bg-gradient-to-r from-[#008F7A] to-[#00A890] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
          >
            <Palette size={18} /> Appearance
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6 sm:p-8">

          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-[14px] text-gray-900 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-[14px] text-gray-900 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008F7A] text-[14px] text-gray-900 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-[14px] text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Email Notifications</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Receive order updates and reports via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="notifications_email" checked={formData.notifications_email} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008F7A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Push Notifications</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Receive real-time alerts in your browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="notifications_push" checked={formData.notifications_push} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008F7A]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Security Settings</h2>
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                <Shield className="text-amber-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-[14px] font-bold text-amber-900 mb-1">Single Sign-On (SSO) Managed</h3>
                  <p className="text-[13px] text-amber-700/80 leading-relaxed">
                    Your account security and password are managed by your organization's Microsoft Azure AD. You cannot change your password from this dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Theme Preferences</h2>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${formData.theme === 'light' ? 'border-[#008F7A] bg-[#008F7A]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="w-16 h-12 bg-white rounded shadow-sm border border-gray-200"></div>
                  <span className="text-[13px] font-bold text-gray-700">Light Mode</span>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all opacity-50 cursor-not-allowed ${formData.theme === 'dark' ? 'border-[#008F7A] bg-[#008F7A]/5' : 'border-gray-100'
                    }`}
                  disabled
                  title="Coming Soon"
                >
                  <div className="w-16 h-12 bg-gray-900 rounded shadow-sm border border-gray-800"></div>
                  <span className="text-[13px] font-bold text-gray-700">Dark Mode <span className="text-[10px] text-[#008F7A] ml-1">(Soon)</span></span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button className="px-6 py-2.5 bg-gray-100 text-gray-700 text-[13px] font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || activeTab === 'security'}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#008F7A] text-white text-[13px] font-bold rounded-xl hover:bg-[#008F7A]/90 transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
            >
              {isSaving ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save size={16} />}
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
