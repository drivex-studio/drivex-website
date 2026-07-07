import { gsap } from '../../vendor.js';
import { cx } from '@cx';
import { matchesBreakpoint, AnimatedLink, getPageTransitionState } from '../../shared.js';
import { usePathname, useRouter } from '../../lib/router.js';
import { createDualLayerScramble as useDualLayerScramble } from '../useDualLayerScramble.js';
import { SanityLink, SanityImage } from '../../components/shared.js';


const EASE_BACK_INOUT = 'back.inOut';
const EASE_POWER3_INOUT = 'power3.inOut';

export function initMenuFlyout(parentElement, props = {}) {
  const {
    navItems,
    flyout,
    onClose,
    isOpen,
    spotsRemaining
  } = props;


  const isLg = matchesBreakpoint('lg');
  const dotSize = isLg ? 32 : 20;
  const indentSize = isLg ? 64 : 36;
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition, isTransitioning } = getPageTransitionState();


  let hoveredIndex = null;
  let indicatorPos = null;
  let rotationCount = 0;
  let isFullyOpen = false;
  let activeIndex = null;

  if (navItems) {
    const idx = navItems.findIndex((item) => {
      if (!item.link?.href) return false;
      return pathname === item.link.href || pathname.startsWith(`${item.link.href}/`);
    });
    activeIndex = idx >= 0 ? idx : null;
  }

  let currentFocusIndex = hoveredIndex ?? (isFullyOpen ? activeIndex : null);


  const scrambleU = useDualLayerScramble({ duration: 0.5 });
  const scrambleW = useDualLayerScramble({ duration: 0.5 });
  const scrambleV = useDualLayerScramble({ duration: 0.5 });
  const scrambleJ = useDualLayerScramble({ duration: 0.5 });


  const childInstances = [];


  const rootGridContainer = document.createElement('div');
  rootGridContainer.className = 'grid-container';

  const gridEl = document.createElement('div');
  gridEl.className = 'grid bg-surface transition-colors duration-300';
  gridEl.style.gridTemplateRows = '0fr';

  const overflowWrap = document.createElement('div');
  overflowWrap.className = 'overflow-hidden';

  const paddingWrap = document.createElement('div');
  paddingWrap.className = 'p-24 lg:p-64';

  const layoutGrid = document.createElement('div');
  layoutGrid.className = 'grid-layout gap-y-32';


  const navCol = document.createElement('nav');
  navCol.className = 'grid-span-12 lg:grid-span-4 relative flex flex-col items-start gap-4';


  let indicatorEl = null;

  function createIndicator() {
    const el = document.createElement('div');
    el.className = 'pointer-events-none absolute left-0 bg-brand';
    el.style.width = `${dotSize}px`;
    el.style.height = `${dotSize}px`;
    el.style.opacity = '0';
    el.style.x = `${-indentSize}px`;
    if (indicatorPos) el.style.y = `${indicatorPos.y}px`;
    navCol.appendChild(el);
    return el;
  }


  function updateIndicatorPosition() {
    if (currentFocusIndex === null) {
      indicatorPos = null;
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const itemEl = navItemEls[currentFocusIndex];
      if (!itemEl || !navCol) return;
      const navRect = navCol.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      const nextY = itemRect.top - navRect.top + (itemRect.height - dotSize) / 2;
      indicatorPos = { y: nextY };


      if (!indicatorEl) {
        indicatorEl = createIndicator();
        gsap.fromTo(indicatorEl,
          { x: -indentSize, y: nextY, opacity: 0 },
          {
            x: 0,
            y: nextY,
            rotate: 90 * rotationCount,
            opacity: 1,
            duration: 0.6,
            ease: EASE_POWER3_INOUT,
            overwrite: 'auto'
          }
        );
      } else {
        gsap.to(indicatorEl, {
          x: 0,
          y: nextY,
          rotate: 90 * rotationCount,
          opacity: 1,
          duration: 0.6,
          ease: EASE_BACK_INOUT,
          overwrite: 'auto'
        });
      }
    });
    return () => cancelAnimationFrame(rafId);
  }


  const navItemEls = [];
  const navLinkEls = [];
  const navItemWraps = [];

  if (navItems) {
    for (let r = 0; r < navItems.length; r++) {
      const item = navItems[r];
      if (!item.link) continue;

      const isActive = r === activeIndex;
      const isHovered = r === hoveredIndex;
      const isFocused = r === currentFocusIndex;

      const outerDiv = document.createElement('div');
      outerDiv.className = 'overflow-y-clip overflow-x-visible';
      outerDiv.setAttribute('data-key', item._key ?? r);
      navItemEls[r] = outerDiv;

      const motionDiv = document.createElement('div');

      motionDiv.style.transform = `translateX(${isFocused ? indentSize : 0}px)`;
      motionDiv.style.transition = 'transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)';
      navItemWraps[r] = motionDiv;


      const linkEl = SanityLink(motionDiv, {
        link: item.link,
        onClick: (event) => handleNavClick(event, item.link?.href ?? '/'),
        className: cx('block py-4 text-h2 transition-colors duration-300', (isActive || isHovered) ? 'text-brand' : ''),
        children: [document.createTextNode(item.text || '')]
      });
      if (linkEl) {
        navLinkEls[r] = linkEl.el;
        childInstances.push(linkEl);
      }


      motionDiv.addEventListener('mouseenter', () => {
        if (hoveredIndex !== null && hoveredIndex !== r) {
          rotationCount += 1;
        }
        hoveredIndex = r;
        currentFocusIndex = r;

        gsap.to(motionDiv, { x: indentSize, duration: 0.6, ease: EASE_POWER3_INOUT });

        for (let i = 0; i < navItemWraps.length; i++) {
          if (i !== r && navItemWraps[i]) {
            gsap.to(navItemWraps[i], { x: 0, duration: 0.6, ease: EASE_POWER3_INOUT });
          }
        }
        updateIndicatorPosition();
      });
      motionDiv.addEventListener('mouseleave', () => {
        hoveredIndex = null;
        currentFocusIndex = isFullyOpen ? activeIndex : null;
        gsap.to(motionDiv, { x: 0, duration: 0.6, ease: EASE_POWER3_INOUT });
        updateIndicatorPosition();
      });

      outerDiv.appendChild(motionDiv);
      navCol.appendChild(outerDiv);
    }
  }

  layoutGrid.appendChild(navCol);


  const middleCol = document.createElement('div');
  middleCol.className = 'grid-span-12 lg:grid-span-2 lg:grid-start-5 flex flex-col gap-24';

  const contactInfoEls = [];

  const contact = flyout?.contact;
  const team = flyout?.team;
  const socials = flyout?.socials;
  const location = flyout?.location;
  const availability = flyout?.availability;


  if (contact?.email || contact?.phone) {
    const contactBlock = document.createElement('div');
    contactBlock.className = 'flex flex-col gap-4';

    const contactLabelWrap = document.createElement('div');
    contactLabelWrap.className = 'overflow-hidden';
    const contactLabel = document.createElement('p');
    contactLabel.className = 'text-accent text-foreground-muted transition-colors duration-300';
    contactLabel.textContent = 'Contact';
    contactLabelWrap.appendChild(contactLabel);
    contactInfoEls[0] = contactLabelWrap;
    contactBlock.appendChild(contactLabelWrap);

    if (contact.email) {
      const emailWrap = document.createElement('div');
      emailWrap.className = 'overflow-hidden';
      const emailLink = AnimatedLink(emailWrap, {
        href: `mailto:${contact.email}`,
        className: 'block text-body-sm transition-colors duration-300 lg:text-body',
        children: [document.createTextNode(contact.email)]
      });
      if (emailLink) childInstances.push(emailLink);
      contactInfoEls[1] = emailWrap;
      contactBlock.appendChild(emailWrap);
    }
    if (contact.phone) {
      const phoneWrap = document.createElement('div');
      phoneWrap.className = 'overflow-hidden';
      const phoneLink = AnimatedLink(phoneWrap, {
        href: `tel:${contact.phone.replace(/\s/g, '')}`,
        className: 'block text-body-sm transition-colors duration-300 lg:text-body',
        children: [document.createTextNode(contact.phone)]
      });
      if (phoneLink) childInstances.push(phoneLink);
      contactInfoEls[2] = phoneWrap;
      contactBlock.appendChild(phoneWrap);
    }
    middleCol.appendChild(contactBlock);
  }


  if (team && team.length > 0) {
    const teamBlock = document.createElement('div');
    teamBlock.className = 'flex flex-col gap-4';
    team.forEach((member, r) => {
      const wrap = document.createElement('div');
      wrap.className = 'overflow-hidden';
      const link = AnimatedLink(wrap, {
        href: `mailto:${member.email}`,
        className: 'block text-body-sm transition-colors duration-300 lg:text-body',
        children: [document.createTextNode(`${member.name}: ${member.email}`)]
      });
      if (link) childInstances.push(link);
      contactInfoEls[3 + r] = wrap;
      teamBlock.appendChild(wrap);
    });
    middleCol.appendChild(teamBlock);
  }


  if (socials && socials.length > 0) {
    const socialsBlock = document.createElement('div');
    socialsBlock.className = 'flex flex-col gap-4';
    const teamLen = team?.length ?? 0;
    socials.forEach((social, r) => {
      const wrap = document.createElement('div');
      wrap.className = 'overflow-hidden';
      const link = AnimatedLink(wrap, {
        href: social.href ?? '#',
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'block text-body-sm transition-colors duration-300 lg:text-body',
        children: [document.createTextNode(`${social.name}: ${social.handle}`)]
      });
      if (link) childInstances.push(link);
      contactInfoEls[3 + teamLen + r] = wrap;
      socialsBlock.appendChild(wrap);
    });
    middleCol.appendChild(socialsBlock);
  }


  if (location) {
    const wrap = document.createElement('div');
    wrap.className = 'overflow-hidden';
    const p = document.createElement('p');
    p.className = 'text-accent-sm text-foreground-muted transition-colors duration-300';
    p.textContent = location;
    wrap.appendChild(p);
    const socialsLen = socials?.length ?? 0;
    const teamLen2 = team?.length ?? 0;
    contactInfoEls[3 + teamLen2 + socialsLen] = wrap;
    middleCol.appendChild(wrap);
  }


  const bottomBlock = document.createElement('div');
  bottomBlock.className = 'mt-auto flex flex-col gap-8';

  let availabilityDotEl = null;
  let spotsDotEl = null;

  if (availability?.text) {
    const p = document.createElement('p');
    p.className = 'inline-flex items-start gap-8 text-accent-sm transition-colors duration-300';
    if (availability.isAvailable) {
      const dot = document.createElement('span');
      dot.className = 'mt-6 inline-block size-8 shrink-0 bg-brand opacity-0';
      availabilityDotEl = dot;
      p.appendChild(dot);
    }

    const txtSpan = document.createElement('span');
    txtSpan.className = 'opacity-0';
    txtSpan.appendChild(document.createTextNode(availability.text));

    p.appendChild(txtSpan);
    bottomBlock.appendChild(p);
  }

  if (spotsRemaining && spotsRemaining > 0) {
    const p = document.createElement('p');
    p.className = 'inline-flex items-start gap-8 text-accent-sm transition-colors duration-300';
    const dot = document.createElement('span');
    dot.className = 'mt-6 inline-block size-8 shrink-0 bg-brand opacity-0';
    spotsDotEl = dot;
    p.appendChild(dot);
    const txtSpan = document.createElement('span');
    txtSpan.className = 'opacity-0';
    txtSpan.appendChild(document.createTextNode(
      `Only ${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} left`
    ));
    p.appendChild(txtSpan);
    bottomBlock.appendChild(p);
  }

  middleCol.appendChild(bottomBlock);
  layoutGrid.appendChild(middleCol);


  const rightCol = document.createElement('div');
  rightCol.className = 'grid-span-5 grid-start-8 hidden gap-16 opacity-0 lg:flex';

  const centerImage = flyout?.centerImage;
  const featuredProject = flyout?.featuredProject;


  const centerImgCol = document.createElement('div');
  centerImgCol.className = 'flex flex-1 flex-col gap-8';

  if (centerImage?.image) {
    let centerImgHandle = null;
    if (centerImage.link) {
      const link = SanityLink(centerImgCol, {
        link: centerImage.link,
        onClick: (event) => handleNavClick(event, centerImage.link?.href ?? '/'),
        onMouseEnter: () => scrambleU.scramble(),
        className: 'block flex-1 overflow-hidden',
        children: []
      });
      if (link) childInstances.push(link);
      centerImgHandle = SanityImage(link?.el ?? centerImgCol, {
        image: centerImage.image,
        className: 'zoom-in-image h-full w-full object-cover',
        alt: centerImage.image.altText ?? ''
      });
    } else {
      centerImgHandle = SanityImage(centerImgCol, {
        image: centerImage.image,
        className: 'zoom-in-image h-full w-full object-cover',
        alt: centerImage.image.altText ?? ''
      });
    }
    if (centerImgHandle) childInstances.push(centerImgHandle);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'h-full w-full bg-foreground/5';
    centerImgCol.appendChild(placeholder);
  }

  if (centerImage?.caption) {
    const caption = document.createElement('p');
    caption.className = 'text-accent-sm transition-colors duration-300';
    caption.appendChild(document.createTextNode(centerImage.caption));
    centerImgCol.appendChild(caption);
  }

  rightCol.appendChild(centerImgCol);


  const projectCol = document.createElement('div');
  projectCol.className = 'flex flex-1 flex-col gap-8';

  if (featuredProject?.project?.uri && featuredProject.project.image) {


    const link = document.createElement('a');
    link.href = featuredProject.project.uri;
    link.className = 'block flex-1 overflow-hidden transition-opacity duration-300 hover:opacity-80';
    link.addEventListener('click', (event) => handleNavClick(event, featuredProject.project?.uri ?? '/'));
    link.addEventListener('mouseenter', () => scrambleW.scramble());
    const img = SanityImage(link, {
      image: featuredProject.project.image,
      className: 'zoom-in-image h-full w-full object-cover',
      alt: featuredProject.project.title ?? 'Featured Project'
    });
    if (img) childInstances.push(img);
    projectCol.appendChild(link);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'h-full w-full bg-foreground/5';
    projectCol.appendChild(placeholder);
  }

  if (featuredProject?.caption) {
    const caption = document.createElement('p');
    caption.className = 'text-accent-sm transition-colors duration-300';
    caption.appendChild(document.createTextNode(featuredProject.caption));
    projectCol.appendChild(caption);
  }

  rightCol.appendChild(projectCol);
  layoutGrid.appendChild(rightCol);


  paddingWrap.appendChild(layoutGrid);
  overflowWrap.appendChild(paddingWrap);
  gridEl.appendChild(overflowWrap);
  rootGridContainer.appendChild(gridEl);

  if (parentElement) parentElement.appendChild(rootGridContainer);


  function handleNavClick(event, href) {
    event.preventDefault();
    if (isTransitioning) return;
    if (onClose) onClose();
    setTimeout(() => {
      startTransition(() => {
        router.push(href, { scroll: true });
      });
    }, 150);
  }


  let timeline = null;
  function animateOpen() {
    if (timeline) timeline.kill();
    timeline = gsap.timeline();
    gsap.set(gridEl, { clipPath: 'none', gridTemplateRows: '0fr' });
    timeline.to(gridEl, { gridTemplateRows: '1fr', duration: 1, ease: 'expo.inOut' });

    const linkEls = navLinkEls.filter(Boolean);
    if (linkEls.length > 0) {
      timeline.fromTo(linkEls,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1, force3D: true },
        '<+50%'
      );
    }

    const infoEls = contactInfoEls.filter(Boolean);
    if (infoEls.length > 0) {
      timeline.fromTo(infoEls,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04, force3D: true },
        '<+25%'
      );
    }

    if (rightCol) {
      timeline.fromTo(rightCol,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power1.out' },
        '<+25%'
      );
    }


    timeline.add(() => {
      scrambleU.kill();
      scrambleW.kill();
      scrambleV.kill();
      scrambleJ.kill();
      scrambleU.scramble();
      scrambleW.scramble();
      scrambleV.scramble();
      scrambleJ.scramble();
    }, '<');

    if (availabilityDotEl) {
      timeline.to(availabilityDotEl, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => availabilityDotEl?.classList.add('animate-pulse')
      }, '<');
    }
    if (spotsDotEl) {
      timeline.to(spotsDotEl, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => spotsDotEl?.classList.add('animate-pulse')
      }, '<');
    }

    timeline.add(() => { isFullyOpen = true; }, '<+50%');
  }

  function animateClose() {
    if (timeline) timeline.kill();
    timeline = gsap.timeline();
    gsap.set(gridEl, { clipPath: 'inset(0% 0% 0% 0%)' });
    timeline.to(gridEl, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.6,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(gridEl, { gridTemplateRows: '0fr', clipPath: 'none' });
        if (availabilityDotEl) {
          gsap.set(availabilityDotEl, { opacity: 0 });
          availabilityDotEl.classList.remove('animate-pulse');
        }
        if (spotsDotEl) {
          gsap.set(spotsDotEl, { opacity: 0 });
          spotsDotEl.classList.remove('animate-pulse');
        }
        if (rightCol) gsap.set(rightCol, { opacity: 0 });
      }
    });
  }


  if (isOpen) animateOpen();


  function update(nextProps = {}) {
    const wasOpen = isOpen;
    Object.assign(props, nextProps);
    if (props.isOpen !== wasOpen) {


      if (!props.isOpen) {
        hoveredIndex = null;
        indicatorPos = null;
        rotationCount = 0;
        isFullyOpen = false;
        currentFocusIndex = null;
        scrambleU.kill();
        scrambleW.kill();
        scrambleV.kill();
        scrambleJ.kill();
        animateClose();
      } else {
        animateOpen();
      }
    }
  }

  function destroy() {
    if (timeline) timeline.kill();
    gsap.killTweensOf(gridEl);
    gsap.killTweensOf(navItemWraps);
    gsap.killTweensOf([availabilityDotEl, spotsDotEl, rightCol].filter(Boolean));
    childInstances.forEach((c) => c?.destroy?.());
    childInstances.length = 0;
    rootGridContainer.remove();
  }

  return { el: rootGridContainer, destroy, update };
}
