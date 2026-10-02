'use client' 

import React, { useRef, useState } from 'react'; 
import { motion } from 'framer-motion'; 
import { cx } from '@/libs/utils/className'; 
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'; 
import { easings } from '@/libs/constants/easings' 
import { ScrambleGroup } from '@/components/animations/ScrambleGroup'; 
import { ScrambleText } from '@/components/animations/ScrambleText'; 

const power3Out = easings.power3Out;
const backOut = easings.backOut;

function Divider({ className }) {
    return <div className={cx("h-px w-full bg-border", className)} />;
}

export function IndexedGridSectionClient({
    headline,
    text,
    label,
    items,
    disableCursor = true,
    variant = "standard"
}) {
    const scrambleRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setActiveIndex(index);
        scrambleRefs.current[index]?.();
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    const totalItems = items.length;
    const isTwoColumn = variant === "twoColumn";

    const headerNode = (headline?.text || text || label) && (
        <div className="grid-layout mb-48 lg:mb-64">
            <div className={cx(isTwoColumn ? "lg:grid-start-4 lg:grid-span-6" : "", "grid-span-12 flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between")}>
                {headline?.text && (
                    <ScrollAnimatedHeadline
                        headline={{
                            text: headline.text,
                            level: headline.level ?? "h2"
                        }}
                        className="lg:max-w-1/2"
                    />
                )}
                {text && (
                    <span className="section-label">
                        {text}
                    </span>
                )}
            </div>
            {label && (
                <div className={cx(isTwoColumn ? "lg:grid-start-4 lg:grid-span-6" : "", "grid-span-12 mt-32 flex items-center gap-8")}>
                    <div className="h-12 w-12 bg-brand" />
                    <span className="text-accent-sm uppercase">{label}</span>
                </div>
            )}
        </div>
    );

    const renderGridItem = (item, index, itemClassName) => {
        const isActive = activeIndex === index;
        const caseStudyTitle = item.caseStudy?.title;
        const stripesRight = totalItems - index - 1;
        const showCursorInfo = !disableCursor && caseStudyTitle;

        return (
            <motion.div
                key={item._key}
                className={itemClassName}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                data-cursor-text={showCursorInfo ? caseStudyTitle.toUpperCase() : undefined}
                data-cursor-stripes-left={showCursorInfo ? index : undefined}
                data-cursor-stripes-right={showCursorInfo ? stripesRight : undefined}
            >
                <div className="relative flex items-center pt-24 pb-16 lg:pt-32 lg:pb-20">
                    <motion.span
                        className="absolute top-1/2 left-0 hidden size-12 bg-brand lg:block"
                        initial={false}
                        animate={{
                            rotate: isActive ? 0 : -90,
                            scale: isActive ? 1 : 0
                        }}
                        transition={{
                            duration: 0.5,
                            ease: backOut
                        }}
                        aria-hidden="true"
                    />
                    <motion.h3
                        className="text-accent uppercase"
                        animate={{
                            x: isActive ? 28 : 0
                        }}
                        transition={{
                            duration: 0.5,
                            ease: power3Out
                        }}
                    >
                        <ScrambleText
                            duration={0.5}
                            revealMode={true}
                            onReady={(ref) => {
                                scrambleRefs.current[index] = ref;
                            }}
                        >
                            {item.title}
                        </ScrambleText>
                    </motion.h3>
                </div>
                <Divider />
                <p className="pt-16 pb-24 text-body text-foreground-muted lg:max-w-2/3 lg:pt-20 lg:pb-32">
                    {item.description}
                </p>
            </motion.div>
        );
    };

    const twoColumnNodes = isTwoColumn && (
        <div className="grid-span-12 lg:grid-start-4 lg:grid-span-6 lg:grid-subgrid">
            {items.map((item, index) => renderGridItem(item, index, "grid-span-12 md:grid-span-6 lg:grid-span-3"))}
        </div>
    );

    const standardNodes = !isTwoColumn && items.map((item, index) => 
        renderGridItem(item, index, "grid-span-12 md:grid-span-6 lg:grid-span-4")
    );

    return (
        <div className="grid-container">
            {headerNode}
            <ScrambleGroup stagger={0.08} start="top 85%">
                <div className="grid-layout">
                    {twoColumnNodes}
                    {standardNodes}
                </div>
            </ScrambleGroup>
        </div>
    );
}