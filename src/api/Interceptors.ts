import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import Client from './Client';

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export function setupInterceptors(
  getToken: () => string | null,
  setToken: (token: string) => void
) {
  Client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },

    (error: any) => Promise.reject(error)
  );

  Client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      const isAuthRoute =
        originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return Client(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          const response = await Client.post('/user/refresh');
          const newToken = response.data;
          setToken(newToken);
          Client.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return Client(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
