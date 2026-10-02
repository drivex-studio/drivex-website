'use client'

import React, { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ScrambleGroup } from '@/components/animations/ScrambleGroup'; 
import { FilterDropdown } from '@/sections/workpage/utils/FilterDropdown';
import { ViewModeToggle } from '@/sections/workpage/utils/ViewModeToggle';
import { ThumbnailIndicator, SliderControls } from '@/sections/workpage/slider/SliderControls';
import { InfiniteSlider } from '@/sections/workpage/slider/InfiniteSlider';
import { DuoGrid, ThreeColGrid, ListView } from '@/sections/workpage/views/GridAndListViews';
import { CustomLayoutGroup } from '@/sections/workpage/utils/CustomLayoutGroup';

const mapToThumbItem = (e) => ({
  _id: e._id,
  title: e.title,
  mainImage: e.mainImage?.type === "image" ? { type: "image", image: e.mainImage.image } : null
});

const mapToCardItem = (e) => ({
  _id: e._id,
  title: e.title,
  uri: e.uri,
  tags: e.tags,
  mainImage: e.mainImage
});

export default function WorkSliderClient({ section }) {
  const content = section.content ?? {};
  const { filterLabel, caseStudies } = content;
  
  const [activeTag, setActiveTag] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationCount, setRotationCount] = useState(0);
  const [viewMode, setViewMode] = useState("slider");
  
  const sliderRef = useRef(null);
  const containerHeightRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("auto");

  useEffect(() => {
    if (!containerHeightRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (entry) setContainerHeight(entry.contentRect.height);
    });
    observer.observe(containerHeightRef.current);
    return () => observer.disconnect();
  }, []);

  const tagsList = (() => {
    if (!caseStudies) return [];
    const set = new Set();
    for (const item of caseStudies) {
      if (item.tags) {
        for (const tag of item.tags) set.add(tag);
      }
    }
    return Array.from(set).sort();
  })();

  const filteredCaseStudies = (() => {
    if (!caseStudies) return [];
    if (!activeTag) return caseStudies;
    return caseStudies.filter(e => e.tags?.includes(activeTag));
  })();

  useEffect(() => {
    setCurrentIndex(0);
    setRotationCount(0);
  }, [filteredCaseStudies]);

  const mappedCardItems = filteredCaseStudies.map(mapToCardItem);
  const mappedThumbItems = filteredCaseStudies.map(mapToThumbItem);

  const handlePrev = () => sliderRef.current?.goToPrev();
  const handleNext = () => sliderRef.current?.goToNext();
  const handleSelectSlide = (idx) => sliderRef.current?.goToSlide(idx);

  const handleIndexChange = (idx) => {
    setCurrentIndex(idx);
    setRotationCount(prev => prev + 1);
  };

  const [scrambleKey, setScrambleKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewModeChange = (mode) => {
    setIsTransitioning(viewMode === "slider" || mode === "slider");
    setViewMode(mode);
    setCurrentIndex(0);
    setRotationCount(0);
    setScrambleKey(prev => prev + 1);
  };

  const isSliderMode = viewMode === "slider";

  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <CustomLayoutGroup id="work-slider">
      <div className="grid-container">
        <div className="mb-16 flex items-end justify-between lg:grid lg:grid-cols-12 lg:items-center">
          <FilterDropdown
            label={filterLabel ?? "FILTER"}
            options={tagsList}
            value={activeTag}
            onChange={setActiveTag}
            className="lg:col-span-4"
          />
          <motion.div
            className="hidden justify-center md:flex lg:col-span-4"
            animate={{ opacity: isSliderMode ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: isSliderMode ? "auto" : "none" }}
          >
            <ThumbnailIndicator
              items={mappedThumbItems}
              currentIndex={currentIndex}
              onSelect={handleSelectSlide}
              rotationCount={rotationCount}
            />
          </motion.div>
          <div className="flex items-center lg:col-span-4 lg:justify-end">
            <ViewModeToggle value={viewMode} onChange={handleViewModeChange} />
            <div className="grid transition-[grid-template-columns] duration-300 ease-in-out" style={{ gridTemplateColumns: isSliderMode ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <div className="pl-16">
                  <SliderControls onPrev={handlePrev} onNext={handleNext} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden transition-[height] duration-400 [transition-timing-function:var(--ease-power4-in-out)]" style={{ height: containerHeight }}>
        <div ref={containerHeightRef}>
          <AnimatePresence mode="popLayout">
            {isSliderMode && (
              <motion.div
                key="slider"
                className="flex flex-col gap-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <InfiniteSlider
                  ref={sliderRef}
                  items={mappedCardItems}
                  onIndexChange={handleIndexChange}
                  className="page-enter-fade"
                  scrambleKey={scrambleKey}
                />
                <div className="grid-container">
                  <ThumbnailIndicator
                    items={mappedThumbItems}
                    currentIndex={currentIndex}
                    onSelect={handleSelectSlide}
                    rotationCount={rotationCount}
                    gap={8}
                    className="mt-32 md:hidden"
                  />
                </div>
              </motion.div>
            )}
            
            {viewMode === "duo" && (
              <motion.div
                key="duo"
                initial={isTransitioning ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={isTransitioning ? { opacity: 0 } : undefined}
              >
                <ScrambleGroup stagger={0.08} start="top 85%" key={`duo-${scrambleKey}`}>
                  <DuoGrid items={filteredCaseStudies} />
                </ScrambleGroup>
              </motion.div>
            )}

            {viewMode === "grid" && (
              <motion.div
                key="grid"
                initial={isTransitioning ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={isTransitioning ? { opacity: 0 } : undefined}
              >
                <ScrambleGroup stagger={0.08} start="top 85%" key={`grid-${scrambleKey}`}>
                  <ThreeColGrid items={filteredCaseStudies} />
                </ScrambleGroup>
              </motion.div>
            )}

            {viewMode === "list" && (
              <motion.div
                key="list"
                initial={isTransitioning ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={isTransitioning ? { opacity: 0 } : undefined}
              >
                <ListView items={filteredCaseStudies} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CustomLayoutGroup>
  );
}