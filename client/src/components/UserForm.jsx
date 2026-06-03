import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";

export default function UserForm() {
  const navigate = useNavigate();

  // form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // ui states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // update inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await userApi.create(formData);
      const user = response?.data?.data ?? response?.data ?? null;

      if (!user) {
        throw new Error("Registration response was empty.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("User registered successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h1>Register</h1>
    
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
    
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}