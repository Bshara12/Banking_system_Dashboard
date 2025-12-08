import { useAuth } from "../../hooks/useAuth";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     await login({ identifier, password });
  //     navigate("/شسي");
  //   } catch (err) {
  //     setError(err.message);
  //   }

  //   setLoading(false);
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await login({ identifier, password });

      // role-based navigation
      switch (user.role_id) {
        case 1:
          navigate("/admin");
          break;
        case 2:
          navigate("/manager");
          break;
        case 3:
          navigate("/teller");
          break;
        case 4:
          navigate("/support");
          break;
        default:
          navigate("/login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Secure Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email or Phone</label>
            <input
              type="text"
              className="login-input"
              placeholder="admin@test.com / 0999..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
