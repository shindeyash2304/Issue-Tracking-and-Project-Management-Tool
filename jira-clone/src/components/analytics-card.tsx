import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons/faCaretDown";
import { faCaretUp } from "@fortawesome/pro-solid-svg-icons/faCaretUp";

import { cn } from "@/lib/utils";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsCard({ increaseValue, title, value, variant }: { title: string, value: number, increaseValue: number, variant: "UP" | "DOWN" }) {
  const iconColor = variant === "UP" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor = variant === "UP" ? "text-emerald-500" : "text-red-500";
  const icon = variant === "UP" ? faCaretUp : faCaretDown;
  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon icon={icon} className={cn(iconColor, "size-4")} />
            <span className={cn(increaseValueColor, "text-base font-medium truncate")}>{increaseValue}</span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
