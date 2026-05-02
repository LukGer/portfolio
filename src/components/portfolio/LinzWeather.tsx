import { useEffect, useState } from "react";

const LINZ = { lat: 48.3069, lon: 14.2858 };

type WeatherPayload = {
	tempC: number;
	label: string;
};

function wmoCodeToLabel(code: number): string {
	if (code === 0) return "CLEAR";
	if (code === 1) return "MAINLY CLEAR";
	if (code === 2) return "PARTLY CLOUDY";
	if (code === 3) return "OVERCAST";
	if (code === 45 || code === 48) return "FOG";
	if (code >= 51 && code <= 57) return "DRIZZLE";
	if (code >= 61 && code <= 67) return "RAIN";
	if (code >= 71 && code <= 77) return "SNOW";
	if (code >= 80 && code <= 82) return "SHOWERS";
	if (code === 85 || code === 86) return "SNOW SHOWERS";
	if (code >= 95 && code <= 99) return "STORM";
	return "VARIABLE";
}

function WeatherSkeleton() {
	return (
		<span
			className="inline-flex items-center gap-1.5"
			aria-busy="true"
			aria-label="Loading weather"
		>
			<span className="inline-block h-[11px] w-6 animate-pulse rounded-[2px] bg-line" />
			<span className="inline-block h-[11px] w-8 max-w-[min(100%,7rem)] animate-pulse rounded-[2px] bg-line" />
		</span>
	);
}

export function LinzWeather() {
	const [data, setData] = useState<WeatherPayload | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		const ac = new AbortController();
		const url = new URL("https://api.open-meteo.com/v1/forecast");
		url.searchParams.set("latitude", String(LINZ.lat));
		url.searchParams.set("longitude", String(LINZ.lon));
		url.searchParams.set("current", "temperature_2m,weather_code");
		url.searchParams.set("timezone", "Europe/Vienna");

		void (async () => {
			try {
				const res = await fetch(url.toString(), { signal: ac.signal });
				if (!res.ok) throw new Error(String(res.status));
				const json: {
					current?: {
						temperature_2m?: number;
						weather_code?: number;
					};
				} = await res.json();
				const c = json.current;
				if (
					c?.temperature_2m === undefined ||
					c?.weather_code === undefined
				) {
					throw new Error("missing fields");
				}
				setData({
					tempC: Math.round(c.temperature_2m),
					label: wmoCodeToLabel(c.weather_code),
				});
				setFailed(false);
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				setFailed(true);
			}
		})();

		return () => ac.abort();
	}, []);

	if (failed) return <span className="text-muted">—</span>;
	if (!data) return <WeatherSkeleton />;

	return (
		<span className="tabular-nums">
			{data.tempC}° {data.label}
		</span>
	);
}
