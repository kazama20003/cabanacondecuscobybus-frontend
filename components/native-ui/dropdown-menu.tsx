"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { NativeSlot } from "@/components/native-ui/native-slot";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

type MenuContextValue = { open: boolean; setOpen: (open: boolean) => void; triggerRef: React.RefObject<HTMLButtonElement | null>; contentRef: React.RefObject<HTMLDivElement | null> };
const MenuContext = React.createContext<MenuContextValue | null>(null);
const useMenu = () => React.useContext(MenuContext);

function DropdownMenu({ children, open: controlledOpen, onOpenChange, ...props }: React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [localOpen, setLocalOpen] = React.useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setLocalOpen(next); onOpenChange?.(next); };
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || contentRef.current?.contains(target)) return;
      setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <MenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}><div ref={ref} data-slot="dropdown-menu" className="relative inline-block" {...props}>{children}</div></MenuContext.Provider>;
}
function DropdownMenuPortal({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function DropdownMenuTrigger({ asChild, className, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const menu = useMenu();
  const triggerProps = { ...props, ref: menu?.triggerRef, "data-slot": "dropdown-menu-trigger", "aria-haspopup": "menu" as const, "aria-expanded": menu?.open, className, onClick: (event: React.MouseEvent<HTMLButtonElement>) => { onClick?.(event); menu?.setOpen(!menu.open); } };
  return asChild ? <NativeSlot {...triggerProps}>{children as React.ReactElement}</NativeSlot> : <button type="button" {...triggerProps}>{children}</button>;
}
function DropdownMenuContent({ className, children, align = "start", sideOffset = 4, side = "bottom", ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end"; side?: "top" | "right" | "bottom" | "left"; sideOffset?: number }) {
  const menu = useMenu();
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState<React.CSSProperties | null>(null);
  React.useEffect(() => setMounted(true), []);
  useLayoutEffect(() => {
    if (!menu?.open || !mounted || !menu.triggerRef.current || !menu.contentRef.current) return;
    const update = () => {
      const trigger = menu.triggerRef.current?.getBoundingClientRect();
      const content = menu.contentRef.current?.getBoundingClientRect();
      if (!trigger || !content) return;
      const gap = sideOffset;
      const width = content.width;
      const height = content.height;
      let left = align === "end" ? trigger.right - width : align === "center" ? trigger.left + (trigger.width - width) / 2 : trigger.left;
      let top = trigger.bottom + gap;
      if (side === "right") { left = trigger.right + gap; top = align === "end" ? trigger.bottom - height : align === "center" ? trigger.top + (trigger.height - height) / 2 : trigger.top; }
      else if (side === "left") { left = trigger.left - width - gap; top = align === "end" ? trigger.bottom - height : trigger.top; }
      else if (side === "top") top = trigger.top - height - gap;
      if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
      if (left < 8) left = 8;
      if (top + height > window.innerHeight - 8) top = trigger.top - height - gap;
      if (top < 8) top = Math.min(window.innerHeight - height - 8, trigger.bottom + gap);
      setPosition({ position: "fixed", left, top, zIndex: 100, maxHeight: `calc(100vh - 16px)`, overflowY: "auto", "--radix-dropdown-menu-trigger-width": `${trigger.width}px` } as React.CSSProperties);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [menu?.open, mounted, side, align, sideOffset, children]);
  if (!menu?.open || !mounted) return null;
  return createPortal(<div ref={menu.contentRef} role="menu" data-slot="dropdown-menu-content" data-align={align} style={position ?? { position: "fixed", visibility: "hidden" }} className={cn("min-w-40 overflow-y-auto rounded-2xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10", className)} {...props}>{children}</div>, document.body);
}
function DropdownMenuGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="group" data-slot="dropdown-menu-group" className={className} {...props} />; }
function DropdownMenuItem({ className, inset, variant = "default", onClick, onSelect, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean; variant?: "default" | "destructive"; onSelect?: (event: Event) => void }) {
  const menu = useMenu();
  return <button type="button" role="menuitem" data-slot="dropdown-menu-item" data-inset={inset} data-variant={variant} className={cn("flex min-h-8 w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus:bg-accent disabled:pointer-events-none disabled:opacity-50", variant === "destructive" && "text-destructive", className)} onClick={(event) => { onClick?.(event); onSelect?.(event.nativeEvent); menu?.setOpen(false); }} {...props} />;
}
function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void; inset?: boolean }) {
  return <button type="button" role="menuitemcheckbox" aria-checked={checked} className={cn("flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-accent", className)} onClick={() => onCheckedChange?.(!checked)} {...props}><span className="w-4">{checked ? <CheckIcon size={14} /> : null}</span>{children}</button>;
}
function DropdownMenuRadioGroup({ children, value, onValueChange, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }) { return <div role="group" data-value={value} {...props}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { checked: (child.props as { value?: string }).value === value, onSelect: () => onValueChange?.((child.props as { value: string }).value) }) : child)}</div>; }
function DropdownMenuRadioItem({ children, className, onSelect, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; onSelect?: () => void; checked?: boolean }) { return <button type="button" role="menuitemradio" className={cn("flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-accent", className)} onClick={onSelect} {...props}><span className="w-4">{props.checked ? <CheckIcon size={14} /> : null}</span>{children}</button>; }
function DropdownMenuLabel({ className, inset, ...props }: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) { return <div data-slot="dropdown-menu-label" data-inset={inset} className={cn("px-2 py-1 text-xs text-muted-foreground", className)} {...props} />; }
function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) { return <hr data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px border-0 bg-border/50", className)} {...props} />; }
function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) { return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />; }
function DropdownMenuSub({ children, ...props }: React.HTMLAttributes<HTMLDetailsElement>) { return <details data-slot="dropdown-menu-sub" {...props}>{children}</details>; }
function DropdownMenuSubTrigger({ children, className, inset, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }) { return <summary data-slot="dropdown-menu-sub-trigger" data-inset={inset} className={cn("flex min-h-8 cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-accent", className)} {...props}>{children}<ChevronRightIcon className="ml-auto" size={14} /></summary>; }
function DropdownMenuSubContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="menu" data-slot="dropdown-menu-sub-content" className={cn("z-50 min-w-32 rounded-2xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10", className)} {...props} />; }

export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent };
