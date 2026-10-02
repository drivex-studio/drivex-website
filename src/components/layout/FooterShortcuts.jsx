import React from "react";

export function FooterShortcuts() {
  const dispatchColorChange = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }));
  };

  const dispatchGridToggle = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", metaKey: true, bubbles: true }));
  };

  return (
    <div className="flex flex-col gap-4 text-accent-sm text-foreground-muted opacity-40">
      <button type="button" className="flex cursor-pointer items-center gap-6" onClick={dispatchGridToggle}>
        <kbd className="bg-surface px-4 py-2">⌘G</kbd> grid
      </button>
      <button type="button" className="flex cursor-pointer items-center gap-6" onClick={dispatchColorChange}>
        <kbd className="bg-surface px-4 py-2">C</kbd> change color
      </button>
    </div>
  );
}
