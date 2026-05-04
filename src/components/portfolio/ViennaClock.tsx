import { useEffect, useState } from "react";

/** Linz shares Europe/Vienna (same as AvailabilityStatus). */
const LINZ_TZ = "Europe/Vienna";

function viennaUtcOffset(now: Date): string {
	return (
		new Intl.DateTimeFormat("en-GB", {
			timeZone: LINZ_TZ,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZoneName: "longOffset",
		})
			.formatToParts(now)
			.find((p) => p.type === "timeZoneName")?.value ?? ""
	);
}

export function ViennaClock() {
	const [time, setTime] = useState("—");
	const [utcOffset, setUtcOffset] = useState<string | null>(null);

	useEffect(() => {
		const locale = navigator.language;
		const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const showLinzOffset = userTz !== LINZ_TZ;

		const tick = () => {
			const now = new Date();
			setTime(
				new Intl.DateTimeFormat(locale, {
					timeZone: LINZ_TZ,
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit",
				}).format(now),
			);
			setUtcOffset(showLinzOffset ? viennaUtcOffset(now) : null);
		};

		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, []);

	return (
		<span className="text-right tabular-nums">
			{time}
			{utcOffset ? (
				<span className="opacity-70">
					{" · "}
					{utcOffset}
				</span>
			) : null}
		</span>
	);
}
