import GoogleLoginButton from "../components/GoogleLoginButton";
import { googleLoginAPI } from "../api/api";

export default function AdminLogin() {
  async function handleLoginGoogle(idToken) {
    try {
      // Send Google ID token to backend; backend verifies and returns our JWT
      const res = await googleLoginAPI(idToken);
      // res is an axios response; data contains token and email
      const { token, email } = res.data;

      // store admin token and email in localStorage
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_email", email);

      alert("Login successful — you are now admin.");
      // redirect to admin dashboard or create page
      window.location.href = "/admin/create";
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed or not authorized as admin.");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>
      <p>Sign in with a Google account that is allowed to manage quizzes.</p>
      <div style={{ marginTop: 16 }}>
        <GoogleLoginButton onSuccess={handleLoginGoogle} />
      </div>
    </div>
  );
}
