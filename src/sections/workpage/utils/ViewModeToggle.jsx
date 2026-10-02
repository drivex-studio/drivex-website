import React from 'react'; 
import { cx } from '@/libs/utils/className'; 
import { VIEW_MODES } from '@/sections/workpage/utils/viewModes';

export function ViewModeToggle({ value, onChange, className }) {
  return (
    <div className={cx("flex items-center gap-4", className)} role="group" aria-label="View mode">
      {VIEW_MODES.map(({ mode, label, icon, visibility }) => {
        const isActive = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={cx(
              "size-32 cursor-pointer items-center justify-center transition-colors duration-400",
              isActive ? "bg-brand text-black" : "bg-surface/75 text-foreground hover:bg-surface",
              visibility ?? "flex"
            )}
            aria-label={label}
            aria-pressed={isActive}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}