"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input
      data-slot="checkbox"
      type="checkbox"
      className={cn("size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50", className)}
      onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      {...props}
    />
  );
}

export { Checkbox };
