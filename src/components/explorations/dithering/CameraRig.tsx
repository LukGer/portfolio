import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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

export default CameraRig;
