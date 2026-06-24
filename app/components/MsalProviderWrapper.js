'use client';

import React, { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../../lib/msalConfig";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// Create instance outside the component
const msalInstance = new PublicClientApplication(msalConfig);

export function MsalProviderWrapper({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    msalInstance.initialize().then(() => {
      msalInstance.handleRedirectPromise().then((response) => {
        if (response && response.accessToken) {
          console.log("====================================");
          console.log("MICROSOFT ACCESS TOKEN RECEIVED:");
          console.log(response.accessToken);
          console.log("====================================");
          
          // Send to DRF backend
          fetch(process.env.NEXT_PUBLIC_API_URL + 'auth/sso/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_token: response.accessToken,
              appVersion: "1.0.0",
              deviceId: "2382832"
            })
          }).then(res => res.json()).then(data => {
            const responseData = data?.data || data;
            const token = responseData?.accessToken || responseData?.access_token || responseData?.token || null;
            if (token) {
              // Fetch user profile to check role
              fetch(process.env.NEXT_PUBLIC_API_URL + 'profile/', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              })
              .then(profileRes => profileRes.json())
              .then(profileResponse => {
                const user = profileResponse?.data || profileResponse;
                const role = user?.role || user?.user_role || user?.user_type;

                if (role && role.toLowerCase() === 'user') {
                  Swal.fire({
                    title: 'Redirecting...',
                    text: "You are being redirected to the user portal.",
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                  }).then(() => {
                    window.location.href = 'https://betopiadaily.shop/';
                  });
                  return;
                }

                localStorage.setItem('token', token);
                if (user) {
                  localStorage.setItem('user', JSON.stringify(user));
                }

                Swal.fire({
                  title: 'Success!',
                  text: 'SSO Login successful',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                }).then(() => {
                  router.push('/');
                });
              })
              .catch(err => {
                console.error("Profile Fetch Error:", err);
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to retrieve user profile.',
                  icon: 'error',
                });
              });
            } else {
              Swal.fire({
                title: 'Login Failed',
                text: data.message || data.error || 'Failed to authenticate via SSO.',
                icon: 'error',
              });
            }
          }).catch(err => {
            console.error("SSO Login Error:", err);
            Swal.fire({
              title: 'Error',
              text: 'Failed to connect to the server. Please try again.',
              icon: 'error',
            });
          });
        }
        setIsInitialized(true);
      }).catch((err) => {
        console.error("MSAL Redirect Error:", err);
        setIsInitialized(true); // Ensure app still loads
      });
    });
  }, [router]);

  if (!isInitialized) {
    // Do not render the app until MSAL is initialized to avoid the stub error
    return null; 
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}
