import { useEffect, useState } from "react";

export function ViennaClock() {
	const [time, setTime] = useState("—");

	useEffect(() => {
		const tick = () => {
			setTime(
				new Date().toLocaleTimeString("en-AT", {
					hour12: false,
					timeZone: "Europe/Vienna",
				}),
			);
		};
		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, []);

	return <span className="tabular-nums">{time}</span>;
}
