'use client'
import React, { useRef } from 'react'; 
import { motion } from 'framer-motion'; 
import { Link } from '@/components/pageTransition/TransitionLink'; 
import { SanityMedia } from '@/components/sanity/SanityMedia'; 
import { ScrambleText } from '@/components/animations/ScrambleText'; 

const springConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.5
};

export function ProjectCard({ _id, title, uri, tags, mainImage, className }) {
  const scrambleRef = useRef(null);
  const targetUri = uri ?? "#";

  return (
    <motion.div
      layoutId={_id}
      layout={true}
      transition={{ layout: { type: "spring", ...springConfig } }}
      className={className}
    >
      <Link 
        href={targetUri} 
        className="group block" 
        data-cursor-text="VIEW PROJECT" 
        onMouseEnter={() => scrambleRef.current?.()}
      >
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: "66.67%" }}>
          <div className="absolute inset-0">
            {mainImage && (
              <SanityMedia
                media={mainImage}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                imageProps={{
                  sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                  builderOptions: { sourceWidths: [400, 600, 800, 1000, 1200, 1400] }
                }}
              />
            )}
          </div>
        </div>
        <div className="mt-16 flex items-start justify-between gap-16">
          <h3 className="text-accent">
            <ScrambleText duration={0.5} onReady={(api) => { scrambleRef.current = api; }}>
              {title}
            </ScrambleText>
          </h3>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-8 text-body text-foreground-muted">
              {tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  {index > 0 && <span className="text-foreground-muted">—</span>}
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