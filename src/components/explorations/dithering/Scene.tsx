import Scene from "@/components/Scene";
import { Environment, Grid } from "@react-three/drei";
import Cube from "./Cube";

const CubeScene = () => {
	return (
		<Scene>
			<Cube />
			<Grid position={[0, -0.01, 0]} args={[20, 20]} fadeDistance={10} />
			<Environment preset="sunset" />
		</Scene>
	);
};

export default CubeScene;
