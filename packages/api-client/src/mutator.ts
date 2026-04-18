import axios, { type AxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeHeaders = (headers?: HeadersInit) => {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
};

export const customInstance = async <T>(
  url: string,
  options?: RequestInit,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request({
    url,
    method: options?.method,
    data: options?.body,
    headers: normalizeHeaders(options?.headers),
    signal: options?.signal as AbortSignal | undefined,
    ...config,
  });

  return {
    data: response.data,
    status: response.status,
    headers: response.headers as unknown as Headers,
  } as T;
};
