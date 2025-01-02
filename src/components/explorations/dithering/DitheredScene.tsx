import { Environment, Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Cube from "./Cube";
import { DitheringEffect, type DitheringType } from "./DitheringEffect";
import RotationControl from "./RotationControl";

function DitheringEffectComposer({
	scale,
	type,
}: { scale: number; type: DitheringType }) {
	return (
		<EffectComposer>
			<DitheringEffect
				color1={new THREE.Color(0x65a30d)}
				color2={new THREE.Color(0xffffff)}
				type={type}
				scale={scale}
			/>
		</EffectComposer>
	);
}

const ScaleControl = ({
	scale,
	onScaleChange,
}: { scale: number; onScaleChange: (scale: number) => void }) => {
	const scales = [1, 2, 4, 8, 16, 32, 64];
	const scaleIndex = scales.indexOf(scale);

	return (
		<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 p-2 rounded-lg shadow-lg">
			<input
				type="range"
				min="0"
				max="6"
				value={scaleIndex}
				onChange={(e) => onScaleChange(scales[Number.parseInt(e.target.value)])}
				className="w-32"
			/>
			<span className="text-sm font-medium">{scale}x</span>
		</div>
	);
};

const DitheredScene = ({ type }: { type: DitheringType }) => {
	const prefersReducedMotion = useReducedMotion();
	const [rotate, setRotate] = useState(!prefersReducedMotion);
	const [scale, setScale] = useState(8);

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
				<Environment preset="city" />
				<DitheringEffectComposer scale={scale} type={type} />
				<CameraRig rotate={rotate} />
			</Canvas>
			<RotationControl rotate={rotate} onToggle={() => setRotate(!rotate)} />
			<ScaleControl scale={scale} onScaleChange={setScale} />
		</div>
	);
};

export default DitheredScene;
