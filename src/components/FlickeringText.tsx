import { TextScramble } from "@/components/ui/TextScramble";
import { useState } from "react";

export function FlickeringText({ text }: { text: string }) {
	const [isTrigger, setIsTrigger] = useState(false);

	return (
		<TextScramble
			className="cursor-pointer font-mono underline"
			as="span"
			speed={0.1}
			trigger={isTrigger}
			onHoverStart={() => setIsTrigger(true)}
			onHoverEnd={() => setIsTrigger(false)}
		>
			{text}
		</TextScramble>
	);
}
