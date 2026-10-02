'use client'
import React, { useState, useRef, useEffect } from 'react'; 
import { useGSAP } from '@gsap/react'; 
import gsap from 'gsap'; 
import { cx } from '@/libs/utils/className';
import { ChevronIcon } from '@/components/ui/Icons';
import { filterButtonStyles, filterIconStyles, filterTextStyles } from '@/sections/workpage/utils/viewModes';

export function FilterDropdown({ label, options, value, onChange, className, size = "default", theme = "light" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useGSAP(() => {
    if (menuRef.current) {
      gsap.killTweensOf(menuRef.current);
      if (isOpen) {
        gsap.set(menuRef.current, { visibility: "visible" });
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, scale: 0.95, y: -8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(menuRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -8,
          duration: 0.21,
          ease: "power2.out",
          onComplete: () => {
            if (menuRef.current) gsap.set(menuRef.current, { visibility: "hidden" });
          }
        });
      }
    }
  }, { scope: containerRef, dependencies: [isOpen] });

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDownSelect = (e, option) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(option);
    }
  };

  const allOptions = [null, ...options];
  const containerClassName = cx("relative", className);
  const displayLabel = value ?? (label ?? "FILTER");

  return (
    <div ref={containerRef} className={containerClassName}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cx(filterButtonStyles({ size }), isOpen && "group")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-open={isOpen}
      >
        <span className="relative flex w-full items-center gap-6">
          <span className={cx(filterIconStyles({ size, theme, position: "left" }), isOpen && "rotate-0 scale-100")}>
            <ChevronIcon className="rotate-180" />
          </span>
          <span className={cx(filterTextStyles({ size, theme }), isOpen && "translate-x-0")}>
            {value && <span className="size-8 bg-brand" />}
            <span className="text-accent-sm">{displayLabel}</span>
          </span>
          <span className={cx(filterIconStyles({ size, theme, position: "right" }), isOpen && "-rotate-45 scale-0")}>
            <ChevronIcon />
          </span>
        </span>
      </button>
      <div
        ref={menuRef}
        className="absolute top-full left-0 z-50 mt-8 min-w-200 origin-top-left bg-background md:min-w-0"
        style={{ visibility: "hidden", opacity: 0 }}
        role="listbox"
        tabIndex={-1}
        data-theme="dark"
      >
        <div className="py-8">
          {allOptions.map((option) => {
            const isSelected = option === value;
            const optionLabel = option ?? "All";
            return (
              <div
                key={option ?? "all"}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDownSelect(e, option)}
                onClick={() => handleSelect(option)}
                className={cx("flex cursor-pointer items-center gap-8 px-16 py-8 transition-colors hover:bg-surface", isSelected && "text-brand")}
              >
                {isSelected && <span className="size-8 bg-brand" />}
                <span className="text-accent-sm">[{optionLabel}]</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}