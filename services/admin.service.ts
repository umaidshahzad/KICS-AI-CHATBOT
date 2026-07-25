export class AdminService {
  static async getUsers() {
    const res = await fetch('/api/mock/admin/users');
    return res.json();
  }

  static async updateUserLimit(id: string, newLimit: number) {
    const res = await fetch('/api/mock/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, apiLimit: newLimit })
    });
    return res.json();
  }

  static async updateUserStatus(id: string, status: string) {
    const res = await fetch('/api/mock/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    return res.json();
  }

  static async createUserFromRequest(name: string, email: string) {
    const res = await fetch('/api/mock/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    return data;
  }

  static async getAccessRequests() {
    const res = await fetch('/api/mock/admin/requests');
    return res.json();
  }

  static async approveRequest(id: string, name: string, email: string) {
    // 1. Update request status
    await fetch('/api/mock/admin/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'APPROVED' })
    });

    // 2. Create the user
    return this.createUserFromRequest(name, email);
  }

  static async rejectRequest(id: string) {
    const res = await fetch('/api/mock/admin/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'REJECTED' })
    });
    return res.json();
  }
}
