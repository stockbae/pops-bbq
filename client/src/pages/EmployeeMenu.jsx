import { useEffect, useState } from "react";
import MenuManager from "./MenuManager";
import "../App.css";
import './EmployeeMenu.css';

export default function EmployeeMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

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
    load();
  }, []);

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

  if (loading) return <div className="employee-page loading">Loading...</div>;

  if (error) return <div className="employee-page error">{error}</div>;

  return (
    <div className="employee-page">
      <MenuManager items={items} onSave={handleSave} onCreate={handleCreate} onDelete={handleDelete} creating={isCreating} />
    </div>
  );
}
