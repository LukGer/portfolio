import { Environment, Grid } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";
import Cube from "./Cube";

const CameraRig = ({ rotate }: { rotate: boolean }) => {
	const clock = useRef(new THREE.Clock());
	const angle = useRef(0);

	useFrame((state) => {
		if (rotate) {
			const delta = clock.current.getDelta();
			angle.current += delta * 0.3;
			state.camera.position.x = Math.sin(angle.current) * 5;
			state.camera.position.z = Math.cos(angle.current) * 5;
			state.camera.position.y = 3;
			state.camera.lookAt(0, 1, 0);
		} else {
			clock.current.stop();
		}
	});

	// Start clock when rotation is enabled
	if (rotate && !clock.current.running) {
		clock.current.start();
	}

	return null;
};

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

const Scene = () => {
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
				<Cube />
				<Grid position={[0, -0.01, 0]} args={[20, 20]} fadeDistance={10} />
				<Environment preset="sunset" />
				<CameraRig rotate={rotate} />
			</Canvas>
			<RotationControl rotate={rotate} onToggle={() => setRotate(!rotate)} />
		</div>
	);
};

export default Scene;
