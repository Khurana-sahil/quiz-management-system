import { useEffect } from "react";

/**
 * GoogleLoginButton
 * Props:
 *   - onSuccess(idToken)  // receives the Google ID token (credential)
 */
export default function GoogleLoginButton({ onSuccess }) {
  useEffect(() => {
    /* global google */
    if (!window.google) {
      console.error("Google script not loaded. Ensure <script src='https://accounts.google.com/gsi/client'> is in index.html");
      return;
    }

    google.accounts.id.initialize({
      client_id: "227429083368-lu5bqbc4e4hmbotiv0ea8kdmdbjull9o.apps.googleusercontent.com",
      callback: handleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large" } // customization
    );

    // optional prompt (auto)
    // google.accounts.id.prompt();
  }, []);

  function handleResponse(response) {
    // response.credential is the ID token
    onSuccess(response.credential);
  }

  return <div id="google-login-btn"></div>;
}
