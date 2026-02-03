const API_URL = 'http://localhost:3001/api';

const api = {
  get: (url) => 
    fetch(`${API_URL}${url}`)
      .then(res => {
        if (!res.ok) throw new Error(`Błąd pobierania: ${res.status}`);
        return res.json();
      }),

  post: (url, data) => 
    fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(async res => {
      if (!res.ok) {
        // To jest kluczowe, żebyś widział DLACZEGO status się nie zmienia
        const err = await res.json().catch(() => ({ message: 'Błąd bazy danych' }));
        throw new Error(err.message || `Niepoprawny status lub błąd serwera (${res.status})`);
      }
      return res.json();
    }),

  delete: (url) => 
    fetch(`${API_URL}${url}`, { 
      method: 'DELETE' 
    }).then(res => {
      if (!res.ok) throw new Error(`Błąd usuwania: ${res.status}`);
      return res.json();
    }),
};

export const base44 = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => ({ id: '1', name: 'Admin PolBel', role: 'admin' }),
    logout: () => { window.location.href = '/'; }
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
    },
    SiteContent: {
      list: () => api.get('/content'),
      update: (id, data) => api.put(`/content/${id}`, data),
    },
    BlogComment: {
      list: () => api.get('/comments'),
      delete: (id) => api.delete(`/comments/${id}`),
    }
  }
};