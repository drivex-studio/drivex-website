'use client'
import { createContext, useState, useContext, useEffect } from 'react';

const FooterVisibilityContext = createContext(true);
const FooterSetVisibilityContext = createContext(() => {});

export function FooterVisibilityProvider({ children }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <FooterSetVisibilityContext.Provider value={setIsVisible}>
      <FooterVisibilityContext.Provider value={isVisible}>
        {children}
      </FooterVisibilityContext.Provider>
    </FooterSetVisibilityContext.Provider>
  );
}

export function FooterSlot({ children }) {
  const isVisible = useContext(FooterVisibilityContext);
  return isVisible ? children : null;
}

export function useHideFooter() {
  const setIsVisible = useContext(FooterSetVisibilityContext);

  useEffect(() => {
    setIsVisible(false);
    
    return () => {
      setIsVisible(true);
    };
  }, [setIsVisible]);
}
