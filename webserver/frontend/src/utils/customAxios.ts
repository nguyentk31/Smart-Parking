import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const customAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

customAxios.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Do something before request is sent
    return config as InternalAxiosRequestConfig;
  },
  function (error: AxiosError) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
customAxios.interceptors.response.use(
  function (response: AxiosResponse) {
    // return response.data;
    return response;
  },
  function (error: AxiosError) {
    const status: number = error.response?.status || 500;

    switch (status) {
      // authentication (token related issues)
      case 401: {
        return Promise.reject(error);
      }
      // forbidden (permission related issues)
      case 403: {
        return Promise.reject(error);
      }
      // bad request
      case 400: {
        return Promise.reject(error);
      }
      // not found
      case 404: {
        return Promise.reject(error);
      }
      // conflict
      case 409: {
        return Promise.reject(error);
      }
      // unprocessable
      case 422: {
        return Promise.reject(error);
      }
      // generic api error (server related) unexpected
      default: {
        return Promise.reject(error);
      }
    }
  }
);

export default customAxios;
