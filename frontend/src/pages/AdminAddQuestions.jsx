import { useState } from "react";
import { addQuestionAPI } from "../api/api";
import { useParams } from "react-router-dom";

export default function AdminAddQuestions() {
    if (!localStorage.getItem("admin_token")) {
  window.location.href = "/admin/login";
  return null;
        }

  const { id } = useParams(); // quiz id

  const [text, setText] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) {
      alert("Enter question text");
      return;
    }

    let payload = {
      question_text: text,
      question_type: type,
      options: null,
      correct_answer: correctAnswer,
    };

    if (type === "mcq") {
      const cleanedOptions = options.filter((o) => o.trim() !== "");
      if (cleanedOptions.length < 2) {
        alert("MCQ must have at least 2 options");
        return;
      }
      if (!cleanedOptions.includes(correctAnswer)) {
        alert("Correct answer must match one of the options");
        return;
      }

      payload.options = cleanedOptions;
    }

    if (type === "true_false") {
      payload.options = ["true", "false"];

      if (correctAnswer !== "true" && correctAnswer !== "false") {
        alert("Select correct answer");
        return;
      }
    }

    try {
      setLoading(true);
      await addQuestionAPI(id, payload);
      setLoading(false);

      alert("Question added!");

      // Reset UI
      setText("");
      setCorrectAnswer("");
      setOptions(["", "", "", ""]);
      setType("text");
    } catch (err) {
      console.error(err);
      alert("Error adding question");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Questions to Quiz #{id}</h2>

      <br />

      <label>Question Text</label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "8px", width: "400px", display: "block" }}
      />

      <br />
      <label>Question Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: "8px", width: "200px", display: "block" }}
      >
        <option value="text">Text</option>
        <option value="mcq">MCQ</option>
        <option value="true_false">True / False</option>
      </select>

      {/* MCQ UI */}
      {type === "mcq" && (
        <div style={{ marginTop: "15px" }}>
          <h4>Options</h4>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }}
              style={{
                padding: "8px",
                width: "300px",
                display: "block",
                marginBottom: "8px",
              }}
            />
          ))}

          <label>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            style={{ padding: "8px", width: "300px", display: "block" }}
          >
            <option value="">Select correct option</option>

            {/* Show only non-empty options */}
            {options
              .filter((o) => o.trim() !== "")
              .map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* True/False UI */}
      {type === "true_false" && (
        <div style={{ marginTop: "15px" }}>
          <label>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            style={{ padding: "8px", width: "300px", display: "block" }}
          >
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      )}

      {/* Text Type */}
      {type === "text" && (
        <div style={{ marginTop: "15px" }}>
          <label>Correct Answer</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Correct answer"
            style={{ padding: "8px", width: "300px", display: "block" }}
          />
        </div>
      )}

      <br />
      <button
        onClick={handleAdd}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#444",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Adding..." : "Add Question"}
      </button>
    </div>
  );
}
