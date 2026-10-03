'use client'
import React, { useRef, useMemo } from 'react'; 
import gsap from 'gsap'; 
import { useGSAP } from '@gsap/react'; 
import { usePageEnter } from '@/hooks/usePageEnter'; 
import { usePageEnterContext } from '@/providers/PageEnterProvider'; 
import { SanityImage } from '@/components/sanity/SanityImage'; 
import { getImageSrc } from '@/components/sanity/SanityImage'; 
import { LOGO_HEIGHTS, getLogoSizeVars } from '@/sections/utils/logoSizeVars'; 

gsap.registerPlugin(useGSAP);

export function LogoSectionContent({ trustedBy, theme }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const logosRef = useRef([]);
  const hasAnimated = useRef(false);

  const { prefersReducedMotion } = usePageEnterContext();

  const { contextSafe } = useGSAP(() => {
    if (prefersReducedMotion) return;
    
    const elements = [titleRef.current, ...logosRef.current].filter(Boolean);
    gsap.set(elements, { opacity: 0, y: 20 });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  const playAnimation = useMemo(() => contextSafe((delay) => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    const tl = gsap.timeline({ delay: delay + 0.2 });
    
    if (titleRef.current) {
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0);
    }
    
    const logoElements = logosRef.current.filter(Boolean);
    if (logoElements.length > 0) {
      tl.to(logoElements, {
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "power3.out", 
        stagger: 0.08, 
        onComplete: () => {
          for (const el of logoElements) {
            if (el) {
              gsap.set(el, { clearProps: "y,opacity" });
              el.classList.add("transition-colors");
            }
          }
        }
      }, 0.1);
    }
  }), [contextSafe]);

  usePageEnter(playAnimation, { priority: 2, skip: prefersReducedMotion });

  if (!trustedBy.items || trustedBy.items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="grid-container">
      <div className="grid-layout">
        <div className="grid-span-12 lg:grid-start-3 lg:grid-span-8 flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-32">
          {trustedBy.title && (
            <p ref={titleRef} className="shrink-0 text-accent-sm text-foreground-muted">
              {trustedBy.title}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:gap-x-32">
            {trustedBy.items.map((item, index) => {
              if (item._type === "image" && item.image) {
                const variant = item.variant ?? "horizontal";
                const { desktop: desktopHeight } = LOGO_HEIGHTS[variant];
                const aspectRatio = item.image.dimensions?.aspectRatio;
                
                if (theme === "light") {
                  return (
                    <span 
                      key={item._key}
                      ref={(el) => { logosRef.current[index] = el; }} 
                      style={getLogoSizeVars(variant)}
                    >
                      <SanityImage 
                        image={item.image} 
                        alt={item.alt ?? "Client logo"} 
                        height={desktopHeight} 
                        noPlaceholder={true} 
                        priority={true} 
                        className="[&_img]:!h-(--logo-h) [&_img]:!w-auto [&_img]:!object-contain lg:[&_img]:!h-(--logo-h-desktop) h-auto w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0" 
                      />
                    </span>
                  );
                }
                
                const imgSrc = getImageSrc({ ...item.image, crop: null, hotspot: null }, { height: 2 * desktopHeight, fit: "max" });
                return (
                  <span 
                    key={item._key}
                    ref={(el) => { logosRef.current[index] = el; }} 
                    role="img" 
                    aria-label={item.alt ?? "Client logo"} 
                    className="block h-(--logo-h) bg-current text-foreground-muted hover:text-foreground lg:h-(--logo-h-desktop)" 
                    style={{
                      ...getLogoSizeVars(variant),
                      aspectRatio: aspectRatio,
                      maskImage: `url(${imgSrc})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${imgSrc})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center"
                    }} 
                  />
                );
              }
              
              if (item._type === "svgItem" && item.svgCode) {
                const variant = item.variant ?? "horizontal";
                return (
                  <span 
                    key={item._key}
                    ref={(el) => { logosRef.current[index] = el; }} 
                    role="img" 
                    aria-label={item.alt ?? "Client logo"} 
                    style={getLogoSizeVars(variant)} 
                    className="block h-(--logo-h) text-foreground-muted hover:text-foreground lg:h-(--logo-h-desktop) [&_svg]:h-full [&_svg]:w-auto" 
                    dangerouslySetInnerHTML={{ __html: item.svgCode }} 
                  />
                );
              }
              
              if (item._type === "textItem" && item.text) {
                return (
                  <span 
                    key={item._key}
                    ref={(el) => { logosRef.current[index] = el; }} 
                    className="w-full text-center text-accent-sm text-foreground-muted lg:w-auto lg:text-left"
                  >
                    {item.text}
                  </span>
                );
              }
              
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}