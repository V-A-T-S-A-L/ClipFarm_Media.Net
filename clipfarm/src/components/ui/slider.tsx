
'use client';

import * as React from "react"

const Slider = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className="relative flex w-full touch-none select-none items-center"
    {...props}>
    <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <div className="absolute h-full bg-primary" style={{width: `${props.value}%`}}/>
    </div>
    <div className="absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" style={{left: `calc(${props.value}% - 0.5rem)`}}/>
  </div>
))
Slider.displayName = "Slider"

export { Slider }