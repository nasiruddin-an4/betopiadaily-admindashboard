'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../lib/msalConfig";
import { ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { instance } = useMsal();

  const handleSSOLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Use mock credentials from .env if available
      if (process.env.NEXT_PUBLIC_MOCK_SSO_TOKEN && process.env.NEXT_PUBLIC_MOCK_SSO_USER) {
        localStorage.setItem('token', process.env.NEXT_PUBLIC_MOCK_SSO_TOKEN);
        localStorage.setItem('user', process.env.NEXT_PUBLIC_MOCK_SSO_USER);
        
        await Swal.fire({
          title: 'Success!',
          text: 'Mock SSO Login successful',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        
        router.push('/');
        return;
      }

      await instance.loginRedirect(loginRequest);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      if (e.name !== 'BrowserAuthError') {
         setError('Failed to sign in with Microsoft.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (honeypot) {
      console.warn('Bot activity detected and blocked.');
      setError('Suspicious activity detected. Please try again later.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both Email and Password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/erp/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          appVersion: '1.0.0',
          deviceId: '2382832',
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Check user role
        const role = data.user?.role || data.role || data.user_role;
        
        if (role && role.toLowerCase() === 'user') {
           Swal.fire({
             title: 'Access Denied',
             text: "You haven't permission to login to the Admin Dashboard.",
             icon: 'error'
           });
           setIsLoading(false);
           return;
        }

        // Save the access token to local storage
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Show success and redirect
        await Swal.fire({
          title: 'Success!',
          text: 'Login successful',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        router.push('/');
      } else {
        // Error from the server
        setError(data.message || data.error || 'Invalid credentials or server error.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl relative flex flex-col items-center overflow-hidden z-10 border border-gray-100">
        {!showEmailForm ? (
          <div className="w-full flex flex-col items-center px-10 py-10">
            {/* Logo */}
            <div className="mb-6 h-10 flex items-center justify-center">
              <img
                src="/mainLogo.svg"
                alt="Betopia Daily"
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent mb-6" />

            {/* Text */}
            <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
              Sign in with your organizational account to continue
            </p>

            {/* Error Message for SSO */}
            {error && !showEmailForm && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/* SSO Button */}
            <button
              onClick={handleSSOLogin}
              disabled={isLoading}
              className="w-full bg-[#FA8B24] hover:bg-[#E87A13] text-white font-semibold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && !showEmailForm ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 88 88" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12.402l35.687-4.86v34.22H0V12.402zm35.687 33.155v34.406L0 75.14V45.557h35.687zM39.638 6.425L88 0v41.76H39.638V6.425zm0 39.132H88V88L39.638 81.65V45.557z" />
                  </svg>
                  Sign in with Betopia SSO
                </>
              )}
            </button>

            {/* Or Login with Email */}
            <button
              onClick={() => { setShowEmailForm(true); setError(''); }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Or sign in with email
            </button>

            {/* Security Footer */}
            <div className="mt-8 flex items-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-xs font-medium">Secured by Microsoft Entra ID</span>
            </div>
          </div>
        ) : (
          <div className="w-full px-10 py-10">
            {/* Back Button */}
            <button
              onClick={() => { setShowEmailForm(false); setError(''); }}
              className="mb-6 flex items-center gap-1.5 text-gray-400 hover:text-gray-700 font-medium text-sm transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>

            {/* Logo small */}
            <div className="mb-5 h-7 flex items-center">
              <img
                src="/mainLogo.svg"
                alt="Betopia Daily"
                className="h-full w-auto object-contain"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-1">Sign in with Email</h2>
            <p className="text-sm text-gray-400 mb-6">Enter your credentials below</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Honeypot field - visually hidden */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="hp_email_sec">Do not fill this out</label>
                <input
                  type="text"
                  id="hp_email_sec"
                  name="hp_email_sec"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@betopia.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all outline-none font-medium placeholder-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all outline-none font-medium placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                <ArrowRight size={16} className={isLoading ? "animate-pulse" : "group-hover:translate-x-1 transition-transform"} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
