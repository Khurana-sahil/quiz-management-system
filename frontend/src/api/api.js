import axios from "axios";

// Base URL for FastAPI backend
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export default api;
export function addQuestionAPI(quizId, question) {
  return api.post(`/quiz/${quizId}/questions`, question);
}
export async function getQuizzesAPI() {
  const res = await api.get("/quiz");
  return res.data;
}
