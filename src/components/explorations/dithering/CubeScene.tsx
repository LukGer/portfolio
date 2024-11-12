import { Environment, Grid } from "@react-three/drei";
import Cube from "./Cube";
import Scene from "./Scene";

const CubeScene = () => {
	return (
		<Scene>
			<Cube />
			<Grid position={[0, -0.01, 0]} args={[20, 20]} fadeDistance={10} />
			<Environment preset="city" />
		</Scene>
	);
};

export default CubeScene;
