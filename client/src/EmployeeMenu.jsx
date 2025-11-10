import { useEffect, useState } from "react";
import MenuManager from "./MenuManager";

export default function EmployeeMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px" }}>
      <MenuManager items={items} onSave={handleSave} />
    </div>
  );
}
