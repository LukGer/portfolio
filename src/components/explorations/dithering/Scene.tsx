import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";
import CameraRig from "./CameraRig";
import RotationControl from "./RotationControl";

const Scene = ({ children }: { children: ReactNode[] }) => {
	const prefersReducedMotion = useReducedMotion();
	const [rotate, setRotate] = useState(!prefersReducedMotion);

	return (
		<div className="relative h-full w-full">
			<Canvas
				className="h-full w-full"
				camera={{ position: [0, 3, 5], fov: 45 }}
			>
				<color attach="background" args={["#FAFAFA"]} />
				<ambientLight intensity={0.5} />
				<pointLight position={[-10, -10, -10]} intensity={1} />
				<spotLight
					position={[8, 5, 8]}
					angle={0.15}
					penumbra={1}
					intensity={1.5}
					castShadow
				/>
				{...children}
				<CameraRig rotate={rotate} />
			</Canvas>
			<RotationControl rotate={rotate} onToggle={() => setRotate(!rotate)} />
		</div>
	);
};

export default Scene;
