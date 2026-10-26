import * as React from "react";

type SlotProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

/** Merges presentation and handlers into a child without relying on Radix Slot. */
export function NativeSlot({ children, ...slotProps }: SlotProps): React.ReactElement | null {
  if (!React.isValidElement(children)) return null;
  const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  if (slotProps.className || childProps.className) {
    merged.className = [slotProps.className, childProps.className].filter(Boolean).join(" ");
  }

  for (const key of Object.keys(slotProps)) {
    if (key.startsWith("on") && typeof slotProps[key as keyof typeof slotProps] === "function" && typeof childProps[key] === "function") {
      const slotHandler = slotProps[key as keyof typeof slotProps] as (...args: unknown[]) => void;
      const childHandler = childProps[key] as (...args: unknown[]) => void;
      merged[key] = (...args: unknown[]) => {
        slotHandler(...args);
        childHandler(...args);
      };
    }
  }

  return React.cloneElement(child, merged);
}
