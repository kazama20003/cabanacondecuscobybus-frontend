"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = { value: string; setValue: (value: string) => void; orientation: "horizontal" | "vertical"; variant: "default" | "line" };
const TabsContext = React.createContext<TabsContextValue | null>(null);
function Tabs({ className, orientation = "horizontal", value, defaultValue = "", onValueChange, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const selected = value ?? localValue;
  const setValue = (next: string) => { setLocalValue(next); onValueChange?.(next); };
  const variant = findListVariant(children);
  return <TabsContext.Provider value={{ value: selected, setValue, orientation, variant }}><div data-slot="tabs" data-orientation={orientation} className={cn("flex gap-2 data-horizontal:flex-col", className)} {...props}>{children}</div></TabsContext.Provider>;
}
function findListVariant(children: React.ReactNode): "default" | "line" { let variant: "default" | "line" = "default"; React.Children.forEach(children, child => { if (React.isValidElement(child) && child.type === TabsList && (child.props as { variant?: "default" | "line" }).variant) variant = (child.props as { variant: "default" | "line" }).variant; }); return variant; }
function tabsListVariants({ variant = "default", className }: { variant?: "default" | "line"; className?: string } = {}) { return cn("group/tabs-list inline-flex w-fit items-center justify-center rounded-2xl p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:p-1 data-[variant=line]:rounded-none", variant === "default" ? "bg-muted" : "gap-1 bg-transparent", className); }
function TabsList({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "line" }) { return <div role="tablist" data-slot="tabs-list" data-variant={variant} className={tabsListVariants({ variant, className })} {...props} />; }
function TabsTrigger({ className, value, children, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const tabs = React.useContext(TabsContext);
  const active = tabs?.value === value;
  return <button type="button" role="tab" aria-selected={active} aria-controls={`tab-panel-${value}`} data-state={active ? "active" : "inactive"} data-active={active ? "" : undefined} data-slot="tabs-trigger" className={cn("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-active:bg-background data-active:text-foreground", className)} disabled={disabled} onClick={() => tabs?.setValue(value)} {...props}>{children}</button>;
}
function TabsContent({ className, value, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const tabs = React.useContext(TabsContext);
  if (tabs?.value !== value) return null;
  return <div role="tabpanel" id={`tab-panel-${value}`} data-slot="tabs-content" className={cn("flex-1 text-sm outline-none", className)} {...props}>{children}</div>;
}
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
