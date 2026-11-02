// Post-processing shaders of the viewer's composer chain.

const VERTEX = "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

// Camera-like response for kit lamps: exposure, linear up to a soft knee, per channel. Per channel on purpose: a
// bright warm shade rolls off to yellow the way it does in the product photos instead of washing out to white,
// and below the knee colours stay exactly as authored. Output stays linear; OutputPass encodes it.
export const KNEE = {
  uniforms: { tDiffuse: { value: null }, exposure: { value: 1 } },
  vertexShader: VERTEX,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float exposure; varying vec2 vUv;
    void main() {
      vec3 x = texture2D(tDiffuse, vUv).rgb * exposure;
      const float k = .72;
      x = mix(x, k + (1. - k) * (1. - exp(-(x - k) / (1. - k))), step(k, x));
      gl_FragColor = vec4(x, 1.);
    }`,
};

// Tiny specular points from close lights reach huge HDR values; bloom would smear them into blocks.
// Clamping (hue-preserving) far above display white changes nothing after tone mapping.
export const CLAMP = {
  uniforms: { tDiffuse: { value: null }, maxv: { value: 4 } },
  vertexShader: VERTEX,
  fragmentShader:
    "uniform sampler2D tDiffuse; uniform float maxv; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); float m = max(max(c.r, c.g), max(c.b, 1e-4)); gl_FragColor = vec4(c.rgb * min(1.0, maxv / m), c.a); }",
};
