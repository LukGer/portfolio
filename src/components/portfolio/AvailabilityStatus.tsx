import { useEffect, useState } from "react";

type PhaseLabel = "WORKING" | "EVENING" | "RELAXING" | "SLEEPING";

type Phase = {
	label: PhaseLabel;
	textClass: string;
	dotClass: string;
	pulse: boolean;
};

const PHASE_BY_LABEL: Record<PhaseLabel, Phase> = {
	WORKING: {
		label: "WORKING",
		textClass: "text-yellow-400",
		dotClass: "bg-yellow-400",
		pulse: true,
	},
	EVENING: {
		label: "EVENING",
		textClass: "text-teal-500",
		dotClass: "bg-teal-500",
		pulse: true,
	},
	RELAXING: {
		label: "RELAXING",
		textClass: "text-orange-400",
		dotClass: "bg-orange-400",
		pulse: true,
	},
	SLEEPING: {
		label: "SLEEPING",
		textClass: "text-sky-500",
		dotClass: "bg-sky-500",
		pulse: false,
	},
};

function viennaCalendarParts(d: Date) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Vienna",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).formatToParts(d);

	const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
	const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
	const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
	return { weekday, minutes: hour * 60 + minute };
}

function phaseForNow(): Phase {
	const { weekday, minutes } = viennaCalendarParts(new Date());
	const isWeekend = weekday === "Sat" || weekday === "Sun";

	if (isWeekend) {
		if (minutes >= 9 * 60 && minutes < 22 * 60) return PHASE_BY_LABEL.RELAXING;
		return PHASE_BY_LABEL.SLEEPING;
	}

	if (minutes >= 9 * 60 && minutes < 17 * 60) return PHASE_BY_LABEL.WORKING;
	if (minutes >= 17 * 60 && minutes < 22 * 60) return PHASE_BY_LABEL.EVENING;
	return PHASE_BY_LABEL.SLEEPING;
}

export function AvailabilityStatus() {
	const [phase, setPhase] = useState<Phase | null>(null);

	useEffect(() => {
		const tick = () => setPhase(phaseForNow());
		tick();
		const id = window.setInterval(tick, 60_000);
		return () => window.clearInterval(id);
	}, []);

	if (!phase) {
		return (
			<span className="text-muted">
				<span className="mr-1.5 inline-block size-1.5 rounded-full bg-muted" />
				—
			</span>
		);
	}

	return (
		<span className={phase.textClass}>
			<span
				className={[
					"mr-1.5 inline-block size-1.5 rounded-full",
					phase.dotClass,
					phase.pulse ? "animate-pulse-status" : "opacity-75",
				].join(" ")}
			/>
			{phase.label}
		</span>
	);
}
