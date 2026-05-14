import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value: number;
  onValueChange: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min, max, step, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn(
        "w-full cursor-pointer appearance-none rounded-full bg-slate-200 transition outline-none",
        "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
        "[&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow",
        "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full",
        "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-slate-900",
        "focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
Slider.displayName = "Slider";
