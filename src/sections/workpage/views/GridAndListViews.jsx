import React from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 
import { Link } from '@/components/pageTransition/TransitionLink'; 
import { cx } from '@/libs/utils/className'; 
import { SanityMedia } from '@/components/sanity/SanityMedia'; 
import { ProjectCard } from '@/sections/workpage/views/ProjectCard';

const springConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.5
};

export function DuoGrid({ items, className }) {
  return (
    <div className={cx("grid-container", className)}>
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ProjectCard key={item._id} {...item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ThreeColGrid({ items, className }) {
  return (
    <div className={cx("grid-container", className)}>
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ProjectCard key={item._id} {...item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ListView({ items, className }) {
  return (
    <div className={cx("grid-container", className)}>
      <div className="divide-y divide-foreground/10">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ListViewItem key={item._id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ListViewItem({ item }) {
  return (
    <motion.div
      layoutId={item._id}
      layout={true}
      transition={{ layout: { type: "spring", ...springConfig } }}
    >
      <Link href={item.uri ?? "#"} className="group flex items-stretch" data-cursor-text="VIEW PROJECT">
        <div className="relative aspect-square w-80 shrink-0 overflow-hidden">
          {item.mainImage && (
            <SanityMedia
              media={item.mainImage}
              className="h-full w-full object-cover"
              imageProps={{
                sizes: "80px",
                builderOptions: { sourceWidths: [160, 240] }
              }}
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-8 px-16 py-12">
          <h3 className="truncate text-accent">{item.title}</h3>
          {item.tags && item.tags.length > 0 && (
            <div className="xs:flex hidden shrink-0 items-center gap-8 text-body text-foreground-muted">
              {item.tags.map((tag, index) => (
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