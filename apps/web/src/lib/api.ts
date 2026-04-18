import axios from "axios";

/**
 * 共通の axios インスタンス。
 * Vite の proxy 設定により、開発時は /api → localhost:3000 に転送される。
 */
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
