import { useEffect, useState } from "react";

const mobileStyle = `
  @media (max-width: 768px) {
    table {
      font-size: 14px;
    }
    th, td {
      padding: 6px !important;
    }
    button {
      padding: 4px 8px;
      font-size: 12px;
    }
  }
`;

export default function MenuManager({ items = [], onSave }) {
  const [local, setLocal] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocal(items.map((it) => ({ ...it })));
  }, [items]);

  const toggle = (idx) => {
    setLocal((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], is_available: !copy[idx].is_available };
      return copy;
    });
  };

  const saveAll = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      // Find items that changed (name, price, or is_available)
      const changed = local.filter((item, idx) => {
        const orig = items[idx];
        return (
          item.name !== orig.name ||
          item.price !== orig.price ||
          item.is_available !== orig.is_available
        );
      });
      // Save each changed item
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

  const updateField = (idx, field, value) => {
    setLocal((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Group items by category while preserving original index positions
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
    <div>
      <style>{mobileStyle}</style>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ display: "inline-block", marginRight: "20px" }}>Employee Menu Editor</h2>
        <button
          onClick={saveAll}
          disabled={isSaving}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          {isSaving ? "Saving..." : "Save All"}
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {order.map((category) => (
            <tbody key={category}>
              <tr>
                <td colSpan={4} style={{ padding: "8px", background: "#f7f7f7", fontWeight: "600" }}>{category}</td>
              </tr>
              {groups[category].map(({ item, idx }) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{item.id}</td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateField(idx, "price", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!item.is_available}
                        onChange={() => updateField(idx, "is_available", !item.is_available)}
                      />
                    </label>
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
