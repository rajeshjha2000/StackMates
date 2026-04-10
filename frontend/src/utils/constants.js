const normalizeBaseUrl = (url = "") => url.trim().replace(/\/+$/, "");
const isLocalhost =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ||
    (isLocalhost ? "http://localhost:7777" : "")
);
