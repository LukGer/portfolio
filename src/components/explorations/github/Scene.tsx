import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useState } from "react";

interface Response {
	total: {
		[year: number]: number;
		[year: string]: number; // 'lastYear'
	};
	contributions: Array<Contribution>;
}

interface Contribution {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

const Scene = () => {
	const [username, setUsername] = useState("");

	const [results, setResults] = useState<Contribution[]>([]);

	const searchCommits = useCallback(
		async (username: string) => {
			const response = (await fetch(
				`https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
			).then((response) => response.json())) as Response;

			setResults(response.contributions);
		},
		[username],
	);

	return (
		<div className="relative h-full w-full flex flex-col">
			<Canvas
				className="flex-1"
				orthographic
				camera={{
					position: [0, 0, 20],
					zoom: 20,
					near: 0.1,
					far: 1000,
				}}
			>
				<color attach="background" args={["#FAFAFA"]} />
				<ambientLight intensity={0.5} />
				<pointLight position={[-10, -10, -10]} intensity={1} />
				<spotLight
					position={[0, 0, 10]}
					angle={0.15}
					penumbra={1}
					intensity={1.5}
					castShadow
				/>
				<Commits commits={results} />

				<OrbitControls />
			</Canvas>

			<div className="flex flex-row items-center gap-2 p-2">
				<input
					type="text"
					value={username}
					placeholder="Enter a GitHub username"
					onChange={(e) => setUsername(e.target.value)}
					className="py-1 px-2 border border-gray-300 rounded-md flex-1"
				/>
				<button
					type="button"
					className="py-1 px-2 bg-primary text-white rounded-md"
					onClick={() => {
						searchCommits(username);
					}}
				>
					Search
				</button>
			</div>
		</div>
	);
};

const Commits = ({ commits }: { commits: Contribution[] }) => {
	const COLS = 53; // One year has 52-53 weeks
	const ROWS = 7; // 7 days per week
	const BOX_SIZE = 0.25;
	const GAP = 0.25;
	const PADDING = 0.5; // New padding constant
	const TOTAL_WIDTH = COLS * (BOX_SIZE + GAP);
	const TOTAL_HEIGHT = ROWS * (BOX_SIZE + GAP);

	return (
		<RoundedBox
			args={[
				TOTAL_WIDTH + GAP + PADDING * 2,
				TOTAL_HEIGHT + GAP + PADDING * 2,
				0.05,
			]}
			position={[0, 1, 0]}
			radius={0.5}
			smoothness={4}
			castShadow
			receiveShadow
		>
			<meshBasicMaterial color="#CCCCCC" />

			{commits.map((commit, index) => {
				const col = Math.floor(index / ROWS);
				const row = index % ROWS;

				const x = col * (BOX_SIZE + GAP) - TOTAL_WIDTH / 2 + BOX_SIZE / 2;
				const y = -(row * (BOX_SIZE + GAP)) + TOTAL_HEIGHT / 2 - BOX_SIZE / 2;
				const height = commit.count * 0.1;
				const z = 0.1 + height / 2; // Position z to make boxes grow forward

				return (
					<RoundedBox
						key={index}
						args={[BOX_SIZE, BOX_SIZE, height]}
						position={[x, y, z]}
						radius={0.02}
						receiveShadow
					>
						<meshBasicMaterial color={getColorForLevel(commit.level)} />
					</RoundedBox>
				);
			})}
		</RoundedBox>
	);
};

function getColorForLevel(level: number) {
	switch (level) {
		case 0:
			return "#ebedf0";
		case 1:
			return "#9be9a8";
		case 2:
			return "#40c463";
		case 3:
			return "#30a14e";
		case 4:
			return "#216e39";
	}
}

export default Scene;
