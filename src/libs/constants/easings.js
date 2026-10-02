const noop = (t) => t;

const mirrorEasing = (easing) => (p) =>
  p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
const calcBezier = (t, a1, a2) =>
  (((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t;

const subdivisionPrecision = 0.0000001;
const subdivisionMaxIterations = 12;

function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0.0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}

export function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2) return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => (t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2));
}

const backOut = cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = reverseEasing(backOut);
const backInOut = mirrorEasing(backIn);

const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);

const anticipate = (p) => {
  p *= 2;
  return p < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
};

const easeIn = cubicBezier(0.42, 0, 1, 1);
const easeOut = cubicBezier(0, 0, 0.58, 1);
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

const builtInEasings = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate,
};

export const easings = {
  linear: [0, 0, 1, 1],
  sineIn: [.12, 0, .39, 0],
  sineOut: [.61, 1, .88, 1],
  sineInOut: [.37, 0, .63, 1],
  quadIn: [.11, 0, .5, 0],
  quadOut: [.5, 1, .89, 1],
  quadInOut: [.45, 0, .55, 1],
  power1In: [.11, 0, .5, 0],
  power1Out: [.5, 1, .89, 1],
  power1InOut: [.45, 0, .55, 1],
  cubicIn: [.32, 0, .67, 0],
  cubicOut: [.33, 1, .68, 1],
  cubicInOut: [.65, 0, .35, 1],
  power2In: [.32, 0, .67, 0],
  power2Out: [.33, 1, .68, 1],
  power2InOut: [.65, 0, .35, 1],
  quartIn: [.5, 0, .75, 0],
  quartOut: [.25, 1, .5, 1],
  quartInOut: [.76, 0, .24, 1],
  power3In: [.5, 0, .75, 0],
  power3Out: [.25, 1, .5, 1],
  power3InOut: [.76, 0, .24, 1],
  quintIn: [.64, 0, .78, 0],
  quintOut: [.22, 1, .36, 1],
  quintInOut: [.83, 0, .17, 1],
  power4In: [.64, 0, .78, 0],
  power4Out: [.22, 1, .36, 1],
  power4InOut: [.83, 0, .17, 1],
  expoIn: [.7, 0, .84, 0],
  expoOut: [.16, 1, .3, 1],
  expoInOut: [.87, 0, .13, 1],
  expo: [.87, 0, .13, 1],
  circIn: [.55, 0, 1, .45],
  circOut: [0, .55, .45, 1],
  circInOut: [.85, 0, .15, 1],
  backIn: [.36, 0, .66, -.56],
  backOut: [.34, 1.56, .64, 1],
  backInOut: [.68, -.6, .32, 1.6],
  backInOutSubtle: [.68, -.3, .32, 1.1],
  goodFella: [.34, 1.4, .64, 1],
  smooth: [.25, .1, .25, 1]
};

const presetFunctionCache = new Map();

function resolvePreset(name) {
  if (presetFunctionCache.has(name)) return presetFunctionCache.get(name);
  const def = easings[name];
  const fn = cubicBezier(def[0], def[1], def[2], def[3]);
  presetFunctionCache.set(name, fn);
  return fn;
}

export const isBezierDefinition = (val) =>
  Array.isArray(val) && typeof val[0] === "number";


export function easingDefinitionToFunction(definition) {
  if (isBezierDefinition(definition)) {
    if (definition.length !== 4) {
      throw new Error("Cubic bezier arrays must contain four numerical values.");
    }
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  }
  if (typeof definition === "string") {
    if (builtInEasings[definition]) return builtInEasings[definition];
    if (easings[definition]) return resolvePreset(definition);
    throw new Error(`Invalid easing type '${definition}'`);
  }
  return definition;
}

export const ease = easingDefinitionToFunction;
