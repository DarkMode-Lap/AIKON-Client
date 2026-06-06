import axios from 'axios'

export const BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '')

// Default axios instance — used for multipart FormData (avatar creation)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
})

export default axiosInstance

// Named wrapper that returns parsed data directly (used by shared/api/*.ts)
export const apiClient = {
  get: <T>(path: string) => axiosInstance.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body?: unknown) => axiosInstance.post<T>(path, body).then((r) => r.data),
  patch: <T>(path: string, body?: unknown) =>
    axiosInstance.patch<T>(path, body).then((r) => r.data),
  delete: <T>(path: string) => axiosInstance.delete<T>(path).then((r) => r.data),
}
