import { useEffect, useState } from "react";
import { getQuizzesAPI } from "../api/api";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [quizzes, setQuizzes] = useState([]);
  const isAdmin = !!localStorage.getItem("admin_token");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzesAPI();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      alert("Error loading quizzes");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Quizzes</h2>

      {quizzes.map((quiz) => (
        <div key={quiz.id} style={{ marginBottom: "15px", borderBottom: "1px solid #666", paddingBottom: "10px" }}>
          <h3>{quiz.title}</h3>

          {/* Public: Take Quiz */}
          <Link to={`/quiz/${quiz.id}`}>
            <button style={{ marginRight: "10px" }}>Take Quiz</button>
          </Link>

          {/* Admin-only actions */}
          {isAdmin && (
            <>
              <Link to={`/admin/quiz/${quiz.id}/add`}>
                <button style={{ marginRight: "10px" }}>Add Questions</button>
              </Link>
              <Link to={`/admin/quiz/${quiz.id}`}>
                <button>Admin View</button>
              </Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
