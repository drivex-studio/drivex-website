import React from 'react';
import { cx } from '@/libs/utils/className'; 
import { SanityButton } from '@/components/sanity/SanityButton'; 

const LAYOUT_STYLES = {
  horizontal: "flex-row flex-wrap items-center",
  vertical: "flex-col"
};

const GAP_STYLES = {
  0: "gap-0",
  4: "gap-4",
  8: "gap-8",
  16: "gap-16",
  24: "gap-24",
  32: "gap-32"
};


export function ButtonGroup({ buttonGroup, className }) {
  if (!buttonGroup?.buttons || buttonGroup.buttons.length === 0) {
    return null;
  }

  const layoutClass = LAYOUT_STYLES[buttonGroup.layout];
  const gapClass = GAP_STYLES[buttonGroup.gap];
  const wrapperClassName = cx("flex items-start", layoutClass, gapClass, className);

  return (
    <div className={wrapperClassName}>
      {buttonGroup.buttons.map(button => (
        <SanityButton 
          button={button} 
          key={button._key} 
        />
      ))}
    </div>
  );
}