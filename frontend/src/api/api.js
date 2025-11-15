import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach admin token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers["x-token"] = token;
  return config;
});

// Google Login
export const googleLoginAPI = (id_token) =>
  api.post("/auth/google", { id_token });

// Create quiz (admin only)
export const createQuizAPI = (payload) =>
  api.post("/quiz", payload);

// Add question (admin only)
export const addQuestionAPI = (id, payload) =>
  api.post(`/quiz/${id}/questions`, payload);

// List quizzes (public)
export const getQuizzesAPI = async () => {
  const res = await api.get("/quiz");
  return res.data;
};

// Get quiz for taking (public)
export const getQuizAPI = async (id) => {
  const res = await api.get(`/quiz/${id}/public`);
  return res.data;
};

// Get admin quiz details (admin)
export const getAdminQuizAPI = async (id) => {
  const res = await api.get(`/quiz/${id}`);
  return res.data;
};
