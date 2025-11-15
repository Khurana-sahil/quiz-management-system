import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizAPI } from "../api/api";

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const data = await getQuizAPI(id);
      setQuiz(data);
    } catch (err) {
      console.error(err);
      alert("Error loading quiz");
    }
  };

  const handleChange = (qId, value) => {
    setAnswers({
      ...answers,
      [qId]: value,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!quiz) return <div style={{ padding: "20px" }}>Loading...</div>;

  if (!submitted)
    return (
      <div style={{ padding: "20px" }}>
        <h2>{quiz.title}</h2>

        {quiz.questions.map((q) => (
          <div
            key={q.id}
            style={{
              background: "#222",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p><strong>{q.text}</strong></p>

            {q.type === "mcq" && (
              <div>
                {q.options.map((opt, idx) => (
                  <label key={idx} style={{ display: "block", margin: "4px 0" }}>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      onChange={() => handleChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "true_false" && (
              <div>
                <label style={{ display: "block", margin: "4px 0" }}>
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value="true"
                    onChange={() => handleChange(q.id, "true")}
                  />
                  True
                </label>

                <label style={{ display: "block", margin: "4px 0" }}>
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value="false"
                    onChange={() => handleChange(q.id, "false")}
                  />
                  False
                </label>
              </div>
            )}

            {q.type === "text" && (
              <input
                type="text"
                placeholder="Your answer"
                onChange={(e) => handleChange(q.id, e.target.value)}
                style={{ padding: "8px", width: "300px" }}
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 20px",
            background: "#444",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Quiz
        </button>
      </div>
    );

  let score = 0;
  quiz.questions.forEach((q) => {
    if (
      answers[q.id]?.toString().trim().toLowerCase() ===
      q.correct_answer.toString().trim().toLowerCase()
    ) {
      score++;
    }
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>{quiz.title}</h2>
      <h3>Score: {score} / {quiz.questions.length}</h3>

      {quiz.questions.map((q) => {
        const isCorrect =
          answers[q.id]?.toString().trim().toLowerCase() ===
          q.correct_answer.toString().trim().toLowerCase();

        return (
          <div
            key={q.id}
            style={{
              background: isCorrect ? "#0a3" : "#500",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p><strong>{q.text}</strong></p>
            <p>Your answer: {answers[q.id] || "No answer"}</p>
            <p>Correct answer: {q.correct_answer}</p>
          </div>
        );
      })}
    </div>
  );
}
