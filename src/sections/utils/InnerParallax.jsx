'use client' 
import React, { useRef } from 'react'; 
import { motion } from 'framer-motion'; 
import { useScroll } from 'framer-motion'; 
import { useTransform } from 'framer-motion'; 
import { composeRefs } from '@/libs/utils/composeRefs'; 
import { cx } from '@/libs/utils/className'; 
import { screens } from '@/libs/constants/screens'; 
import { parseResponsiveValues } from '@/components/sanity/utils/parseResponsiveValues'; 

function formatPx(val) {
  const trimmed = val.trim();
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

function calculateTransformY(progress) {
  return `calc(var(--parallax-overflow) * ${2 * progress - 1})`;
}

function calculateTransformX(progress) {
  return `calc(var(--parallax-overflow) * ${2 * progress - 1})`;
}

export function InnerParallax({
  overflow,
  direction = "y",
  className,
  ref,
  children,
  style,
  ...restProps
}) {
  const internalRef = useRef(null);

  const { styles: responsiveStyles, className: responsiveClassName } = (function(overflowValue) {
    const valStr = typeof overflowValue === "number" ? `${overflowValue}px` : overflowValue;
    const parsed = parseResponsiveValues(valStr);
    const screenKeys = Object.keys(screens);
    const generatedStyles = {};
    
    const defaultVal = formatPx(parsed.DEFAULT?.value ?? valStr);
    generatedStyles["--parallax-overflow-DEFAULT"] = defaultVal;
    
    let currentVal = defaultVal;
    for (const screenKey of screenKeys) {
      const screenVal = formatPx(parsed[screenKey]?.value || currentVal);
      generatedStyles[`--parallax-overflow-${screenKey}`] = screenVal;
      currentVal = screenVal;
    }
    
    return {
      styles: generatedStyles,
      className: [
        "[--parallax-overflow:var(--parallax-overflow-DEFAULT)]",
        "sm:[--parallax-overflow:var(--parallax-overflow-sm)]",
        "md:[--parallax-overflow:var(--parallax-overflow-md)]",
        "lg:[--parallax-overflow:var(--parallax-overflow-lg)]",
        "xl:[--parallax-overflow:var(--parallax-overflow-xl)]",
        "2xl:[--parallax-overflow:var(--parallax-overflow-2xl)]"
      ]
    };
  })(overflow);

  const scrollOptions = {
    target: internalRef,
    offset: ["start end", "end start"]
  };

  const { scrollYProgress } = useScroll(scrollOptions);
  const xTransform = useTransform(scrollYProgress, calculateTransformX);
  const yTransform = useTransform(scrollYProgress, calculateTransformY);

  const motionStyles = direction === "x" ? {
    width: "calc(100% + (2 * var(--parallax-overflow)))",
    left: "calc(-1 * var(--parallax-overflow))",
    x: xTransform
  } : {
    height: "calc(100% + (2 * var(--parallax-overflow)))",
    top: "calc(-1 * var(--parallax-overflow))",
    y: yTransform
  };

  const mergedRef = composeRefs(ref, internalRef);
  const wrapperClassName = cx(["relative overflow-hidden", className, ...responsiveClassName]);
  
  const wrapperStyles = {
    ...responsiveStyles,
    ...style
  };

  return (
    <div ref={mergedRef} className={wrapperClassName} style={wrapperStyles} {...restProps}>
      <motion.div style={motionStyles} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}
