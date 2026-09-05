import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminDashboard from "../components/AdminDashboard";

export default function AdminPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser?.id) {
      navigate("/", { replace: true });
      return;
    }

    if (storedUser.role !== "ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    setAllowed(true);
  }, [navigate]);

  if (!allowed) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div>
        <AdminDashboard />
      </div>
    </>
  );
}