import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminCreate from "./pages/AdminCreate";
import AdminAddQuestions from "./pages/AdminAddQuestions";
import AdminHome from "./pages/AdminHome";


export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px" }}>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/admin/create">Create Quiz</Link>
      </nav>

      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/create" element={<AdminCreate />} />
        <Route path="/admin/quiz/:id/add" element={<AdminAddQuestions />} />
      </Routes>

    </BrowserRouter>
  );
}
