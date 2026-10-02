'use client'

import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from 'react'; 
import { LayoutGroupContext } from 'framer-motion'; 
import { frame } from 'framer-motion'; 
import { useIsomorphicLayoutEffect } from 'framer-motion'; 

const InternalContext = createContext(null);
const triggerUpdate = (e) => !e.isLayoutDirty && e.willUpdate(false);

export const CustomLayoutGroup = ({ children, id, inherit = true }) => {
  const layoutGroupContext = useContext(LayoutGroupContext);
  const internalContext = useContext(InternalContext);
  
  const [forceRender, renderCount] = (function() {
    const isMounted = useRef(false);
    useIsomorphicLayoutEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
    }, []);
    const [count, setCount] = useState(0);
    const trigger = useCallback(() => {
      if (isMounted.current) setCount(count + 1);
    }, [count]);
    return [useCallback(() => frame.postRender(trigger), [trigger]), count];
  })();

  const configRef = useRef(null);
  const groupId = layoutGroupContext.id || internalContext;

  if (configRef.current === null) {
    let components = new Set();
    let subscriptions = new WeakMap();
    let dirtyMethod;

    if ((inherit === true || inherit === "id") && groupId) {
      id = id ? `${groupId}-${id}` : groupId;
    }

    configRef.current = {
      id: id,
      group: (inherit === true && layoutGroupContext.group) || {
        add: (node) => {
          components.add(node);
          subscriptions.set(node, node.addEventListener("willUpdate", dirtyMethod));
        },
        remove: (node) => {
          components.delete(node);
          const unsub = subscriptions.get(node);
          if (unsub) {
            unsub();
            subscriptions.delete(node);
          }
          dirtyMethod();
        },
        dirty: dirtyMethod = () => components.forEach(triggerUpdate)
      }
    };
  }

  const memoizedValue = useMemo(() => ({
    ...configRef.current,
    forceRender: forceRender
  }), [forceRender]);

  return (
    <LayoutGroupContext.Provider value={memoizedValue}>
      {children}
    </LayoutGroupContext.Provider>
  );
};