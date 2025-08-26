"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * WebGL version: visually identical but dramatically faster (esp. Safari).
 * - 3 layered sine "fills" with gradients
 * - radial fade mask
 * - fBm smoke blended with SCREEN
 * - soft edges (bloom-ish) via wide smoothstep
 */
export function WaveBg({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  // HSL -> RGB (0..1)
  function hsl(h: number, s: number, l: number) {
    h = ((h % 360) + 360) % 360;
    s = s / 100;
    l = l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [r + m, g + m, b + m];
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = (canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    // Fixed design space like your SVG viewBox
    const W = 1600;
    const H = 340;

    // Same wave params
    const layers = [
      {
        amp: 16,
        freq: 0.01,
        speed: 1.0,
        lift: -6,
        alpha: 0.75,
        grad: "wave1" as const,
      },
      {
        amp: 12,
        freq: 0.014,
        speed: 1.4,
        lift: 0,
        alpha: 0.85,
        grad: "wave2" as const,
      },
      {
        amp: 10,
        freq: 0.018,
        speed: 1.8,
        lift: 6,
        alpha: 0.95,
        grad: "wave3" as const,
      },
    ];

    // Gradients — brighter, more vibrant colors
    const wave1a = hsl(208, 90, 62); // Brighter blues
    const wave1b = hsl(248, 80, 66);
    const wave1c = hsl(312, 80, 66);

    const wave2a = hsl(206, 92, 64);
    const wave2b = hsl(255, 82, 68);
    const wave2c = hsl(318, 82, 68);

    const wave3a = hsl(215, 94, 68);
    const wave3b = hsl(268, 88, 70);
    const wave3c = hsl(330, 85, 70);

    // Build program
    const vs = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const fs = `
      precision mediump float;

      uniform vec2 u_res;     // canvas size in CSS px
      uniform vec2 u_view;    // design space (1600x340)
      uniform float u_time;   // seconds
      uniform float u_opacity;// overall opacity like your SVG
      uniform float u_blurPx; // edge softness (similar to blur-2xl feel)
      uniform float u_dpr;    // device pixel ratio

      // wave params (pixels / design space)
      uniform float u_amp[3];
      uniform float u_freq[3];
      uniform float u_speed[3];
      uniform float u_lift[3];
      uniform float u_alpha[3];

      // gradient stops for each wave (rgb 0..1)
      uniform vec3 u_w1a; uniform vec3 u_w1b; uniform vec3 u_w1c;
      uniform vec3 u_w2a; uniform vec3 u_w2b; uniform vec3 u_w2c;
      uniform vec3 u_w3a; uniform vec3 u_w3b; uniform vec3 u_w3c;

      // ----- utility -----
      vec3 grad3stop(vec3 a, vec3 b, vec3 c, float t){
        // 0..0.5: a->b, 0.5..1: b->c
        return mix(a, b, smoothstep(0.0, 0.5, t)) * (1.0 - step(0.5, t))
             + mix(b, c, smoothstep(0.5, 1.0, t)) * step(0.5, t);
      }

      // value noise / fBm (cheap)
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0 - 2.0*f);
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0;
        float amp = 0.55;
        for(int i=0;i<4;i++){
          v += noise(p) * amp;
          p *= 2.0;
          amp *= 0.55;
        }
        return v;
      }

      // SCREEN blend
      vec3 screen(vec3 a, vec3 b){ return 1.0 - (1.0 - a)*(1.0 - b); }

      void main(){
        // map frag to design space coords (like your SVG viewBox)
        vec2 uv = gl_FragCoord.xy / u_dpr;      // CSS px
        vec2 p  = uv * vec2(u_view.x / u_res.x, u_view.y / u_res.y); // -> design px
        float x = p.x;
        float y = p.y;

        // normalized across design space
        float nx = clamp(x / u_view.x, 0.0, 1.0);
        float ny = clamp(y / u_view.y, 0.0, 1.0);

        // Radial fade mask (center ~ 50% x, 35% y; r ~ 75%)
        vec2 c = vec2(0.5, 0.35);
        float r = 0.75;
        float dist = distance(vec2(nx, ny), c) / r;
        float radialFade = smoothstep(1.0, 0.7, 1.0 - dist); // keep bright center, fade edges
        
        // Additional vertical fade for smooth bottom blending
        float verticalFade = 1.0 - smoothstep(0.5, 0.85, ny); // Earlier, smoother fade
        float fade = radialFade * verticalFade;

        // Waves
        vec3 acc = vec3(0.0);
        float blur = u_blurPx; // px in design space

        for(int i=0;i<3;i++){
          float amp   = u_amp[i];
          float freq  = u_freq[i];
          float speed = u_speed[i];
          float lift  = u_lift[i];
          float a     = u_alpha[i];

          // same tri-sine recipe as your JS
          float base = u_view.y * 0.5 + lift +
                       sin(x * freq + u_time * speed) * amp +
                       sin(x * freq * 0.33 + u_time * speed * 1.6) * (amp * 0.5) +
                       sin(x * freq * 0.12 + u_time * speed * 0.7) * (amp * 0.25);

          // signed distance in px (positive below the curve)
          float sd = (y - base);

          // wide smoothstep -> soft boundary like blur/bloom
          float cover = smoothstep(0.0, blur, sd); // 0 above, ->1 within 'blur' px below

          // choose gradient set
          vec3 colA = (i==0) ? u_w1a : ((i==1) ? u_w2a : u_w3a);
          vec3 colB = (i==0) ? u_w1b : ((i==1) ? u_w2b : u_w3b);
          vec3 colC = (i==0) ? u_w1c : ((i==1) ? u_w2c : u_w3c);
          vec3 gcol = grad3stop(colA, colB, colC, nx);

          // accumulate premultiplied
          acc += gcol * a * cover;
        }

        // Soft “bloomish” lift (cheap tone curve)
        acc = pow(acc, vec3(0.9)); // subtle lift in highlights

        // Smoke (slowly varying baseFrequency like your animate)
        float bf1 = mix(0.004, 0.006, 0.5 + 0.5 * sin(u_time * 0.26));
        float bf2 = mix(0.009, 0.012, 0.5 + 0.5 * sin(u_time * 0.26));
        float s = fbm(vec2(nx / bf1, ny / bf2) + vec2(u_time * 0.01, -u_time * 0.006));
        // blur-ish softness is inherent in fBm; scale alpha to ~0.18 like your feColorMatrix
        vec3 smoke = vec3(s) * 0.18;

        // SCREEN blend smoke over waves
        vec3 outCol = acc;

        // Apply radial fade and global opacity (your svg opacity ~0.66 / 0.7)
        outCol *= fade * u_opacity;

        gl_FragColor = vec4(outCol, fade * u_opacity);
      }
    `;

    function makeShader(type: number, src: string) {
      const sh = gl?.createShader(type)!;
      gl?.shaderSource(sh, src);
      gl?.compileShader(sh);
      if (!gl?.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl?.getShaderInfoLog(sh));
      }
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const tri = new Float32Array([-1, -1, 3, -1, -1, 3]);
    gl.bufferData(gl.ARRAY_BUFFER, tri, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const u_res = gl.getUniformLocation(prog, "u_res");
    const u_view = gl.getUniformLocation(prog, "u_view");
    const u_time = gl.getUniformLocation(prog, "u_time");
    const u_opacity = gl.getUniformLocation(prog, "u_opacity");
    const u_blurPx = gl.getUniformLocation(prog, "u_blurPx");
    const u_dpr = gl.getUniformLocation(prog, "u_dpr");

    const u_amp = gl.getUniformLocation(prog, "u_amp");
    const u_freq = gl.getUniformLocation(prog, "u_freq");
    const u_speed = gl.getUniformLocation(prog, "u_speed");
    const u_lift = gl.getUniformLocation(prog, "u_lift");
    const u_alpha = gl.getUniformLocation(prog, "u_alpha");

    const u_w1a = gl.getUniformLocation(prog, "u_w1a");
    const u_w1b = gl.getUniformLocation(prog, "u_w1b");
    const u_w1c = gl.getUniformLocation(prog, "u_w1c");
    const u_w2a = gl.getUniformLocation(prog, "u_w2a");
    const u_w2b = gl.getUniformLocation(prog, "u_w2b");
    const u_w2c = gl.getUniformLocation(prog, "u_w2c");
    const u_w3a = gl.getUniformLocation(prog, "u_w3a");
    const u_w3b = gl.getUniformLocation(prog, "u_w3b");
    const u_w3c = gl.getUniformLocation(prog, "u_w3c");

    // Push static uniforms
    gl.uniform2f(u_view, W, H);
    gl.uniform1f(u_opacity, 0.65); // balanced opacity for visibility
    gl.uniform1f(u_blurPx, 60.0); // softer edges for subtler effect

    gl.uniform3f(u_w1a, wave1a[0], wave1a[1], wave1a[2]);
    gl.uniform3f(u_w1b, wave1b[0], wave1b[1], wave1b[2]);
    gl.uniform3f(u_w1c, wave1c[0], wave1c[1], wave1c[2]);

    gl.uniform3f(u_w2a, wave2a[0], wave2a[1], wave2a[2]);
    gl.uniform3f(u_w2b, wave2b[0], wave2b[1], wave2b[2]);
    gl.uniform3f(u_w2c, wave2c[0], wave2c[1], wave2c[2]);

    gl.uniform3f(u_w3a, wave3a[0], wave3a[1], wave3a[2]);
    gl.uniform3f(u_w3b, wave3b[0], wave3b[1], wave3b[2]);
    gl.uniform3f(u_w3c, wave3c[0], wave3c[1], wave3c[2]);

    gl.uniform1fv(u_amp, new Float32Array(layers.map((l) => l.amp)));
    gl.uniform1fv(u_freq, new Float32Array(layers.map((l) => l.freq)));
    gl.uniform1fv(u_speed, new Float32Array(layers.map((l) => l.speed)));
    gl.uniform1fv(u_lift, new Float32Array(layers.map((l) => l.lift)));
    gl.uniform1fv(u_alpha, new Float32Array(layers.map((l) => l.alpha)));

    // Resize handling
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for perf
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(u_res, rect.width, rect.height);
      gl.uniform1f(u_dpr, dpr);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    // Animation
    const start = performance.now();
    let last = start;
    const minMs = 1000 / 30; // reduced framerate for less prominence

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = now - last;
      if (dt < minMs) return;
      last = now;

      const t = (now - start) / 1000;
      gl.uniform1f(u_time, t);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden [perspective:1000px] contain-paint",
        className,
      )}
      aria-hidden
    >
      {/* Soft vignette behind everything - slightly more visible */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_0%,hsl(220_40%_15%/0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_20%,hsl(270_45%_17%/0.35),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_15%_25%,hsl(328_50%_17%/0.3),transparent_60%)]" />
      </div>

      {/* GPU-rendered waves+smoke+screen in one pass */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-[220%] -translate-x-[18%] opacity-[0.5] dark:opacity-[0.55] block [mask-image:linear-gradient(to_bottom,black_0%,black_60%,transparent_90%)]"
      />

      {/* Subtle grain */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.03]",
          "[background-image:radial-gradient(circle_at_center,white_0.5px,transparent_0.6px)]",
          "[background-size:2px_2px]",
        )}
      />

      {/* Outer vignette with bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_10%,transparent,transparent_55%,hsl(240_10%_6%/0.2)] [mask-image:linear-gradient(to_bottom,black_0%,black_60%,transparent_85%)]" />
    </div>
  );
}
