import { useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ASPECT_RATIO = 300 / 400; // Original image aspect ratio

const HeroImage = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>();
  const ditheredImageRef = useRef<HTMLImageElement>();
  const animationFrameRef = useRef<number>();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const radius = useTransform(isHovered, [0, 1], [0, 150]);

  const springRadius = useSpring(radius, {
    duration: 500,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const parentHeight = parent.clientHeight;
      canvas.height = parentHeight;
      canvas.width = parentHeight * ASPECT_RATIO;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const originalImage = new Image();
    const ditheredImage = new Image();
    let loadedImages = 0;

    const checkAllLoaded = () => {
      loadedImages++;
      if (loadedImages === 2) {
        setImagesLoaded(true);
      }
    };

    originalImage.src = "/me.jpg";
    ditheredImage.src = "/me_dithered.jpg";

    originalImage.onload = checkAllLoaded;
    ditheredImage.onload = () => {
      canvas.width = ditheredImage.width;
      canvas.height = ditheredImage.height;
      ctx.drawImage(ditheredImage, 0, 0);
      checkAllLoaded();
    };

    originalImageRef.current = originalImage;
    ditheredImageRef.current = ditheredImage;

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
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
      style={{
        width: "100%",
        height: "100%",
        opacity: imagesLoaded ? 1 : 0,
        transition: "opacity 0.5s ease-in",
      }}
    />
  );
};

export default HeroImage;
