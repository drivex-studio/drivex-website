import { AnimatedHeadline } from '@/components/animations/AnimatedHeadline'; 
import { cx } from '@/libs/utils/className'; 

export function ScrollAnimatedHeadline({ headline, displayAs, className, headlineClassName }) {
  if (!headline?.text || !headline?.level) {
    return null;
  }

  const level = headline.level;

  return (
    <AnimatedHeadline
      trigger="scroll"
      as={level}
      displayAs={displayAs}
      className={cx(headlineClassName)}
      wrapperClassName={className}
    >
      {headline.text}
    </AnimatedHeadline>
  );
}