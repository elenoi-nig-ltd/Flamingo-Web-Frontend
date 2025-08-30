import { getCookie } from 'cookies-next';

export const getAuthToken = (): string => {
  const token = getCookie('token');
  if (!token || typeof token !== 'string') {
    throw new Error('Authentication token not found. Please log in again.');
  }
  return token;
};

export const getAuthHeaders = () => {
  try {
    // const token = getAuthToken();
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYW1pbmdvdGVjaHRlYW1AZ21haWwuY29tIiwic3ViIjoiNjg5NjBiZDNjZDM2YzZjMDQyNDk2ZjgyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU2MDU2NDkyLCJleHAiOjE3NTYxNDI4OTJ9.p6rvrSngDPPsH-X5rcDxAWYjRldVatyUURhjxGX4q1ws'
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    throw new Error('Failed to get authentication headers. Please log in again.');
  }
};
