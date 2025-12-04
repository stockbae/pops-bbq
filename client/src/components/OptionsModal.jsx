import React, { useState } from "react";
import "../App.css";

export default function OptionsModal({ item, meats, sides, onClose, onAdd }) {
  const [selectedMeats, setSelectedMeats] = useState(item.chosenMeats || []);
  const [selectedSides, setSelectedSides] = useState(item.chosenSides || []);

  const isDinner = item.category === "Dinners";

  // RULES: how many meats/sides required
  const { meats: requiredMeats, sides: requiredSides } = getDinnerRules(item);

  function toggleMeat(id) {
    setSelectedMeats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSide(id) {
    setSelectedSides((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function confirm() {
    // VALIDATION
    if (selectedMeats.length !== requiredMeats) {
      if (requiredMeats !== 1)
        return alert(`This dinner requires exactly ${requiredMeats} meats.`);
      else
        return alert(`This dinner requires exactly ${requiredMeats} meat.`);
    }
    if (selectedSides.length !== requiredSides) {
      return alert(`This dinner requires exactly ${requiredSides} sides.`);
    }

    onAdd({
      ...item,
      chosenMeats: selectedMeats,
      chosenSides: selectedSides,
    });

    onClose();
  }

  return (
    <div className="m-backdrop">
      <div className="m-modal">
        <h2 className="m-title">{item.name}</h2>

        {isDinner && (
          <>
            {/* MEATS (optional depending on item) */}
            {requiredMeats > 0 && (
              <>
                <h3 className="m-label">
                  Choose {requiredMeats} Meat{requiredMeats > 1 ? "s" : ""}
                </h3>
                <div className="m-options-container">
                  {meats.map((meat) => (
                    <label key={meat.id} className="m-option">
                      <input
                        type="checkbox"
                        checked={selectedMeats.includes(meat.id)}
                        onChange={() => toggleMeat(meat.id)}
                      />
                      {meat.name}
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* SIDES */}
            <h3 className="m-label">
              Choose {requiredSides} Side{requiredSides > 1 ? "s" : ""}
            </h3>
            <div className="m-options-container">
              {sides.map((side) => (
                <label key={side.id} className="m-option">
                  <input
                    type="checkbox"
                    checked={selectedSides.includes(side.id)}
                    onChange={() => toggleSide(side.id)}
                  />
                  {side.name}
                </label>
              ))}
            </div>
          </>
        )}

        {!isDinner && <p className="m-text">This item will be added as-is.</p>}

        <div className="m-actions">
          <button className="m-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="m-btn-add" onClick={confirm}>
            Add To Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* === RULE FUNCTION === */

function getDinnerRules(item) {
  const description = item.description.toLowerCase();
  const obj = { meats: 0, sides: 0 };
  if (description.includes("meat")) {
    const value = description.substring(description.indexOf("meat") - 2, description.indexOf("meat")).trim()
    if (!isNaN(parseInt(value, 10))) {
      obj.meats = parseInt(value);
    }
  }

  if (description.includes("side")) {
    const value = description.substring(description.indexOf("side") - 2, description.indexOf("side")).trim()
    if (!isNaN(parseInt(value, 10))) {
      obj.sides = parseInt(value);
    }
  }

  return obj;
}
