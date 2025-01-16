"use client";

import { BikeIcon } from "lucide-react";
import Gravity, { MatterBody } from "./ui/matterbody";

export default function MyHobbies() {
  const hobbies = [
    { title: "Running", color: "#FF0000" },
    { title: "Climbing", color: "#FFFF00" },
    { title: "Gym", color: "#00FF00" },
    { title: "Coding", color: "#0000FF" },
    { title: "Reading", color: "#FF00FF" },
  ];

  return (
    <div className="p-4 relative h-full flex flex-col">
      <h2 className="text-3xl font-bold font-serif text-slate-50">Hobbies</h2>

      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full -mt-10 mx-10">
        {hobbies.map((hobby, index) => (
          <MatterBody
            key={hobby.title}
            matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
            x={50 + index * 60}
            y={50}
          >
            <div
              style={{
                backgroundColor: hobby.color,
              }}
              className="text-xl sm:text-2xl md:text-3xl text-white rounded-full hover:cursor-pointer px-8 py-4"
            >
              {hobby.title}
            </div>
          </MatterBody>
        ))}
      </Gravity>

      <BikeIcon
        size={120}
        className="text-white opacity-40 absolute right-2 bottom-0 pointer-events-none"
      />
    </div>
  );
}
