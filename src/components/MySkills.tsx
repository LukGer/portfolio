import { Code2Icon } from "lucide-react";
import { type MotionValue, motion, useSpring } from "motion/react";
import React from "react";

const MySkills = () => {
  const logos = [
    "angular_logo.png",
    "astro_logo.svg",
    "dotnet_logo.svg",
    "react_logo.svg",
  ];

  const durationValue = useSpring(20, { stiffness: 200, damping: 20 });
  const radiusValue = useSpring(20, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      className="flex-1 flex flex-col"
      onHoverStart={() => {
        durationValue.set(10);
        radiusValue.set(80);
      }}
      onHoverEnd={() => {
        durationValue.set(20);
        radiusValue.set(20);
      }}
    >
      <h2 className="text-3xl font-bold font-mono text-slate-50 p-4">Skills</h2>
      <p className="text-slate-50 px-4 max-w-56">
        Skills and Tools I regularly use and am proficient in.
      </p>
      <div className="flex flex-col items-center justify-center flex-1 w-full relative">
        <CirclingElements radius={radiusValue} duration={durationValue}>
          {logos.map((image, index) => (
            <div
              key={index}
              className="size-14 absolute -translate-x-1/2 -translate-y-1/2"
            >
              <img
                alt={image}
                width={56}
                height={56}
                src={`/logos/${image}`}
                className="object-cover"
              />
            </div>
          ))}
        </CirclingElements>
      </div>

      <Code2Icon
        size={120}
        className="text-white opacity-10 absolute -right-2 -bottom-4 pointer-events-none"
      />
    </motion.div>
  );
};

type CirclingElementsProps = {
  children: React.ReactNode;
  radius: MotionValue<number>;
  duration: MotionValue<number>;
  className?: string;
};

const CirclingElements: React.FC<CirclingElementsProps> = ({
  children,
  radius,
  duration,
  className,
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {React.Children.map(children, (child, index) => {
        const offset = (index * 360) / React.Children.count(children);
        return (
          <motion.div
            key={index}
            className="transform-gpu absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-circling"
            style={
              {
                "--circling-duration": duration,
                "--circling-radius": radius,
                "--circling-offset": offset,
              } as React.CSSProperties
            }
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

export default MySkills;
