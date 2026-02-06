import { axiosInstance } from "./axios";

export const HTTPService = {
  postRequest: (url, body, baseURL) => {
    return axiosInstance.post(url, body, {
      baseURL: baseURL || undefined, // If baseURL is provided, override default
    });
  },

  getRequest: (url, options = {}, baseURL) => {
    return axiosInstance.get(url, {
      ...options,
      baseURL: baseURL || undefined, // If baseURL is provided, override default
    });
  },

  deleteRequest: (url, body, baseURL) => {
    return axiosInstance.delete(url, {
      data: body,
      baseURL: baseURL || undefined, // If baseURL is provided, override default
    });
  },

  putRequest: (url, body, baseURL) => {
    return axiosInstance.put(url, body, {
      baseURL: baseURL || undefined, // If baseURL is provided, override default
    });
  },
};
