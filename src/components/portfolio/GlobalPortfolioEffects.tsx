import { useEffect } from "react";

const KONAMI = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
] as const;

function triggerKonami() {
	const layer = document.createElement("div");
	layer.style.cssText =
		"position:fixed;inset:0;background:oklch(64.82% 0.1754 131.68);z-index:99990;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Space Mono,monospace;font-size:32px;font-weight:700;color:#1a1a18;letter-spacing:-0.02em;animation:eggFade 2.4s ease forwards;pointer-events:none;gap:12px";
	layer.innerHTML =
		'<div>● ● ● you found it</div><div style="font-size:12px;letter-spacing:0.1em;font-weight:400">+1 LIFE</div>';
	const style = document.createElement("style");
	style.textContent =
		"@keyframes eggFade { 0% { opacity: 0 } 12% { opacity: 1 } 80% { opacity: 1 } 100% { opacity: 0 } }";
	document.head.appendChild(style);
	document.body.appendChild(layer);
	window.setTimeout(() => layer.remove(), 2400);
}

/** Konami listener + styled console greeting — mounts once. */
export function GlobalPortfolioEffects() {
	useEffect(() => {
		let step = 0;
		const onKeyDown = (e: KeyboardEvent) => {
			const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
			if (k === KONAMI[step]) {
				step++;
				if (step === KONAMI.length) {
					step = 0;
					triggerKonami();
				}
			} else {
				step = 0;
			}
		};
		window.addEventListener("keydown", onKeyDown);

		console.log(
			"%c LG ",
			"background: oklch(64.82% 0.1754 131.68); color: #1a1a18; font-size: 22px; padding: 6px 10px; font-weight: 700;",
		);
		console.log(
			"%cyou look like someone who reads consoles. say hi → lukger1999@gmail.com",
			"font-family: monospace; color: oklch(35% 0.005 91.45)",
		);

		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return null;
}
