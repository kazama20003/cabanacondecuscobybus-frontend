import * as React from "react";
import { cn } from "@/lib/utils";

function TooltipProvider({ children }: { children?: React.ReactNode; delayDuration?: number }) { return <>{children}</>; }
function Tooltip({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
function TooltipTrigger({ asChild, children, ...props }: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) { return <span data-slot="tooltip-trigger" {...props}>{children}</span>; }
function TooltipContent({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { side?: string; sideOffset?: number }) { return <span role="tooltip" className={cn("rounded-xl bg-foreground px-3 py-1.5 text-xs text-background", className)} {...props}>{children}</span>; }
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
