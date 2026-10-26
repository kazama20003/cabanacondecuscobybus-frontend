"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/native-ui/button";
import { NativeSlot } from "@/components/native-ui/native-slot";
import { XIcon } from "lucide-react";

type SheetContextValue = { open: boolean; setOpen: (open: boolean) => void };
const SheetContext = React.createContext<SheetContextValue | null>(null);
function Sheet({ children, open: controlledOpen, onOpenChange, defaultOpen = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setLocalOpen(next); onOpenChange?.(next); };
  return <SheetContext.Provider value={{ open, setOpen }}><div data-slot="sheet" {...props}>{children}</div></SheetContext.Provider>;
}
function SheetTrigger({ asChild, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const sheet = React.useContext(SheetContext);
  const triggerProps = { ...props, "data-slot": "sheet-trigger", onClick: (event: React.MouseEvent<HTMLButtonElement>) => { onClick?.(event); sheet?.setOpen(true); } };
  return asChild ? <NativeSlot {...triggerProps}>{children as React.ReactElement}</NativeSlot> : <button type="button" {...triggerProps}>{children}</button>;
}
function SheetClose({ asChild, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const sheet = React.useContext(SheetContext);
  const closeProps = { ...props, "data-slot": "sheet-close", onClick: (event: React.MouseEvent<HTMLButtonElement>) => { onClick?.(event); sheet?.setOpen(false); } };
  return asChild ? <NativeSlot {...closeProps}>{children as React.ReactElement}</NativeSlot> : <button type="button" {...closeProps}>{children}</button>;
}
function SheetPortal({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function SheetOverlay({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sheet = React.useContext(SheetContext);
  if (!sheet?.open) return null;
  return <button type="button" aria-label="Cerrar panel" data-slot="sheet-overlay" className={cn("fixed inset-0 z-50 bg-black/30 supports-backdrop-filter:backdrop-blur-sm", className)} onClick={() => sheet.setOpen(false)} {...props} />;
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left"; showCloseButton?: boolean }) {
  const sheet = React.useContext(SheetContext);
  React.useEffect(() => {
    if (!sheet?.open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") sheet.setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [sheet?.open]);
  if (!sheet?.open) return null;
  return <><SheetOverlay /><div role="dialog" aria-modal="true" data-slot="sheet-content" data-side={side} className={cn("fixed z-50 flex flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-xl", side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "inset-x-0 top-0 h-auto border-b", side === "bottom" && "inset-x-0 bottom-0 h-auto border-t", className)} {...props}>{children}{showCloseButton && <SheetClose asChild><Button variant="ghost" className="absolute right-4 top-4 bg-secondary" size="icon-sm"><XIcon /><span className="sr-only">Close</span></Button></SheetClose>}</div></>;
}
function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />; }
function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-6", className)} {...props} />; }
function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h2 data-slot="sheet-title" className={cn("font-heading text-base font-medium text-foreground", className)} {...props} />; }
function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />; }
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
