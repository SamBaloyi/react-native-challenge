import axios, { AxiosInstance } from "axios";

// We're using JSONPlaceholder as our API for this example
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Creates an Axios instance configured with a base URL, default headers, and a timeout.
 * 
 * @constant
 * @type {AxiosInstance}
 * 
 * @property {string} baseURL - The base URL for API requests, defined by `API_BASE_URL`.
 * @property {object} headers - Default headers for all requests, including `Content-Type: application/json`.
 * @property {number} timeout - The maximum time (in milliseconds) before a request times out, set to 10,000ms.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor for auth and other headers if needed
api.interceptors.request.use(
  (config) => {
    // We could add auth token here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error status codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;