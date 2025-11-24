import { useEffect, useState } from "react";
import "../App.css";

export default function MenuManager({ items = [], onSave, onCreate, onDelete, creating = false }) {
  const [local, setLocal] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", description: "", is_available: 1 });

  useEffect(() => {
    setLocal(items.map((it) => ({ ...it })));
  }, [items]);

  const updateField = (idx, field, value) => {
    setLocal((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
    // any manual change clears the "saved" indicator
    try { setSaved(false); } catch (e) {}
  };

  const saveAll = async () => {
    if (!onSave) return;

    const changed = local.filter((item) => {
      const orig = items.find((o) => o.id === item.id) || {};
      return (
        item.name !== orig.name ||
        String(item.price) !== String(orig.price) ||
        item.is_available !== orig.is_available
      );
    });

    if (changed.length === 0) return;

    setIsSaving(true);
    try {
      for (const item of changed) {
        const orig = items.find((o) => o.id === item.id) || {};
        await onSave(item.id, {
          name: item.name !== orig.name ? item.name : undefined,
          price: item.price !== orig.price ? item.price : undefined,
          is_available:
            item.is_available !== orig.is_available
              ? item.is_available
              : undefined,
        });
      }

      // mark saved until the next manual change
      setSaved(true);
    } catch (err) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const createItem = async () => {
    if (!onCreate) return;
    // basic validation
    if (!newItem.name || newItem.name.trim() === "") return alert("Name is required");
    const p = parseFloat(newItem.price);
    if (isNaN(p) || p < 0) return alert("Price must be a non-negative number");

    try {
      await onCreate({ ...newItem, price: p });
      // reset form
      setNewItem({ name: "", price: "", category: "", description: "", is_available: 1 });
    } catch (err) {
      // error handled upstream
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
        <div id="header-controls">
          {/** show blue when there are unsaved changes */}
          <button
            id="save-all-btn"
            className={`save-btn ${
              // detect any differences between local and original items
              local.some((item) => {
                const orig = items.find((o) => o.id === item.id) || {};
                return (
                  item.name !== orig.name ||
                  String(item.price) !== String(orig.price) ||
                  item.is_available !== orig.is_available
                );
              })
                ? "dirty"
                : ""
            }`}
            onClick={saveAll}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : saved ? "Saved" : "Save All"}
          </button>
        </div>
      </div>

      <div id="new-item-row" className="new-item-row">
        <input
          id="add-name"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          id="add-price"
          placeholder="Price"
          type="number"
          step="0.01"
          value={newItem.price}
          onChange={(e) => setNewItem((s) => ({ ...s, price: e.target.value }))}
        />
        <input
          id="add-category"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
        />
        <button id="add-btn" className="save-btn" onClick={createItem} disabled={creating}>
          {creating ? "Adding..." : "Add Item"}
        </button>
      </div>

      <table className="menu-table">
        {order.map((category) => (
          <tbody key={category}>
            <tr>
              <td colSpan={4} className="category-row">
                {category}
              </td>
            </tr>

            {groups[category].map(({ item, idx }) => (
              <tr key={item.id} className="menu-row">
                <td className="delete-cell">
                  {onDelete && (
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) onDelete(item.id);
                      }}
                      aria-label={`Delete ${item.name}`}
                    >
                      Delete
                    </button>
                  )}
                </td>
                <td>
                  <div className="menu-text">{item.name}</div>
                </td>
                <td>
                  <div className="menu-text">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
                </td>
                <td className="avail-cell">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!item.is_available}
                      onChange={() =>
                        updateField(idx, "is_available", !item.is_available)
                      }
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
