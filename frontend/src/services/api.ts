const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('anekek_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('anekek_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('anekek_token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
}

export const api = {
  // Auth
  requestOtp: (phone: string) =>
    request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string, role?: string, name?: string) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp, role, name }) }),
  demoLogin: (role: string) =>
    request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request('/auth/me'),
  registerWorker: (data: any) =>
    request('/auth/register-worker', { method: 'POST', body: JSON.stringify(data) }),

  // Services & Workers
  getServices: () => request('/services'),
  getService: (id: string) => request(`/services/${id}`),
  getWorkers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/workers?${qs}`);
  },
  getWorker: (id: string, params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/workers/${id}?${qs}`);
  },
  updateAvailability: (isAvailable: boolean) =>
    request('/workers/me/availability', { method: 'POST', body: JSON.stringify({ isAvailable }) }),

  // Bookings
  createBooking: (data: any) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: () => request('/bookings'),
  getBooking: (id: string) => request(`/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, reason?: string) =>
    request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, cancellationReason: reason }) }),

  // Payments
  processPayment: (bookingId: string, upiId?: string) =>
    request('/payments/demo', { method: 'POST', body: JSON.stringify({ bookingId, upiId }) }),

  // Ratings
  submitRating: (bookingId: string, rating: number, comment: string) =>
    request('/ratings', { method: 'POST', body: JSON.stringify({ bookingId, rating, comment }) }),
  getWorkerRatings: (workerId: string) => request(`/workers/${workerId}/ratings`),

  // Cooperative
  getCoopFinance: () => request('/cooperative/finance'),
  getVotes: () => request('/cooperative/votes'),
  castVote: (proposalId: string, optionId: string) =>
    request(`/cooperative/votes/${proposalId}/cast`, { method: 'POST', body: JSON.stringify({ optionId }) }),
  getIdeas: () => request('/cooperative/ideas'),
  createIdea: (data: any) =>
    request('/cooperative/ideas', { method: 'POST', body: JSON.stringify(data) }),
  supportIdea: (id: string) =>
    request(`/cooperative/ideas/${id}/support`, { method: 'POST' }),

  // Chat
  getChat: (bookingId: string) => request(`/chats/${bookingId}`),
  sendMessage: (bookingId: string, message: string) =>
    request('/chats/send', { method: 'POST', body: JSON.stringify({ bookingId, message }) }),

  // Admin & Notifications
  getAdminAnalytics: () => request('/admin/analytics'),
  updateVerification: (id: string, status: string, notes?: string) =>
    request(`/admin/verifications/${id}`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  createDispute: (data: any) =>
    request('/admin/disputes', { method: 'POST', body: JSON.stringify(data) }),
  updateDispute: (id: string, status: string, resolution?: string) =>
    request(`/admin/disputes/${id}`, { method: 'PATCH', body: JSON.stringify({ status, resolution }) }),
  getNotifications: () => request('/notifications'),
  markNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),
  resetDemoData: () => request('/admin/reset-demo', { method: 'POST' }),
};
