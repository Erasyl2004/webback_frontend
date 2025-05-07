const BASE_URL = 'http://127.0.0.1:8000';

export const authFetch = async (url, options = {}) => {
  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access}`,
    ...options.headers,
  };

  let response = await fetch(BASE_URL + url, {
    ...options,
    headers,
  });

  if (response.status === 401 && refresh) {
    const refreshResponse = await fetch(BASE_URL + '/api/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('access', data.access);

      // Повтор запроса с новым access токеном
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${data.access}`,
      };

      response = await fetch(BASE_URL + url, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
  }

  return response;
};


