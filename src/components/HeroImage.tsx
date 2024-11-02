import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const HeroImage = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImageRef = useRef<HTMLImageElement>();
	const ditheredImageRef = useRef<HTMLImageElement>();
	const animationFrameRef = useRef<number>();

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const isHovered = useMotionValue(0);

	const radius = useTransform(isHovered, [0, 1], [0, 150]);

	const springRadius = useSpring(radius, {
		stiffness: 300,
		damping: 30,
	});

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const originalImage = new Image();
		const ditheredImage = new Image();

		originalImage.src = "/me.jpg";
		ditheredImage.src = "/me_dithered.jpg";

		ditheredImage.onload = () => {
			canvas.width = ditheredImage.width;
			canvas.height = ditheredImage.height;
			ctx.drawImage(ditheredImage, 0, 0);
		};

		originalImageRef.current = originalImage;
		ditheredImageRef.current = ditheredImage;
	}, []);

	useEffect(() => {
		const updateCanvas = () => {
			const canvas = canvasRef.current;
			if (!canvas || !originalImageRef.current || !ditheredImageRef.current)
				return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const x = mouseX.get();
			const y = mouseY.get();
			const currentRadius = springRadius.get();

			ctx.drawImage(ditheredImageRef.current, 0, 0);

			if (currentRadius > 0) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(originalImageRef.current, 0, 0);
				ctx.restore();
			}

			animationFrameRef.current = requestAnimationFrame(updateCanvas);
		};

		updateCanvas();
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [mouseX, mouseY, springRadius]);

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		mouseX.set((e.clientX - rect.left) * scaleX);
		mouseY.set((e.clientY - rect.top) * scaleY);
		isHovered.set(1);
	};

	const handleMouseLeave = () => {
		isHovered.set(0);
	};

	return (
		<canvas
			ref={canvasRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ maxWidth: "100%", height: "auto" }}
		/>
	);
};

export default HeroImage;
