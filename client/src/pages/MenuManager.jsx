import { useEffect, useState } from "react";
import "../App.css";

export default function MenuManager({ items = [], onSave }) {
  const [local, setLocal] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocal(items.map((it) => ({ ...it })));
  }, [items]);

  const updateField = (idx, field, value) => {
    setLocal((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const saveAll = async () => {
    if (!onSave) return;
    setIsSaving(true);

    try {
      const changed = local.filter((item, idx) => {
        const orig = items[idx];
        return (
          item.name !== orig.name ||
          item.price !== orig.price ||
          item.is_available !== orig.is_available
        );
      });

      for (const item of changed) {
        const orig = items.find((o) => o.id === item.id);
        await onSave(item.id, {
          name: item.name !== orig.name ? item.name : undefined,
          price: item.price !== orig.price ? item.price : undefined,
          is_available:
            item.is_available !== orig.is_available
              ? item.is_available
              : undefined,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Group items by category
  const groups = {};
  const order = [];

  local.forEach((item, idx) => {
    const cat = item.category || "Uncategorized";
    if (!groups[cat]) {
      groups[cat] = [];
      order.push(cat);
    }
    groups[cat].push({ item, idx });
  });

  return (
    <div className="menu-manager">
      <div className="menu-manager-header">
        <h2>Employee Menu Editor</h2>
        <button className="save-btn" onClick={saveAll} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All"}
        </button>
      </div>

      <table className="menu-table">
        <tbody>
          {order.map((category) => (
            <tbody key={category}>
              <tr>
                <td colSpan={4} className="category-row">
                  {category}
                </td>
              </tr>

              {groups[category].map(({ item, idx }) => (
                <tr key={item.id} className="menu-row">
                  <td>{item.id}</td>

                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                      className="menu-input"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateField(idx, "price", e.target.value)
                      }
                      className="menu-input"
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={!!item.is_available}
                      onChange={() =>
                        updateField(idx, "is_available", !item.is_available)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </tbody>
      </table>
    </div>
  );
}
