const API_URL = 'http://localhost:3001/api';

const api = {
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  }),

  get: (url) => 
    fetch(`${API_URL}${url}`, { headers: api.getHeaders() })
      .then(res => {
        if (!res.ok) throw new Error(`Błąd pobierania: ${res.status}`);
        return res.json();
      }),

  post: (url, data) => 
    fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Błąd serwera' }));
        throw new Error(err.message || `Błąd: ${res.status}`);
      }
      return res.json();
    }),

  put: (url, data) => 
    fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Błąd bazy danych' }));
        throw new Error(err.message || `Błąd: ${res.status}`);
      }
      return res.json();
    }),

  delete: (url) => 
    fetch(`${API_URL}${url}`, { 
      method: 'DELETE',
      headers: api.getHeaders() 
    }).then(res => {
      if (!res.ok) throw new Error(`Błąd usuwania: ${res.status}`);
      return res.json();
    }),
};

export const base44 = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Błąd logowania' }));
        throw new Error(err.message || 'Niepoprawny e-mail lub hasło');
      }
      
      const data = await response.json();
      localStorage.setItem('admin_token', data.token);
      return data.user;
    },
    
    // Zarządzanie zespołem
    registerAdmin: (data) => api.post('/auth/register-admin', data),
    listAdmins: () => api.get('/auth/admins'),
    deleteAdmin: (id) => api.delete(`/auth/admins/${id}`),
    
    logout: () => {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    },

    getToken: () => localStorage.getItem('admin_token'),
    isAuthenticated: () => !!localStorage.getItem('admin_token')
  },
  entities: {
    BlogPost: {
      list: () => api.get('/posts'),
      get: (id) => api.get(`/posts/${id}`),
      create: (data) => api.post('/posts', data),
      update: (id, data) => api.put(`/posts/${id}`, data),
      delete: (id) => api.delete(`/posts/${id}`),
    },
    Product: {
      list: () => api.get('/products'),
      get: (id) => api.get(`/products/${id}`),
      create: (data) => api.post('/products', data),
      update: (id, data) => api.put(`/products/${id}`, data),
      delete: (id) => api.delete(`/products/${id}`),
    },
    Order: {
      list: () => api.get('/orders'),
      get: (id) => api.get(`/orders/${id}`),
      create: (data) => api.post('/orders', data),
      update: (id, data) => api.put(`/orders/${id}`, data),
      delete: (id) => api.delete(`/orders/${id}`),
    }
  }
};