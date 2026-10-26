"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

type SelectItemProps = { value: string; children: React.ReactNode; disabled?: boolean };
type SelectContextValue = { value: string; options: React.ReactElement<SelectItemProps>[]; placeholder?: string };
const SelectContext = React.createContext<SelectContextValue | null>(null);

function findElements<T extends React.ElementType>(node: React.ReactNode, component: T): React.ReactElement[] {
  const found: React.ReactElement[] = [];
  React.Children.forEach(node, child => {
    if (!React.isValidElement(child)) return;
    if (child.type === component) found.push(child);
    else if (child.type === React.Fragment || child.type === SelectContent || child.type === SelectGroup) found.push(...findElements((child.props as { children?: React.ReactNode }).children, component));
  });
  return found;
}

function Select({ children, value, defaultValue = "", onValueChange, name, disabled, required, id, className, ...props }: React.HTMLAttributes<HTMLSelectElement> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; name?: string; disabled?: boolean; required?: boolean }) {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const selected = value ?? localValue;
  const trigger = findElements(children, SelectTrigger)[0];
  const content = findElements(children, SelectContent)[0];
  const triggerProps = (trigger?.props ?? {}) as React.SelectHTMLAttributes<HTMLSelectElement> & { size?: "sm" | "default"; children?: React.ReactNode };
  const options = content ? findElements((content.props as { children?: React.ReactNode }).children, SelectItem) as React.ReactElement<SelectItemProps>[] : [];
  const valueElement = triggerProps.children ? findElements(triggerProps.children, SelectValue)[0] : undefined;
  const placeholder = valueElement ? (valueElement.props as { placeholder?: string }).placeholder : undefined;
  const nativeClassName = cn("flex h-8 w-fit appearance-none items-center justify-between gap-2 rounded-2xl border border-transparent bg-input/50 px-3 py-2 pr-8 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50", triggerProps.className, className);
  return <span className="relative inline-flex"><select data-slot="select" id={id ?? triggerProps.id} name={name ?? triggerProps.name} value={selected} disabled={disabled ?? triggerProps.disabled} required={required ?? triggerProps.required} aria-label={triggerProps["aria-label"]} className={nativeClassName} onChange={event => { setLocalValue(event.currentTarget.value); onValueChange?.(event.currentTarget.value); }} {...props}>{placeholder && <option value="" disabled>{placeholder}</option>}{options.map(option => <option key={option.props.value} value={option.props.value} disabled={option.props.disabled}>{option.props.children}</option>)}</select><ChevronDownIcon aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></span>;
}
function SelectGroup({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function SelectValue({ children }: { children?: React.ReactNode; placeholder?: string }) { return <>{children}</>; }
function SelectTrigger({ children: _children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { size?: "sm" | "default" }) { return null; }
function SelectContent({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function SelectItem({ children }: SelectItemProps) { return <>{children}</>; }
function SelectLabel({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function SelectSeparator() { return null; }
function SelectScrollDownButton() { return null; }
function SelectScrollUpButton() { return null; }

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
