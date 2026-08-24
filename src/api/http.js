import axios from "axios";

// Базовий URL бекенду. Локально можна перевизначити через .env.local:
// VITE_API_URL=http://localhost:3002
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Токен приходить із auth-стейту, тому додаємо його перед кожним запитом,
// а не через axios.defaults, щоб не залежати від порядку імпортів.
export const withAuth = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};
