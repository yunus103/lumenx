// Post-processing shaders of the viewer's composer chain.
import * as THREE from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass.js";

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

// A lens's depth of field for the room behind the product: discs of samples that grow with the distance from the
// focus. Everything is at least a pixel soft: this image has no antialiasing of its own, and needs none.
const FOCUS = {
  uniforms: {
    tColor: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    near: { value: 0.02 },
    far: { value: 60 },
    focus: { value: 1 },
    aspect: { value: 1 },
    minBlur: { value: 0.001 },
  },
  vertexShader: VERTEX,
  fragmentShader: `#include <packing>
    uniform sampler2D tColor, tDepth; uniform float near, far, focus, aspect, minBlur; varying vec2 vUv;
    const float MAX_R = .011;
    float dist(vec2 uv) { return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, near, far); }
    float blur(float d) {
      float away = max(0., abs(d - focus) - .3 - .25 * focus);
      return max(minBlur, min(MAX_R, .018 * away / (d * max(focus, .35)) * (d < focus ? .5 : 1.)));
    }
    void main() {
      float d = dist(vUv), own = blur(d);
      vec3 sum = texture2D(tColor, vUv).rgb; float n = 1.;
      for (int i = 1; i <= 18; i++) {
        float r = sqrt(float(i) / 18.) * own, a = float(i) * 2.39996;
        vec2 uv = vUv + vec2(cos(a) / aspect, sin(a)) * r;
        float sd = dist(uv);
        if (sd >= d || blur(sd) >= r) { sum += texture2D(tColor, uv).rgb; n += 1.; }
      }
      gl_FragColor = vec4(sum / n, 1.);
    }`,
};

// Draws the frame in two steps: the room alone, blurred, then what stands on the table over it. The product and the
// table are drawn exactly as without a depth of field, antialiased against the blurred room: no post-process ever
// touches their pixels, so nothing can bleed around them. Their glasses show the blurred room behind them by themselves.
export class FocusedRoomPass extends Pass {
  private readonly room = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType),
  });
  private readonly quad = new FullScreenQuad(
    new THREE.ShaderMaterial({ ...FOCUS, uniforms: THREE.UniformsUtils.clone(FOCUS.uniforms), depthTest: false, depthWrite: false }),
  );

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly focusPoint: () => THREE.Vector3,
    // which part is on show: the room, the table, or (null) both
    private readonly show: (room: boolean | null) => void,
  ) {
    super();
    this.needsSwap = false;
    this.enabled = false;
  }

  setSize(width: number, height: number) {
    this.room.setSize(width, height);
  }

  render(renderer: THREE.WebGLRenderer, _writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    const autoClear = renderer.autoClear;
    const background = this.scene.background;
    renderer.autoClear = true;
    this.show(true);
    renderer.setRenderTarget(this.room);
    renderer.render(this.scene, this.camera);

    const material = this.quad.material as THREE.ShaderMaterial;
    const u = material.uniforms;
    u.tColor.value = this.room.texture;
    u.tDepth.value = this.room.depthTexture;
    u.near.value = this.camera.near;
    u.far.value = this.camera.far;
    u.focus.value = this.camera.position.distanceTo(this.focusPoint());
    u.aspect.value = this.camera.aspect;
    u.minBlur.value = 1.2 / Math.max(this.room.height, 1);
    renderer.setRenderTarget(readBuffer);
    renderer.clear();
    this.quad.render(renderer);

    renderer.autoClear = false;
    this.scene.background = null;
    this.show(false);
    renderer.render(this.scene, this.camera);

    this.show(null);
    this.scene.background = background;
    renderer.autoClear = autoClear;
  }

  dispose() {
    this.room.depthTexture?.dispose();
    this.room.dispose();
    this.quad.material.dispose();
    this.quad.dispose();
  }
}

// The photograph's last touches, on the encoded image: corners a little darker, and a dither of less than one step
// of 8 bits against banding in the room's dark gradients, invisible on the product.
export const FINISH = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: VERTEX,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 p = vUv - .5;
      c *= 1. - .3 * smoothstep(.12, .62, dot(p, p));
      float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))));
      gl_FragColor = vec4(c + (n - .5) / 255., 1.);
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
