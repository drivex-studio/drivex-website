import { defineConfig } from "cva";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // custom font-size / typography tokens
      text: [
        (value) =>
          [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "subheadline",
            "body-lg",
            "body-sm",
            "body",
            "accent-lg",
            "accent",
          ].some((token) => value === token || value.startsWith(`${token}-`)),
      ],
      // custom color tokens
      color: [
        (value) =>
          [
            "background",
            "background-muted",
            "foreground",
            "foreground-muted",
            "brand",
            "brand-muted",
            "border",
            "border-muted",
            "surface",
            "black",
            "white",
            "transparent",
            "current",
            "inherit",
          ].includes(value),
      ],
    },
    classGroups: {
      "font-family": [{ font: ["sans", "mono"] }],
    },
  },
});

const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});

export { cva, cx };
