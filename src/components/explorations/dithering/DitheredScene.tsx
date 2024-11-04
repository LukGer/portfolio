import { Environment, Grid } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Cube from "./Cube";
import { DitheringEffect, type DitheringType } from "./DitheringEffect";
import Scene from "./Scene";

function DitheringEffectComposer({ type }: { type: DitheringType }) {
	return (
		<EffectComposer>
			<DitheringEffect
				color1={new THREE.Color(0x65a30d)}
				color2={new THREE.Color(0xffffff)}
				type={type}
			/>
		</EffectComposer>
	);
}

const DitheredScene = ({
	type,
}: {
	type: DitheringType;
}) => {
	return (
		<Scene>
			<Cube />
			<Grid position={[0, -0.01, 0]} args={[20, 20]} fadeDistance={10} />
			<Environment preset="sunset" />
			<DitheringEffectComposer type={type} />
		</Scene>
	);
};

export default DitheredScene;
