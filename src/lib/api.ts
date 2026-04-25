import ky from 'ky';

const TOKEN_KEY = 'neurospect_token';

export const api = ky.create({
  baseUrl: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000') + '/',
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/login';
        }
        return response;
      },
    ],
  },
});

export { TOKEN_KEY };
