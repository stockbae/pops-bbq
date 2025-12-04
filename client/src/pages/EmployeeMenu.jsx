import { useEffect, useState } from "react";
import MenuManager from "./MenuManager";
import "../App.css";
import './EmployeeMenu.css';

export default function EmployeeMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu/all");
        if (!res.ok) throw new Error("Failed to load menu items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated]);

  const handleSave = async (id, updates) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();

      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
      setError("Failed to save");
    }
  };

  // Create new menu item
  const handleCreate = async (payload) => {
    try {
      setIsCreating(true);
      const res = await fetch(`/api/menu/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      setError("Failed to create");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  // Delete menu item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // remove from local state
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else {
        setPasswordError(data.error || "Incorrect password. Please try again.");
        setPasswordInput("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setPasswordError("Unable to authenticate. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="employee-page">
        <div className="login-overlay">
          <div className="login-box">
            <h2>Employee Login</h2>
            <p>Enter password</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="password-input"
              />
              {passwordError && <p className="password-error">{passwordError}</p>}
              <button type="submit" className="login-btn" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="employee-page loading">Loading...</div>;

  if (error) return <div className="employee-page error">{error}</div>;

  return (
    <div className="employee-page">
      <MenuManager items={items} onSave={handleSave} onCreate={handleCreate} onDelete={handleDelete} creating={isCreating} />
    </div>
  );
}
