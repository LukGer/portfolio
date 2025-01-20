import useScreenSize from "@/hooks/useScreenSize";
import {
  BirdIcon,
  BookOpenIcon,
  CameraIcon,
  Code2Icon,
  DumbbellIcon,
  MountainSnowIcon,
  PersonStandingIcon,
  RotateCcwIcon,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import Gravity, { MatterBody, type GravityRef } from "./ui/Gravity";

export default function MyHobbies() {
  const hobbies = [
    {
      title: "Running",
      backgroundColor: "#59C3C3",
      color: "#000",
      icon: <PersonStandingIcon />,
    },
    {
      title: "Climbing",
      backgroundColor: "#52489C",
      color: "#FFF",
      icon: <MountainSnowIcon />,
    },
    {
      title: "Gym",
      backgroundColor: "#EBEBEB",
      color: "#000",
      icon: <DumbbellIcon />,
    },
    {
      title: "Coding",
      backgroundColor: "#CAD2C5",
      color: "#000",
      icon: <Code2Icon />,
    },
    {
      title: "Reading",
      backgroundColor: "#84A98C",
      color: "#000",
      icon: <BookOpenIcon />,
    },
    {
      title: "Photography",
      backgroundColor: "#F4A259",
      color: "#000",
      icon: <CameraIcon />,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<GravityRef>(null);

  const inView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (inView) {
      ref.current?.start();
    }
  }, [inView]);

  const size = useScreenSize();

  return (
    <motion.div
      ref={containerRef}
      className="p-4 relative h-full flex flex-col"
    >
      <div className="flex flex-row items-center z-20">
        <h2 className="text-3xl font-bold font-serif text-slate-50">Hobbies</h2>

        <div className="flex-1" />

        <button
          type="button"
          title="Reset"
          className="cursor-pointer p-2 z-10"
          onClick={() => {
            ref.current?.reset();
            ref.current?.start();
          }}
        >
          <RotateCcwIcon size={24} />
        </button>
      </div>
      <p className="text-slate-50 max-w-lg">
        I enjoy doing various activities in my free time. Here are some of them.
      </p>

      <div className="sr-only">
        {hobbies.map((hobby) => (
          <span key={hobby.title}>{hobby.title}</span>
        ))}
      </div>

      <Gravity
        ref={ref}
        gravity={{ x: 0, y: 0.2 }}
        padding={size.lessThan("md") ? 10 : 20}
        className="w-full h-full z-10"
        addTopWall
        grabCursor
        autoStart={false}
      >
        {hobbies.map((hobby, index) => (
          <MatterBody
            key={hobby.title}
            matterBodyOptions={{ friction: 0.3, restitution: 0.6 }}
            x={`${5 + index * (90 / (hobbies.length - 1))}%`}
            y={30 + Math.random() * 200}
          >
            <div
              style={{
                backgroundColor: hobby.backgroundColor,
                color: hobby.color,
              }}
              className="inline-flex flex-row items-center gap-2 text-xl sm:text-2xl md:text-3xl text-white rounded-full hover:cursor-pointer px-4 py-2"
            >
              {hobby.icon}

              {hobby.title}
            </div>
          </MatterBody>
        ))}
      </Gravity>

      <BirdIcon
        size={120}
        className="text-white opacity-40 absolute right-2 bottom-0 pointer-events-none"
      />
    </motion.div>
  );
}
