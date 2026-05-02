import { useCallback, useEffect, useRef, useState } from "react";

const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789@._-";

interface Props {
	email?: string;
	label?: string;
}

export function ScrambleEmailLink({
	email = "lukger1999@gmail.com",
	label = "EMAIL",
}: Props) {
	const [display, setDisplay] = useState(email);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		setDisplay(email);
	}, [email]);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				window.clearInterval(timerRef.current);
			}
		};
	}, []);

	const scramble = useCallback(() => {
		if (timerRef.current !== null) {
			window.clearInterval(timerRef.current);
		}
		let frame = 0;
		const total = 16;
		timerRef.current = window.setInterval(() => {
			frame++;
			const next = email
				.split("")
				.map((ch, i) => {
					if (ch === "@" || ch === ".") {
						return ch;
					}
					const reveal = frame / total > i / email.length;
					return reveal ? ch : CHARSET[Math.floor(Math.random() * CHARSET.length)];
				})
				.join("");
			setDisplay(next);
			if (frame >= total) {
				if (timerRef.current !== null) {
					window.clearInterval(timerRef.current);
					timerRef.current = null;
				}
				setDisplay(email);
			}
		}, 30);
	}, [email]);

	return (
		<a
			className="portfolio-contact-link text-inherit no-underline"
			href={`mailto:${email}`}
			onMouseEnter={scramble}
		>
			<div className="mb-1 text-[11px] tracking-wide text-muted">{label}</div>
			<div className="text-sm font-bold">{display}</div>
		</a>
	);
}
