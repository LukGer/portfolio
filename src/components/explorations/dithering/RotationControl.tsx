import { PauseIcon, PlayIcon } from "lucide-react";

const RotationControl = ({
	rotate,
	onToggle,
}: { rotate: boolean; onToggle: () => void }) => {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
		>
			{rotate ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
		</button>
	);
};

export default RotationControl;
