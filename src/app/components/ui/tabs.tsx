"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  defaultValue?: string;
}>({
  selectedTab: "",
  setSelectedTab: () => {},
});

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [selectedTab, setSelectedTab] = React.useState(value || defaultValue || "");

  // Update controlled value
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const handleTabChange = React.useCallback(
    (newValue: string) => {
      setSelectedTab(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{ selectedTab, setSelectedTab: handleTabChange, defaultValue }}
    >
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const { selectedTab, setSelectedTab } = React.useContext(TabsContext);
  const isSelected = selectedTab === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-white text-blue-600 shadow-sm"
          : "hover:bg-gray-200 hover:text-gray-900",
        className
      )}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { selectedTab } = React.useContext(TabsContext);
  const isSelected = selectedTab === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn("mt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
} 