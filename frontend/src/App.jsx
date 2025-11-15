import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminCreate from "./pages/AdminCreate";
import AdminAddQuestions from "./pages/AdminAddQuestions";
import AdminHome from "./pages/AdminHome";
import AdminQuizDetails from "./pages/AdminQuizDetails";
import TakeQuiz from "./pages/TakeQuiz";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px" }}>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/admin/login">Admin Login</Link>
        <Link to="/admin/create" style={{ marginLeft: 20 }}>Create Quiz</Link>
      </nav>

      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/create" element={<AdminCreate />} />
        <Route path="/admin/quiz/:id/add" element={<AdminAddQuestions />} />
        <Route path="/admin/quiz/:id" element={<AdminQuizDetails />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}
