import { useNavigate } from "react-router-dom";

const OAuthButton = ({ provider, iconSrc }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 1. Fetch the state token from backend
      const response = await fetch("http://localhost:8080/oauth2/state", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to get state token");
      const stateToken = await response.text();

      // 2. Construct the GitHub OAuth URL
      const params = new URLSearchParams({
        client_id: "YOUR_GITHUB_CLIENT_ID", // Replace with your actual GitHub client ID
        redirect_uri: "http://localhost:8080/login/oauth2/code/github",
        scope: "user:email",
        state: stateToken,
        allow_signup: "false"
      });

      const popup = window.open(
        `https://github.com/login/oauth/authorize?${params.toString()}`,
        "GitHubOAuthPopup",
        "width=800,height=600"
      );

      if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
      }

      // 3. Message listener for OAuth response
      const messageListener = (event) => {
        if (event.origin !== "http://localhost:8080") return;
        if (event.data.type === "OAUTH_SUCCESS") {
          localStorage.setItem("token", event.data.token);
          window.removeEventListener("message", messageListener);
          popup?.close();
          navigate("/dashboard");
        }
      };

      window.addEventListener("message", messageListener);

      // 4. Timeout cleanup
      const timeout = setTimeout(() => {
        window.removeEventListener("message", messageListener);
        popup?.close();
        alert("Login timed out. Please try again.");
      }, 15000);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("GitHub OAuth failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
    >
      <img src={iconSrc} alt={provider} className="h-5 w-5 mr-2" />
      <span>Continue with {provider}</span>
    </button>
  );
};

export default OAuthButton;