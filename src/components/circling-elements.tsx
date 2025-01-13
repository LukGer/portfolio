"use client";

import { motion, useSpring } from "motion/react";
import React from "react";

type CirclingElementsProps = {
  children: React.ReactNode;
  radius?: number;
  duration?: number;
  className?: string;
};

const CirclingElements: React.FC<CirclingElementsProps> = ({
  children,
  radius = 100,
  duration = 10,
  className,
}) => {
  const durationValue = useSpring(0, { stiffness: 200, damping: 20 });
  const radiusValue = useSpring(0, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      className={`relative w-full h-full ${className}`}
      onHoverStart={() => {
        durationValue.set(duration);
        radiusValue.set(radius);
      }}
      onHoverEnd={() => {
        durationValue.set(0);
        radiusValue.set(0);
      }}
    >
      {React.Children.map(children, (child, index) => {
        const offset = (index * 360) / React.Children.count(children);
        return (
          <motion.div
            key={index}
            className="transform-gpu absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-circling"
            style={
              {
                "--circling-duration": durationValue,
                "--circling-radius": radiusValue,
                "--circling-offset": offset,
              } as React.CSSProperties
            }
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CirclingElements;
