import { RoundedBox } from "@react-three/drei";

const Cube = () => {
	return (
		<RoundedBox
			args={[2, 2, 2]}
			position={[0, 1, 0]}
			radius={0.1}
			smoothness={4}
			castShadow
			receiveShadow
		>
			<meshStandardMaterial color="#ffffff" metalness={1} roughness={0.01} />
		</RoundedBox>
	);
};

export default Cube;
