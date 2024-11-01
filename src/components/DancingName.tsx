import { motion } from "framer-motion";

interface DancingNameProps {
  text: string;
}

const DancingName = ({ text }: DancingNameProps) => {
  // Animation variants
  const letterVariants = {
    initial: { y: 0 },
    hover: (i: number) => ({
      y: [0, -8, 0], // Array defines keyframes: start, up, down
      transition: {
        duration: 0.3,
        delay: i * 0.05, // Stagger effect
        times: [0, 0.6, 1], // Timing for each keyframe
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="inline-block"
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          custom={index}
            className="inline-block text-sm"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default DancingName;