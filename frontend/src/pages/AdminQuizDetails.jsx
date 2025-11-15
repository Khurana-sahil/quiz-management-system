import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuizAPI } from "../api/api";

export default function AdminQuizDetails() {
    if (!localStorage.getItem("admin_token")) {
  window.location.href = "/admin/login";
  return null;
    }

  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await getQuizAPI(id);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id]);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  if (!quiz) return <div style={{ padding: "20px" }}>Quiz not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quiz: {quiz.title}</h2>

      <Link
        to={`/admin/quiz/${id}/add`}
        style={{
          padding: "8px 15px",
          background: "#444",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        ➕ Add Question
      </Link>

      <br />
      <br />

      <h3>Questions</h3>

      {quiz.questions.length === 0 && <p>No questions added yet.</p>}

      {quiz.questions.map((q) => (
        <div
          key={q.id}
          style={{
            background: "#222",
            padding: "12px",
            marginBottom: "8px",
            borderRadius: "6px",
          }}
        >
          <strong>{q.text}</strong>
          <p>Type: {q.type}</p>
          {q.options && (
            <p>
              Options: {q.options.join(", ")}
            </p>
          )}
          <p>Answer: {q.correct_answer}</p>
        </div>
      ))}
    </div>
  );
}
