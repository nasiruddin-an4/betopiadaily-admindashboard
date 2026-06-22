export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.betopiadaily.shop/api/v1/';

/**
 * Standard fetch utility that handles JSON and FormData, and normalizes the response.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

  const headers = { ...options.headers };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Determine if body is FormData
  const isFormData = options.body && typeof options.body.append === 'function';

  // If the body is NOT FormData, set Content-Type to application/json and stringify body
  if (!isFormData && options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    if (typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body);
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `HTTP error ${res.status}`,
        errors: data.errors || null,
        data: null,
      };
    }

    // Standard envelope success
    if (data && data.success !== undefined) {
      return data;
    }

    // Wrap bare responses in our standard envelope format
    return {
      success: true,
      message: 'Success',
      data: data,
      errors: null,
    };
  } catch (error) {
    console.error('apiFetch error:', error);
    return {
      success: false,
      message: 'Something went wrong',
      errors: null,
      data: null,
    };
  }
}
