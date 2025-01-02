import { motion } from "motion/react";

interface DancingNameProps {
  text: string;
}

const DancingName = ({ text }: DancingNameProps) => {
  const letterVariants = {
    initial: { y: 0 },
    hover: (i: number) => ({
      y: [0, -8, 0],
      transition: {
        duration: 0.3,
        delay: i * 0.05,
        times: [0, 0.6, 1],
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="inline-block group"
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          custom={index}
          className="inline-block text-sm group-hover:text-primary transition-colors"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default DancingName;
