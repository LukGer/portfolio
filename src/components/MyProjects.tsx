import { FolderGit2Icon } from "lucide-react";
import { type Variants, motion } from "motion/react";

const MyProjects = () => {
  const containerVariants: Variants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    initial: {
      y: 200,
      rotate: 0,
    },
    hover: () => ({
      y: 0,
      rotate: Math.random() * 20 - 10,
      transition: {
        type: "spring",
        duration: 0.6,
      },
    }),
    itemHover: {
      rotate: 0,
    },
  };

  return (
    <motion.div
      className="flex-1 flex flex-col"
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
    >
      <h2 className="text-3xl font-bold font-serif text-slate-900">Projects</h2>
      <p className="text-slate-900 max-w-64">
        Here are some recent projects I've worked on.
      </p>

      <motion.div
        variants={containerVariants}
        className="relative flex flex-row justify-between ms-10 me-30 mt-4 z-10"
      >
        <motion.div
          variants={itemVariants}
          className="size-24 rounded-lg bg-red-400 origin-bottom"
        />
        <motion.div
          variants={itemVariants}
          className="size-24 rounded-lg bg-green-400 origin-bottom"
        />
        <motion.div
          variants={itemVariants}
          className="size-24 rounded-lg bg-blue-400 origin-bottom"
        />
      </motion.div>

      <FolderGit2Icon
        size={120}
        className="text-white opacity-60 absolute right-2 bottom-0 pointer-events-none"
      />
    </motion.div>
  );
};

export default MyProjects;
