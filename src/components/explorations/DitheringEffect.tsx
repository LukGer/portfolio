import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";

const fragmentShader = `
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
    float threshold = dither(uv * vec2(604, 384));
    vec3 color = grayscale < threshold ? color1 : color2;
    outputColor = vec4(color, 1.0);
  }
`;

class DitheringEffectImpl extends Effect {
	constructor({
		color1 = new THREE.Color(0x000000),
		color2 = new THREE.Color(0xffffff),
	}) {
		super("DitheringEffect", fragmentShader, {
			uniforms: new Map([
				["color1", new THREE.Uniform(color1)],
				["color2", new THREE.Uniform(color2)],
			]),
		});
	}

	update(renderer: THREE.Renderer) {
		this.uniforms
			.get("uResolution")
			?.value.set(renderer.domElement.width, renderer.domElement.height);
	}
}

export const DitheringEffect = forwardRef<
	unknown,
	{ color1: THREE.Color; color2: THREE.Color }
>((param, ref) => {
	const effect = useMemo(() => new DitheringEffectImpl(param), [param]);
	return <primitive ref={ref} object={effect} dispose={null} />;
});
