import { useNavigate } from "react-router-dom";
const OAuthButton = ({ provider, iconSrc }) => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      // 1. Fetch the state token from backend (for CSRF protection)
      const response = await fetch("http://localhost:8080/oauth2/state", {
        credentials: "include", // Important for session-based auth
      });

      if (!response.ok) throw new Error("Failed to get state token");

      const stateToken = await response.text();

      // Optional: Validate stateToken format (UUID-style)
      if (!/^[0-9a-f]{8}-/.test(stateToken)) {
        throw new Error("Invalid state token format");
      }

      // 2. Construct the OAuth URL safely using URLSearchParams
      const params = new URLSearchParams({
        client_id:
          "327426395255-vuv89ee4qrg3dlgpdcsmiulmrvof5pb2.apps.googleusercontent.com",
        redirect_uri: "http://localhost:8080/login/oauth2/code/google",
        response_type: "code",
        scope: "email profile",
        state: stateToken,
      });

      const popup = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
        "OAuthPopup",
        "width=600,height=600"
      );

      if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
      }

      // 3. Listen for postMessage from popup
      const messageListener = (event) => {
        if (event.origin !== "http://localhost:8080") return;

        if (event.data.type === "OAUTH_SUCCESS") {
          localStorage.setItem("token", event.data.token);
          clearTimeout(timeout);
          window.removeEventListener("message", messageListener);
          popup?.close(); // Safely close the popup
          navigate("/dashboard");
        }
      };

      window.addEventListener("message", messageListener);

      // 4. Timeout fallback after 15 seconds
      const timeout = setTimeout(() => {
        window.removeEventListener("message", messageListener);
        if (!popup.closed) {
          try {
            popup.close();
          } catch (e) {
            console.warn("Could not close popup:", e);
          }
        }
        alert("Login timed out. Please try again.");
      }, 15000);
    } catch (error) {
      console.error("OAuth failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className=" bg-blue-600 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
    >
        <span className="">Continue with {provider}</span>
      <img src={iconSrc} alt={provider} className="h-5 w-5 mr-2" />
    
    </button>
  );
};

export default OAuthButton;
