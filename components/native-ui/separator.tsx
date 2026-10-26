import * as React from "react";
import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.HTMLAttributes<HTMLHRElement> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }) {
  return <hr data-slot="separator" role={decorative ? "none" : "separator"} aria-orientation={orientation} className={cn("shrink-0 border-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} {...props} />;
}
export { Separator };
