
"use client"; 
import React, { useRef } from 'react'; 
import gsap from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { cx } from '@/libs/utils/className'; 

import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'; 
import { SanityRichText } from '@/components/sanity/SanityRichText'; 
import { SanityButton } from '@/components/sanity/SanityButton'; 
import { useIdleGSAP } from '@/hooks/useIdleGSAP'; 

gsap.registerPlugin(ScrollTrigger);

export function TableSectionClient(props) {
  const {
    headline,
    headlineDisplay,
    text,
    button,
    columns,
    rows,
    tableTheme,
    highlightTheme,
    hasHighlightedColumn
  } = props;

  const containerRef = useRef(null);
  const headerContentRef = useRef(null);
  const tableWrapperRef = useRef(null);

  const animateTables = () => {
    if (containerRef.current) {
      if (headerContentRef.current) {
        const headerElements = headerContentRef.current.querySelectorAll("[data-animate-left]");
        if (headerElements.length > 0) {
          gsap.fromTo(headerElements,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                once: true
              }
            }
          );
        }
      }
      
      if (tableWrapperRef.current) {
        const rowElements = tableWrapperRef.current.querySelectorAll("[data-table-row]");
        if (rowElements.length > 0) {
          gsap.fromTo(rowElements,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: tableWrapperRef.current,
                start: "top 85%",
                once: true
              }
            }
          );
        }
      }
    }
  };

  useIdleGSAP(animateTables, { scope: containerRef });

  const tableContainerClasses = cx(
    "grid-span-12 lg:grid-start-5 lg:grid-span-8 p-16 lg:pb-16",
    hasHighlightedColumn && "pb-0"
  );

  return (
    <div ref={containerRef} className="grid-container">
      <div className="grid-layout items-start gap-y-32">
        
        {/* Left Column: Header Content */}
        <div ref={headerContentRef} className="grid-span-12 lg:grid-span-3 flex h-full flex-col gap-24">
          <ScrollAnimatedHeadline headline={headline} displayAs={headlineDisplay} />
          {text && (
            <div data-animate-left={true} className="text-foreground-muted">
              <SanityRichText value={text} />
            </div>
          )}
          {button && (
            <div data-animate-left={true} className="mt-auto">
              <SanityButton button={button} />
            </div>
          )}
        </div>

        {/* Right Column: Table Wrappers */}
        <div ref={tableWrapperRef} data-theme={tableTheme} className={tableContainerClasses}>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-body-sm">
              <thead>
                <tr data-table-row={true}>
                  <th className="border-border border-b bg-background px-16 py-12 text-left text-accent-sm" />
                  {columns.map((col) => (
                    <th
                      key={col._key}
                      data-theme={col.highlight ? highlightTheme : undefined}
                      className="border-border border-b bg-background px-16 py-12 text-left font-mono text-accent-sm uppercase"
                    >
                      <span className="flex items-center gap-8">
                        {col.highlight && (
                          <span className="size-12 animate-pulse bg-brand" aria-hidden="true" />
                        )}
                        {col.title}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const isLastRow = rowIndex === rows.length - 1;
                  return (
                    <tr key={row._key} data-table-row={true}>
                      <td className={`bg-background px-16 py-12 font-mono text-accent-sm text-foreground-muted uppercase ${isLastRow ? "" : "border-border border-b"}`}>
                        {row.category}
                      </td>
                      {row.values.map((val, valIndex) => {
                        const colDef = columns[valIndex];
                        return (
                          <td
                            key={`${row._key}-${valIndex}`}
                            data-theme={colDef?.highlight ? highlightTheme : undefined}
                            className={`bg-background px-16 py-12 ${isLastRow ? "" : "border-border border-b"}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Table View */}
          <div className="flex flex-col lg:hidden">
            {rows.map((row, rowIndex) => {
              const isLastRow = rowIndex === rows.length - 1;
              return (
                <div key={row._key} data-table-row={true} className={`pt-16 ${isLastRow ? "pb-0" : ""}`}>
                  <p className="mb-12 text-body-sm text-foreground">
                    {row.category}
                  </p>
                  <div className="-mx-12 flex flex-col">
                    {row.values.map((val, valIndex) => {
                      const colDef = columns[valIndex];
                      const isHighlighted = colDef?.highlight;
                      return (
                        <div
                          key={`${row._key}-${valIndex}`}
                          data-theme={isHighlighted ? highlightTheme : undefined}
                          className={`flex items-baseline justify-between gap-16 px-12 py-6 ${isHighlighted ? "-mx-4 bg-surface px-16 py-8" : ""}`}
                        >
                          <span className="shrink-0 font-mono text-[10px] text-foreground-muted uppercase">
                            {colDef?.title}
                          </span>
                          <span className="text-right text-body-sm">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
}