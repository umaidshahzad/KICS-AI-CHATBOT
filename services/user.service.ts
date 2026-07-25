const PROFILE_URL = '/api/mock/user/profile';
const BILLING_URL = '/api/mock/user/billing';

export const UserService = {
  fetchProfile: async (email?: string) => {
    const url = email ? `${PROFILE_URL}?email=${encodeURIComponent(email)}` : PROFILE_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(PROFILE_URL, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  fetchBilling: async () => {
    const response = await fetch(BILLING_URL);
    if (!response.ok) throw new Error('Failed to fetch billing info');
    return response.json();
  }
};
