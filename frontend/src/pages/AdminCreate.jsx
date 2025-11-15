import { useState } from "react";
import { createQuizAPI } from "../api/api";

export default function AdminCreate() {

  if (!localStorage.getItem("admin_token")) {
    window.location.href = "/admin/login";
    return null;
  }

  const [title, setTitle] = useState("");

  const createQuiz = async () => {
    if (!title.trim()) return alert("Enter title");

    try {
      const res = await createQuizAPI({ title });
      alert("Created!");
      window.location.href = `/admin/quiz/${res.data.id}`;
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Quiz</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title"
        style={{ padding: 10 }}
      />
      <button onClick={createQuiz} style={{ marginLeft: 10 }}>
        Create
      </button>
    </div>
  );
}
