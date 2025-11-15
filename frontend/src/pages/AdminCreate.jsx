import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminCreate() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createQuiz = async () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/quiz", { title });
      const quizId = res.data.id;

      // Redirect to add questions page
      navigate(`/admin/quiz/${quizId}/add`);
    } catch (err) {
      alert("Error creating quiz");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <br /><br />

      <button onClick={createQuiz} disabled={loading}>
        {loading ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  );
}
