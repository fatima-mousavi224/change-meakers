"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TabsContextType {
  hiddenTabs: string[];
  hideTab: (href: string) => void;
  resetTabs: () => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const STORAGE_KEY = "hidden-tabs";

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);

  // ✅ Load from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHiddenTabs(JSON.parse(stored));
    }
  }, []);

  // ✅ Persist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenTabs));
  }, [hiddenTabs]);

  const hideTab = (href: string) => {
    if (!href) return;
    setHiddenTabs(prev => Array.from(new Set([...prev, href])));
  };

  const resetTabs = () => {
    setHiddenTabs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TabsContext.Provider value={{ hiddenTabs, hideTab, resetTabs }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};
