const configuredApiUrl = process.env.REACT_APP_API_URL || "http://localhost:8800/api";

export const API_URL = configuredApiUrl.replace(/\/$/, "");
export const IMAGE_URL = `${API_URL.replace(/\/api$/, "")}/images/`;
export const QA_URL = process.env.REACT_APP_QA_URL || "";

export function imageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${IMAGE_URL}${String(path).replace(/^\/+/, "")}`;
}
