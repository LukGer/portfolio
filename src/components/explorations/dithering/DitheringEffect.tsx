import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";

export type DitheringType = "bayer" | "atkinson" | "riemersma";

const bayerDithering = `
uniform vec3 color1;
uniform vec3 color2;
uniform vec2 uResolution;

float dither(vec2 uv) {
  float thresholdMatrix[16] = float[16](
    0.0, 0.5, 0.125, 0.625,
    0.75, 0.25, 0.875, 0.375,
    0.1875, 0.6875, 0.0625, 0.5625,
    0.9375, 0.4375, 0.8125, 0.3125
  );
  vec2 pixelPos = floor(uv * 4.0);
  int index = int(mod(pixelPos.x, 4.0) + 4.0 * mod(pixelPos.y, 4.0));
  return thresholdMatrix[index];
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float grayscale = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  float threshold = dither(uv * uResolution);
  vec3 color = grayscale < threshold ? color1 : color2;
  outputColor = vec4(color, 1.0);
}
`;

const atkinsonDithering = `
uniform vec3 color1;
uniform vec3 color2;
uniform vec2 uResolution;

float atkinsonDither(vec2 uv) {
  // Atkinson 4x4 threshold matrix
  float thresholdMatrix[16] = float[16](
    0.0,   0.75,  0.25, 0.5,
    0.5,   0.25,  0.75, 0.0,
    0.25,  0.5,   0.0,  0.75,
    0.75,  0.0,   0.5,  0.25
  );

  // Calculate position within the 4x4 matrix
  vec2 pixelPos = floor(uv * 4.0);
  int index = int(mod(pixelPos.x, 4.0) + 4.0 * mod(pixelPos.y, 4.0));

  // Return the threshold value for this pixel
  return thresholdMatrix[index];
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Convert input color to grayscale intensity
  float grayscale = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

  // Apply Atkinson dithering based on the threshold
  float threshold = atkinsonDither(uv * uResolution);
  vec3 color = grayscale < threshold ? color1 : color2;

  outputColor = vec4(color, 1.0);
}

`;

const riemersmaDithering = `
uniform vec3 color1;
uniform vec3 color2;
uniform vec2 uResolution;

float riemersmaDither(vec2 uv) {
  // A 4x4 dither pattern that alternates based on row parity
  float thresholdMatrix[16] = float[16](
    0.0,  0.25,  0.5,  0.75,
    0.75, 0.5,   0.25, 0.0,
    0.5,  0.75,  0.0,  0.25,
    0.25, 0.0,   0.75, 0.5
  );

  // Calculate position within the 4x4 matrix
  vec2 pixelPos = floor(uv * 4.0);

  // Alternate row pattern based on y-coordinate to emulate serpentine scanning
  bool reverse = mod(pixelPos.y, 2.0) < 1.0;
  int x = int(reverse ? (3.0 - mod(pixelPos.x, 4.0)) : mod(pixelPos.x, 4.0));
  int y = int(mod(pixelPos.y, 4.0));
  int index = x + y * 4;

  // Return the threshold value for this pixel
  return thresholdMatrix[index];
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Convert input color to grayscale intensity
  float grayscale = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

  // Apply Riemersma dithering based on the alternating threshold
  float threshold = riemersmaDither(uv * uResolution);
  vec3 color = grayscale < threshold ? color1 : color2;

  outputColor = vec4(color, 1.0);
}
`;

const ditheringAlgorithms = {
	bayer: bayerDithering,
	atkinson: atkinsonDithering,
	riemersma: riemersmaDithering,
} as const;

class DitheringEffectImpl extends Effect {
	private scale: number;

	constructor({
		color1 = new THREE.Color(0x000000),
		color2 = new THREE.Color(0xffffff),
		scale,
		type,
	}: {
		color1: THREE.Color;
		color2: THREE.Color;
		scale: number;
		type: DitheringType;
	}) {
		const shader = ditheringAlgorithms[type];

		super("DitheringEffect", shader, {
			uniforms: new Map<string, THREE.Uniform>([
				["color1", new THREE.Uniform(color1)],
				["color2", new THREE.Uniform(color2)],
				["uResolution", new THREE.Uniform(new THREE.Vector2())],
			]),
		});
		this.scale = scale;
	}

	update(renderer: THREE.Renderer) {
		this.uniforms
			.get("uResolution")
			?.value.set(
				renderer.domElement.width / this.scale,
				renderer.domElement.height / this.scale,
			);
	}
}

export const DitheringEffect = forwardRef<
	unknown,
	{
		color1: THREE.Color;
		color2: THREE.Color;
		scale: number;
		type: DitheringType;
	}
>((param, ref) => {
	const effect = useMemo(() => new DitheringEffectImpl(param), [param]);
	return <primitive ref={ref} object={effect} dispose={null} />;
});
