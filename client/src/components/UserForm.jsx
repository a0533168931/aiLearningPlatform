import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import "../styles/UserForm.css";

export default function UserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await userApi.create(formData);
      const user = response?.data?.user;
      const token = response?.data?.token;

      if (!user?.id || !token) throw new Error("Registration response was empty.");

      useAuthStore.getState().setAuth(user, token);

      setSuccess("User registered successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const loginResponse = await userApi.login({ phone: formData.phone });
          const user = loginResponse?.data?.user;
          const token = loginResponse?.data?.token;

          if (!user?.id || !token) throw new Error("Login failed.", { cause: err });

          useAuthStore.getState().setAuth(user, token);

          setSuccess("User already exists. Logged in successfully.");
          navigate("/dashboard", { replace: true });
          return;
        } catch (loginError) {
          setError(loginError.response?.data?.message || "Failed to login existing user");
          return;
        }
      }
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <div className="form-brand">
        <div className="form-brand-icon">✦</div>
        <h1>Welcome</h1>
        <span className="form-subtitle">Sign in or create your account</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>

        {error && <p className="form-message error">{error}</p>}
        {success && <p className="form-message success">{success}</p>}

        <button className="submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Continue →"}
        </button>
      </form>
    </div>
  );
}
