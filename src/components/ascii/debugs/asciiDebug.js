// asciiDebug.js

const ASCII_DEBUG_OVERLAY_ID = "ascii-debug-atlas";
const ASCII_DEBUG_OVERLAY_TITLE = "ASCII Atlas";
const ASCII_DEBUG_VERSION = "2026-01-26-2";

const debugState = {
  enabled: false,
  textureCount: 0,
  debugMode: null
};

// Original mangled variables:
// fc -> atlasSourceCanvas
// fu -> atlasOptions
// fh -> lastStatsLog
let atlasSourceCanvas = null;
let atlasOptions = null;
let lastStatsLog = null;

/**
 * Creates or returns the ASCII debug overlay.
 *
 * This restores the missing code immediately before:
 * ("ascii-debug-atlas", "ASCII Atlas");
 */
function getOrCreateDebugOverlay(id, title) {
  if (typeof document === "undefined") {
    return null;
  }

  let overlay = document.getElementById(id);

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = id;

    Object.assign(overlay.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      zIndex: "999999",
      padding: "10px",
      background: "rgba(0, 0, 0, 0.9)",
      border: "1px solid #444",
      borderRadius: "4px",
      color: "#fff",
      fontFamily: "monospace",
      fontSize: "12px",
      lineHeight: "1.5",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflow: "auto"
    });

    document.body.appendChild(overlay);
  }

  overlay.dataset.title = title;

  return overlay;
}

/**
 * Restored version of original `fd(sourceCanvas, options)`.
 */
export function renderAtlas(sourceCanvas, options) {
  if (
    typeof document === "undefined" ||
    !sourceCanvas ||
    !options
  ) {
    return;
  }

  const container = getOrCreateDebugOverlay(
    ASCII_DEBUG_OVERLAY_ID,
    ASCII_DEBUG_OVERLAY_TITLE
  );

  if (!container) return;

  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }

  const titleElement = document.createElement("div");
  titleElement.textContent = ASCII_DEBUG_OVERLAY_TITLE;
  titleElement.style.fontWeight = "bold";
  titleElement.style.marginBottom = "4px";
  titleElement.style.color = "#ff6b4a";
  container.appendChild(titleElement);

  const infoElement = document.createElement("div");
  infoElement.textContent =
    `size=${options.size} ` +
    `cell=${options.cell} ` +
    `chars=${options.characters.length} ` +
    `font=${options.fontSize}px`;

  infoElement.style.color = "#ccc";
  infoElement.style.marginBottom = "6px";
  container.appendChild(infoElement);

  const previewCanvas = document.createElement("canvas");
  previewCanvas.width = 2 * options.size;
  previewCanvas.height = 2 * options.size;

  const context = previewCanvas.getContext("2d");

  if (!context) {
    container.appendChild(previewCanvas);
    return;
  }

  context.imageSmoothingEnabled = false;

  context.drawImage(
    sourceCanvas,
    0,
    0,
    2 * options.size,
    2 * options.size
  );

  context.strokeStyle = "rgba(255,255,255,0.15)";
  context.lineWidth = 1;

  for (
    let position = 0;
    position <= options.size;
    position += options.cell
  ) {
    const offset = 2 * position + 0.5;

    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset, 2 * options.size);
    context.stroke();

    context.beginPath();
    context.moveTo(0, offset);
    context.lineTo(2 * options.size, offset);
    context.stroke();
  }

  previewCanvas.style.width = `${options.size}px`;
  previewCanvas.style.height = `${options.size}px`;
  previewCanvas.style.border = "1px solid #444";
  previewCanvas.style.display = "block";

  container.appendChild(previewCanvas);
}

/**
 * Original `fp`.
 */
export function logAtlasStats(context, options) {
  const { size } = options;
  const imageData = context.getImageData(0, 0, size, size).data;

  let nonBlackPixels = 0;
  let nonZeroAlphaPixels = 0;
  let rgbWithZeroAlpha = 0;
  let maxAlpha = 0;

  for (let index = 0; index < imageData.length; index += 4) {
    const red = imageData[index];
    const green = imageData[index + 1];
    const blue = imageData[index + 2];
    const alpha = imageData[index + 3] ?? 0;

    if (red || green || blue) {
      nonBlackPixels++;
    }

    if (alpha > 0) {
      nonZeroAlphaPixels++;
    }

    if ((red || green || blue) && alpha === 0) {
      rgbWithZeroAlpha++;
    }

    if (alpha > maxAlpha) {
      maxAlpha = alpha;
    }
  }

  const statsKey =
    `${nonBlackPixels}:` +
    `${nonZeroAlphaPixels}:` +
    `${rgbWithZeroAlpha}:` +
    `${maxAlpha}`;

  if (statsKey === lastStatsLog) {
    return;
  }

  lastStatsLog = statsKey;

  console.log(
    "%c[ASCII Debug] Atlas stats",
    "color: #ff6b4a; font-weight: bold",
    {
      size: options.size,
      cell: options.cell,
      characters: options.characters.length,
      fontSize: options.fontSize,
      nonBlackPixels,
      nonZeroAlphaPixels,
      rgbWithZeroAlpha,
      maxAlpha
    }
  );
}

/**
 * Original `ff`.
 */
export function isAsciiDebugEnabled() {
  return (
    debugState.enabled ||
    (
      typeof window !== "undefined" &&
      window.__ASCII_DEBUG__ === true
    )
  );
}

/**
 * Original `fm`.
 */
export function setAsciiDebugEnabled(enabled) {
  debugState.enabled = enabled;

  if (!enabled) return;

  console.log(
    "%c[ASCII Debug] Enabled",
    "color: #ff6b4a; font-weight: bold",
    `\nVersion: ${ASCII_DEBUG_VERSION}`,
    `\nTexture count: ${debugState.textureCount}`,
    "\nTo disable: window.__ASCII_DEBUG__ = false"
  );

  if (!atlasSourceCanvas || !atlasOptions) {
    return;
  }

  renderAtlas(atlasSourceCanvas, atlasOptions);

  const context = atlasSourceCanvas.getContext("2d");

  if (context) {
    logAtlasStats(context, atlasOptions);
  }
}

/**
 * Original `fg`.
 */
export function incrementTextureCount() {
  debugState.textureCount++;

  if (isAsciiDebugEnabled()) {
    console.log(
      `%c[ASCII Debug] Texture created ` +
      `(total: ${debugState.textureCount})`,
      "color: #888"
    );
  }
}

/**
 * Original `fv`.
 */
export function decrementTextureCount() {
  debugState.textureCount = Math.max(
    0,
    debugState.textureCount - 1
  );

  if (isAsciiDebugEnabled()) {
    console.log(
      `%c[ASCII Debug] Texture disposed ` +
      `(total: ${debugState.textureCount})`,
      "color: #888"
    );
  }
}

/**
 * Stores the generated character-atlas canvas and its metadata.
 *
 * This assignment was outside the provided fragment, so this function
 * should be called from createCharactersTexture().
 */
export function registerAsciiAtlas(sourceCanvas, options) {
  atlasSourceCanvas = sourceCanvas;
  atlasOptions = options;

  if (isAsciiDebugEnabled()) {
    renderAtlas(atlasSourceCanvas, atlasOptions);

    const context = atlasSourceCanvas.getContext("2d");

    if (context) {
      logAtlasStats(context, atlasOptions);
    }
  }
}

export function unregisterAsciiAtlas(sourceCanvas = null) {
  if (sourceCanvas && sourceCanvas !== atlasSourceCanvas) {
    return;
  }

  atlasSourceCanvas = null;
  atlasOptions = null;
  lastStatsLog = null;
}

export const asciiDebugUtils = {
  enable() {
    setAsciiDebugEnabled(true);
  },

  disable() {
    setAsciiDebugEnabled(false);
  },

  getTextureCount() {
    return debugState.textureCount;
  },

  setDebugMode(mode) {
    debugState.debugMode = mode;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ascii-debug-mode", {
          detail: mode
        })
      );
    }

    if (isAsciiDebugEnabled()) {
      console.log(
        "%c[ASCII Debug] Debug mode",
        "color: #ff6b4a; font-weight: bold",
        mode
      );
    }
  },

  getDebugMode() {
    return debugState.debugMode;
  },

  showAtlas() {
    if (atlasSourceCanvas && atlasOptions) {
      renderAtlas(atlasSourceCanvas, atlasOptions);
      return;
    }

    console.warn(
      "[ASCII Debug] No atlas available yet. " +
      "Try refreshAtlas() after the scene renders."
    );
  },

  logAtlasStats() {
    if (!atlasSourceCanvas || !atlasOptions) {
      console.warn(
        "[ASCII Debug] No atlas available yet. " +
        "Try refreshAtlas() after the scene renders."
      );
      return;
    }

    const context = atlasSourceCanvas.getContext("2d");

    if (context) {
      logAtlasStats(context, atlasOptions);
    }
  },

  refreshAtlas() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ascii-debug-refresh")
      );
    }
  },

  clearOverlays() {
    if (typeof document === "undefined") {
      return;
    }

    const overlay = document.getElementById(
      ASCII_DEBUG_OVERLAY_ID
    );

    overlay?.parentElement?.removeChild(overlay);
  }
};

if (typeof window !== "undefined") {
  window.__ASCII_DEBUG_UTILS__ = asciiDebugUtils;
  window.ASCII_DEBUG_UTILS = asciiDebugUtils;
}
