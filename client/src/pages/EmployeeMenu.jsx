import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuManager from "./MenuManager";
import { useEmployeeAuth } from "../hooks/useEmployeeAuth";
import "../App.css";
import './EmployeeMenu.css';

export default function EmployeeMenu() {
  const [items, setItems] = useState([]);
  const [meats, setMeats] = useState([]);
  const [sides, setSides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    isAuthenticated,
    passwordInput,
    setPasswordInput,
    passwordError,
    isLoggingIn,
    handleLogin,
  } = useEmployeeAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuRes, meatsRes, sidesRes] = await Promise.all([
        fetch("/api/menu/all"),
        fetch("/api/meats/all"),
        fetch("/api/sides/all")
      ]);
      
      if (!menuRes.ok || !meatsRes.ok || !sidesRes.ok) {
        throw new Error("Failed to load data");
      }
      
      const [menuData, meatsData, sidesData] = await Promise.all([
        menuRes.json(),
        meatsRes.json(),
        sidesRes.json()
      ]);
      
      setItems(menuData);
      setMeats(meatsData);
      setSides(sidesData);
    } catch (err) {
      console.error(err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const reloadMeatsAndSides = async () => {
    try {
      const [meatsRes, sidesRes] = await Promise.all([
        fetch("/api/meats/all"),
        fetch("/api/sides/all")
      ]);
      
      if (!meatsRes.ok || !sidesRes.ok) {
        throw new Error("Failed to reload data");
      }
      
      const [meatsData, sidesData] = await Promise.all([
        meatsRes.json(),
        sidesRes.json()
      ]);
      
      setMeats(meatsData);
      setSides(sidesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
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

  // Save meat availability
  const handleSaveMeat = async (id, updates) => {
    try {
      const res = await fetch(`/api/meats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      // Ensure is_available is properly converted to number
      updated.is_available = Number(updated.is_available);
      setMeats((prev) => [...prev.map((m) => (m.id === updated.id ? updated : m))]);
    } catch (err) {
      console.error(err);
      setError("Failed to save meat");
    }
  };

  // Save side availability
  const handleSaveSide = async (id, updates) => {
    try {
      const res = await fetch(`/api/sides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      // Ensure is_available is properly converted to number
      updated.is_available = Number(updated.is_available);
      setSides((prev) => [...prev.map((s) => (s.id === updated.id ? updated : s))]);
    } catch (err) {
      console.error(err);
      setError("Failed to save side");
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
      <div className="employee-nav">
        <Link to="/employee-orders" className="orders-link">View Pending Orders →</Link>
      </div>
      <MenuManager 
        items={items} 
        meats={meats}
        sides={sides}
        onSave={handleSave} 
        onCreate={handleCreate} 
        onDelete={handleDelete} 
        onSaveMeat={handleSaveMeat}
        onSaveSide={handleSaveSide}
        onReloadMeatsAndSides={reloadMeatsAndSides}
        creating={isCreating} 
      />
    </div>
  );
}
