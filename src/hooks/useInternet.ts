import { useState, useCallback } from 'react';
import { BASEURL } from '@/config/api/contants';

interface Location {
  _id: string;
  name: string;
  type: 'lodge' | 'hotel' | 'resort' | string;
  address: string;
  createdBy: { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Add near the top of src/hooks/useInternet.ts
export interface ErrorInfo {
  message: string;
  detail?: string;
}

/**
 * Normalize an unknown error into { message, detail }.
 * `detail` carries the raw/technical message (e.g. validation details from the API)
 * so the UI can show it in a collapsible/monospace block.
 */
export const getErrorInfo = (
  err: unknown,
  fallback = 'An unexpected error occurred',
): ErrorInfo => {
  if (!err) {
    return { message: fallback };
  }

  if (err instanceof Error) {
    // If the API returned a compound message like "Bad request: plan is required",
    // split it so the UI can show a short message + detail.
    const raw = err.message || fallback;
    const idx = raw.indexOf(':');
    if (idx > 0 && idx < 60) {
      const message = raw.slice(0, idx).trim();
      const detail = raw.slice(idx + 1).trim();
      if (message && detail) return { message, detail };
    }
    return { message: raw };
  }

  if (typeof err === 'string') {
    return { message: err };
  }

  // Fallback for objects with a message field
  const message =
    (err as { message?: string }).message ?? fallback;
  return { message };
};
interface DataPlan {
  _id: string;
  dataAmount: number;
  duration: number;
  location: { _id: string; name: string; type: string; address: string };
  bundle: string;
  price: number;
  createdBy: { _id: string; email: string };
  createdAt: string;
  updatedAt: string;

}

interface Voucher {
  _id: string;
  code: string;
  plan: {
    _id: string;
    dataAmount: number;
    duration: number;
    bundle: string;
    price: number;
    location: { _id: string; name: string };
  };
  used: boolean;
  expiresAt: string;
  createdBy: { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
}

interface QueryParams {
  page?: number;
  limit?: number;
}

export interface PdfUploadResult {
  total_codes: number;
  found: number;
  skipped: number;
  codes: string[];
  filename: string;
  plan_details: {
    bundle: string;
    dataAmount: number;
    duration: number;
    price: number;
    location: any;
  };
}

const extractErrorMessage = (errorData: any, status?: number): string => {
  if (status === 401) return 'Unauthorized access';
  if (typeof errorData === 'string') return errorData;
  if (errorData instanceof Error) return errorData.message;

  if (errorData?.message) {
    return Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
  }

  return 'An unexpected error occurred';
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASEURL}/internet${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = extractErrorMessage(data, response.status);
    throw new Error(errorMessage);
  }

  return data;
};

export const useInternet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location CRUD
  const createLocation = useCallback(async (data: { name: string; type: string; address: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall('/locations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocations = useCallback(async (query: QueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ ...(query.page && { page: query.page.toString() }), ...(query.limit && { limit: query.limit.toString() }) });
      return await apiCall(`/locations${params.toString() ? `?${params.toString()}` : ''}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/locations/${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocation = useCallback(async (id: string, data: Partial<{ name: string; type: string; address: string }>) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/locations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLocation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/locations/${id}`, { method: 'DELETE' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Data Plan CRUD
  const createDataPlan = useCallback(async (data: { dataAmount: number; duration: number; location: string; bundle: string; price: number }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall('/plans', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const getDataPlans = useCallback(async (query: QueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ ...(query.page && { page: query.page.toString() }), ...(query.limit && { limit: query.limit.toString() }) });
      return await apiCall(`/plans${params.toString() ? `?${params.toString()}` : ''}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDataPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/plans/${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDataPlan = useCallback(async (id: string, data: Partial<{ dataAmount: number; duration: number; location: string; bundle: string; price: number }>) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDataPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/plans/${id}`, { method: 'DELETE' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Voucher CRUD
  const createVoucher = useCallback(async (data: { code: string; plan: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall('/vouchers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createBulkVouchers = useCallback(async (data: { codes: string; plan: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall('/vouchers/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload a PDF, extract the 6-digit voucher codes server-side and save them
  const uploadVoucherPdf = useCallback(
    async (data: { plan: string; pdfFile: File }): Promise<PdfUploadResult> => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('pdfFile', data.pdfFile);
        formData.append('plan', data.plan);

        // No Content-Type header: the browser sets the multipart boundary itself
        const response = await fetch(`${BASEURL}/internet/vouchers/upload-pdf`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        const json = await response.json();
        if (!response.ok) {
          throw new Error(extractErrorMessage(json, response.status));
        }
        return json as PdfUploadResult;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteVouchersBulk = useCallback(
    async (
      ids: string[],
    ): Promise<{ deleted: number; requested: number; message: string }> => {
      setLoading(true);
      setError(null);
      try {
        return await apiCall('/vouchers/bulk-delete', {
          method: 'POST',
          body: JSON.stringify({ ids }),
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getVouchers = useCallback(async (query: QueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      // No default limit here, so the frontend gets all vouchers for its own pagination
      return await apiCall(`/vouchers${params.toString() ? `?${params.toString()}` : ''}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const getVoucher = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/vouchers/${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVoucher = useCallback(async (id: string, data: Partial<{ used: boolean; plan: string }>) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/vouchers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVoucher = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await apiCall(`/vouchers/${id}`, { method: 'DELETE' });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    setError,

    // Location methods
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,

    // Data Plan methods
    createDataPlan,
    getDataPlans,
    getDataPlan,
    updateDataPlan,
    deleteDataPlan,

    // Voucher methods
    createVoucher,
    createBulkVouchers,
    uploadVoucherPdf,
    getVouchers,
    getVoucher,
    updateVoucher,
    deleteVoucher,
    deleteVouchersBulk,
  };
};