import { TextScramble } from "@/components/ui/TextScramble";
import { useState } from "react";

export function CodeText() {
  const [isTrigger, setIsTrigger] = useState(false);

  return (
    <TextScramble
      className="font-mono underline text-primary"
      as="span"
      speed={0.1}
      trigger={isTrigger}
      onHoverStart={() => setIsTrigger(true)}
      onHoverEnd={() => setIsTrigger(false)}
    >
      code
    </TextScramble>
  );
}
