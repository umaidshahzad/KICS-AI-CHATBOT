const PROFILE_URL = '/api/mock/user/profile';
const BILLING_URL = '/api/mock/user/billing';

export const UserService = {
  fetchProfile: async () => {
    const response = await fetch(PROFILE_URL);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (data: any) => {
    const response = await fetch(PROFILE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
