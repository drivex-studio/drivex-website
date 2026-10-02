'use client'
import React, { useRef } from 'react'; 
import { motion, useTransform } from 'framer-motion'; 
import { Link } from '@/components/pageTransition/TransitionLink';
import { SanityMedia } from '@/components/sanity/SanityMedia';
import { ScrambleText } from '@/components/animations/ScrambleText';

function ScrambleTitle({ title, onRegisterScramble }) {
  return (
    <h3 className="text-accent">
      <ScrambleText duration={0.5} onReady={(api) => onRegisterScramble(api)}>
        {title}
      </ScrambleText>
    </h3>
  );
}

export function SliderItem({ item, index, springX, slideWidth, wrapWidth, centerOffset, totalWidth, containerWidth, onRegisterScramble, isDraggingRef, hasDraggedRef }) {
  const scrambleRef = useRef(null);

  const calculateTransformX = (e) => {
    let t = index * wrapWidth + e + centerOffset;
    while (t > containerWidth + wrapWidth) t -= totalWidth;
    while (t < -(2 * wrapWidth)) t += totalWidth;
    return t;
  };
  
  const springXTransformed = useTransform(springX, calculateTransformX);
  
  const calculateRotation = (e) => -((e + slideWidth / 2 - containerWidth / 2) / containerWidth * 150);
  
  const innerSpringTransform = useTransform(springXTransformed, calculateRotation);

  const containerStyle = {
    x: springXTransformed,
    width: slideWidth,
    position: "absolute",
    left: 0,
    top: 0
  };

  const innerStyle = {
    x: innerSpringTransform,
    scale: 1.225
  };

  const targetUri = item.uri ?? "#";

  const handleLinkClick = (e) => {
    if (isDraggingRef.current || hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.div style={containerStyle} className="will-change-transform">
      <Link
        href={targetUri}
        className="group block overflow-hidden"
        data-cursor-text="VIEW PROJECT"
        onMouseEnter={() => scrambleRef.current?.()}
        onClick={handleLinkClick}
        draggable={false}
      >
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: "66.67%" }}>
          <motion.div className="absolute inset-0 will-change-transform" style={innerStyle}>
            {item.mainImage && (
              <SanityMedia
                media={item.mainImage}
                className="h-full w-full object-cover"
                imageProps={{
                  sizes: "150vw",
                  builderOptions: { sourceWidths: [800, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 3000, 3840] }
                }}
              />
            )}
          </motion.div>
        </div>
        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <ScrambleTitle 
            title={item.title} 
            onRegisterScramble={(api) => {
              scrambleRef.current = api;
              onRegisterScramble(index, api);
            }} 
          />
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-8 text-body text-foreground-muted">
              {item.tags.map((tag, tagIndex) => (
                <React.Fragment key={tag}>
                  {tagIndex > 0 && <span className="text-foreground-muted">--</span>}
                  <span className="text-accent-sm uppercase">[{tag}]</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}