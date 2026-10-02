'use client'

import React, { useState, useEffect, useRef, createRef, Fragment } from 'react' 
import gsap from 'gsap' 
import { ScrollTrigger } from 'gsap/ScrollTrigger' 
import { motion } from 'framer-motion' 

import { easings } from '@/libs/constants/easings' 
import { RollerNumber } from '@/components/animations/RollerNumber' 
import { ScrambleText } from '@/components/animations/ScrambleText' 
import { useIdleGSAP } from '@/hooks/useIdleGSAP' 
import { SanityMedia } from '@/components/sanity/SanityMedia' 
//import '@/styles/CardsSectionClient.css' 

const THEME_OPTIONS = ["light", "dark", "brand"];

gsap.registerPlugin(ScrollTrigger);

const easePowerOut = easings.power3Out;
const easeBackOut = easings.backOut;

const HEADLINE_CLASSES = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6"
};

function parseHeadline(text) {
  if (!text) return null;
  const match = text.trim().match(/^([€$£¥₹]?[+]?)(\d+)([MBKx\%+]*)$/i);
  if (!match) return null;
  
  const [, prefix = "", numberStr = "", suffix = ""] = match;
  return {
    prefix,
    number: Number.parseInt(numberStr, 10),
    suffix
  };
}


export function CardsSectionClient({ cards, fullHeight }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const triggerRefs = useRef(cards.map(() => createRef()));
  if (triggerRefs.current.length !== cards.length) {
    triggerRefs.current = cards.map(() => createRef());
  }

  const scrambleTextRefs = useRef([]);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const animateCardsIn = () => {
    const elements = cardRefs.current.filter(Boolean);
    
    if (elements.length !== 0) {
      gsap.fromTo(elements, {
        yPercent: 25,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          once: true
        },
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
    }
  };

  useIdleGSAP(animateCardsIn, { scope: containerRef });

  const handleContainerMouseLeave = () => {
    setHoveredCardIndex(null);
  };

  const columnsCount = Math.min(cards.length, 4);
  const gridColsConfig = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div
      ref={containerRef}
      className={`relative grid gap-16 ${gridColsConfig[columnsCount]} ${fullHeight ? "h-full" : ""}`}
      onMouseLeave={handleContainerMouseLeave}
    >
      {cards.map((card, index) => {
        if (card._type === "textCard" && card.headline?.text) {
          const isHovered = hoveredCardIndex === index;
          const parsedNumber = parseHeadline(card.headline.text);
          const theme = THEME_OPTIONS.includes(card.cardTheme) ? card.cardTheme : undefined;

          return (
            <div
              key={card._key}
              ref={el => {
                cardRefs.current[index] = el;
                const triggerRef = triggerRefs.current[index];
                if (triggerRef) {
                  triggerRef.current = el;
                }
              }}
              data-theme={theme}
              className="flex min-h-[250px] cursor-default flex-col justify-between bg-background-muted p-16 lg:min-h-[450px] lg:p-32"
              onMouseEnter={() => {
                setHoveredCardIndex(index);
                scrambleTextRefs.current[index]?.();
              }}
            >
              <span className={`flex items-center font-light text-foreground ${HEADLINE_CLASSES[card.headlineDisplay ?? "h3"]}`}>
                {parsedNumber ? (
                  <Fragment>
                    {parsedNumber.prefix}
                    <RollerNumber
                      value={parsedNumber.number}
                      minDigits={parsedNumber.number.toString().length}
                      triggerMode="scroll"
                      triggerElement={triggerRefs.current[index]}
                      duration={2}
                      stagger={0.1}
                      suffix={parsedNumber.suffix}
                    />
                  </Fragment>
                ) : (
                  card.headline.text
                )}
              </span>
              
              {card.text && (
                card.plainText ? (
                  <p className="text-body text-foreground-muted">
                    {card.text}
                  </p>
                ) : (
                  <span className="relative flex items-center text-accent text-foreground">
                    {!isMobile && (
                      <motion.span
                        className="absolute left-0 size-12 bg-brand"
                        initial={false}
                        animate={{
                          rotate: isHovered ? 0 : -90,
                          scale: isHovered ? 1 : 0
                        }}
                        transition={{
                          duration: 0.5,
                          ease: easeBackOut
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <motion.span
                      animate={isMobile ? {} : {
                        x: isHovered ? 24 : 0
                      }}
                      transition={{
                        duration: 0.5,
                        ease: easePowerOut
                      }}
                    >
                      <ScrambleText
                        duration={0.5}
                        multiLine={true}
                        onReady={instance => {
                          scrambleTextRefs.current[index] = instance;
                        }}
                      >
                        {card.text}
                      </ScrambleText>
                    </motion.span>
                  </span>
                )
              )}
            </div>
          );
        }

        if (card._type === "mediaCard" && card.media) {
          return (
            <div
              key={card._key}
              ref={el => {
                cardRefs.current[index] = el;
              }}
              className="min-h-[300px] overflow-hidden lg:min-h-[450px]"
            >
              <SanityMedia
                media={card.media}
                className="h-full w-full object-cover"
                imageProps={{ alt: card.alt || "" }}
                autoPlay={true}
                loop={true}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}