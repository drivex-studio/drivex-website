import React from "react";
import { SanityLink } from "../sanity/SanityLink";
import { ScrambleText } from "../animations/ScrambleText";

export function FooterNavigation({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid-span-12 lg:grid-span-2 lg:grid-start-6 pointer-events-auto">
      <ul className="flex flex-col items-start gap-4 space-y-4 lg:items-center">
        {items.map((item) => (
          <li key={item._key}>
            {item.link && item.text && (
              <SanityLink link={item.link} className="text-accent text-foreground-muted" aria-label={item.text}>
                <ScrambleText triggerOnHover secondColorClass="scramble-inherit">
                  {item.text}
                </ScrambleText>
              </SanityLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
