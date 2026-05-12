import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const CHIPS = [
	{ id: "s00", n: "00", label: "Work" },
	{ id: "s01", n: "01", label: "Projects" },
	{ id: "s02", n: "02", label: "Stack" },
	{ id: "s03", n: "03", label: "Off" },
	{ id: "s04", n: "04", label: "Hi" },
] as const;

const PAD = 6;
const RADIUS = 10;
const SPRING = {
	type: "spring",
	stiffness: 360,
	damping: 34,
	mass: 0.6,
} as const;

type Rect = { left: number; width: number };

export function MobileDock() {
	const dockRef = useRef<HTMLDivElement | null>(null);
	const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [rect, setRect] = useState<Rect | null>(null);
	const [dockWidth, setDockWidth] = useState(0);

	useLayoutEffect(() => {
		const dock = dockRef.current;
		if (!dock) return;
		const measure = () => {
			const chip = chipRefs.current[activeIndex];
			if (!chip) return;
			setDockWidth(dock.clientWidth);
			setRect({ left: chip.offsetLeft, width: chip.offsetWidth });
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(dock);
		return () => ro.disconnect();
	}, [activeIndex]);

	useEffect(() => {
		const sections = CHIPS.map((c) => document.getElementById(c.id));
		const onScroll = () => {
			const trigger = window.innerHeight * 0.32;
			let next = 0;
			for (let i = 0; i < sections.length; i++) {
				const s = sections[i];
				if (s && s.getBoundingClientRect().top <= trigger) next = i;
			}
			setActiveIndex((curr) => (curr === next ? curr : next));
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (!el) return;
		const top = el.getBoundingClientRect().top + window.scrollY - 60;
		window.scrollTo({ top, behavior: "smooth" });
	};

	const insetRight = rect
		? Math.max(0, dockWidth - rect.left - rect.width)
		: 0;
	const insetLeft = rect?.left ?? 0;
	const clipPath = `inset(${PAD}px ${insetRight}px ${PAD}px ${insetLeft}px round ${RADIUS}px)`;

	const chipBase =
		"inline-flex min-w-0 flex-1 items-baseline justify-center gap-1.5 rounded-[10px] border-0 bg-transparent px-2 py-2.5 font-sans text-[11px] tracking-[0.02em] whitespace-nowrap";

	return (
		<div className="pointer-events-none fixed inset-x-3 bottom-4 z-40 hidden justify-center max-[900px]:flex">
			<div
				ref={dockRef}
				className="pointer-events-auto relative flex w-full max-w-[456px] gap-1 overflow-hidden rounded-2xl bg-ink/90 p-1.5 shadow-[0_14px_32px_-8px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-lg"
			>
				{rect && (
					<motion.div
						aria-hidden
						className="pointer-events-none absolute left-0 rounded-[10px] bg-lime"
						style={{ top: PAD, height: `calc(100% - ${PAD * 2}px)` }}
						initial={false}
						animate={{ x: rect.left, width: rect.width }}
						transition={SPRING}
					/>
				)}

				{CHIPS.map((chip, i) => (
					<button
						key={chip.id}
						type="button"
						ref={(el) => {
							chipRefs.current[i] = el;
						}}
						onClick={() => scrollToSection(chip.id)}
						className={`${chipBase} cursor-pointer text-line transition-transform duration-200 active:scale-[0.96]`}
					>
						<span className="text-[9px] opacity-50">{chip.n}</span>
						{chip.label}
					</button>
				))}

				{rect && (
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0 flex gap-1 p-1.5"
						initial={false}
						animate={{ clipPath }}
						transition={SPRING}
					>
						{CHIPS.map((chip) => (
							<button
								key={chip.id}
								type="button"
								tabIndex={-1}
								aria-hidden
								className={`${chipBase} text-ink`}
							>
								<span className="text-[9px] opacity-55">{chip.n}</span>
								{chip.label}
							</button>
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
}
