import { useEffect, useState } from "react";
import "../App.css";

export default function MenuManager({ items = [], meats = [], sides = [], onSave, onCreate, onDelete, onSaveMeat, onSaveSide, onReloadMeatsAndSides, creating = false }) {
  const [local, setLocal] = useState([]);
  const [localMeats, setLocalMeats] = useState([]);
  const [localSides, setLocalSides] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", description: "", is_available: 1 });

  useEffect(() => {
    setLocal(items.map((it) => ({ ...it })));
  }, [items]);

  useEffect(() => {
    setLocalMeats(meats.map((m) => ({ ...m })));
  }, [meats]);

  useEffect(() => {
    setLocalSides(sides.map((s) => ({ ...s })));
  }, [sides]);

  const updateField = (idx, field, value) => {
    setLocal((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
    // any manual change clears the "saved" indicator
    try { setSaved(false); } catch (e) {}
  };

  const updateMeat = (idx, field, value) => {
    setLocalMeats((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
    setSaved(false);
  };

  const updateSide = (idx, field, value) => {
    setLocalSides((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
    setSaved(false);
  };

  const saveAll = async () => {
    const changed = local.filter((item) => {
      const orig = items.find((o) => o.id === item.id) || {};
      return (
        item.name !== orig.name ||
        String(item.price) !== String(orig.price) ||
        item.is_available !== orig.is_available
      );
    });

    const changedMeats = localMeats.filter((meat) => {
      const orig = meats.find((m) => m.id === meat.id) || {};
      return meat.is_available !== orig.is_available;
    });

    const changedSides = localSides.filter((side) => {
      const orig = sides.find((s) => s.id === side.id) || {};
      return side.is_available !== orig.is_available;
    });

    if (changed.length === 0 && changedMeats.length === 0 && changedSides.length === 0) return;

    setIsSaving(true);
    try {
      // Save menu items
      if (onSave) {
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
      }

      // Save meats
      if (onSaveMeat) {
        for (const meat of changedMeats) {
          await onSaveMeat(meat.id, { is_available: meat.is_available });
        }
      }

      // Save sides
      if (onSaveSide) {
        for (const side of changedSides) {
          await onSaveSide(side.id, { is_available: side.is_available });
        }
      }

      // Reload meats and sides to ensure UI is in sync
      if ((changedMeats.length > 0 || changedSides.length > 0) && onReloadMeatsAndSides) {
        await onReloadMeatsAndSides();
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
              (local.some((item) => {
                const orig = items.find((o) => o.id === item.id) || {};
                return (
                  item.name !== orig.name ||
                  String(item.price) !== String(orig.price) ||
                  item.is_available !== orig.is_available
                );
              }) ||
              localMeats.some((meat) => {
                const orig = meats.find((m) => m.id === meat.id) || {};
                return meat.is_available !== orig.is_available;
              }) ||
              localSides.some((side) => {
                const orig = sides.find((s) => s.id === side.id) || {};
                return side.is_available !== orig.is_available;
              }))
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
          id="add-description"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem((s) => ({ ...s, description: e.target.value }))}
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
              <td colSpan={5} className="category-row">
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
                  <div className="menu-text description-text">{item.description || "—"}</div>
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

        <tbody>
          <tr>
            <td colSpan={5} className="category-row">Meats</td>
          </tr>
          {localMeats.map((meat, idx) => (
            <tr key={`meat-${meat.id}`} className="menu-row">
              <td className="delete-cell"></td>
              <td colSpan="3">
                <div className="menu-text">{meat.name}</div>
              </td>
              <td className="avail-cell">
                <label>
                  <input
                    type="checkbox"
                    checked={!!meat.is_available}
                    onChange={() => updateMeat(idx, "is_available", !meat.is_available)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>

        <tbody>
          <tr>
            <td colSpan={5} className="category-row">Sides</td>
          </tr>
          {localSides.map((side, idx) => (
            <tr key={`side-${side.id}`} className="menu-row">
              <td className="delete-cell"></td>
              <td colSpan="3">
                <div className="menu-text">{side.name}</div>
              </td>
              <td className="avail-cell">
                <label>
                  <input
                    type="checkbox"
                    checked={!!side.is_available}
                    onChange={() => updateSide(idx, "is_available", !side.is_available)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
