// 완료 폭죽 — 캔버스 파티클.
//
// 앱 축하 연출의 표준 방식을 따른다: 화면에 들어온 순간 여러 발이 한꺼번에(살짝 시차를 두고) 터지고 끝난다.
// 로켓이 아래에서 계속 올라가며 한 발씩 터지는 건 불꽃놀이 데모의 방식이지 앱 축하 화면의 방식이 아니다.
//
// 파티클 물리는 고전 캔버스 폭죽 구현을 그대로 쓴다 —
//   각도 0~2π · 속도 랜덤 · friction 0.95 로 감속 · gravity 로 처짐 · alpha 를 프레임당 깎아 소멸
//   좌표 히스토리로 선을 그어 잔상을 만든다
// 참고: thecodeplayer / julkwel canvas fireworks, canvas-confetti 의 축하 프리셋
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

type Vec = { x: number; y: number };

interface Props {
  width: number;
  height: number;
  colors: string[];
  /** 0~19 — 터지는 형태·개수·중력·발수가 달라진다 */
  variant: number;
  /** 0.6(절제) ~ 1.0(요란) */
  power?: number;
  /** add=어두운 배경 / normal=밝은 배경 (밝은 면에서 additive 는 안 보인다) */
  blend?: 'add' | 'normal';
}

const rand = (a: number, b: number) => Math.random() * (b - a) + a;

class Particle {
  coords: Vec[] = [];
  angle: number;
  speed: number;
  alpha = 1;
  constructor(
    public x: number,
    public y: number,
    public color: string,
    public friction: number,
    public gravity: number,
    public decay: number,
    public size: number,
    trail: number,
    angle: number,
    speed: number
  ) {
    for (let i = 0; i < trail; i++) this.coords.push({ x, y });
    this.angle = angle;
    this.speed = speed;
  }
  /** @returns true 면 소멸 */
  step(): boolean {
    this.coords.pop();
    this.coords.unshift({ x: this.x, y: this.y });
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    return this.alpha <= this.decay;
  }
  draw(ctx: CanvasRenderingContext2D) {
    const last = this.coords[this.coords.length - 1];
    const a = Math.max(0, this.alpha);
    // 수명 후반에는 반짝임(트윙클) — 게임 폭죽의 잔불 느낌
    const twinkle = a < 0.55 ? 0.55 + 0.45 * Math.random() : 1;

    // 글로우는 넓은 저알파 스트로크로 흉내낸다 — shadowBlur 는 파티클 수 × 블러 반경만큼
    // 프레임을 잡아먹어 저사양(소프트웨어 캔버스)에서 뚝뚝 끊긴다
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'round';
    ctx.globalAlpha = a * 0.3;
    ctx.lineWidth = this.size * 2.6;
    ctx.stroke();
    ctx.globalAlpha = a * twinkle;
    ctx.lineWidth = this.size;
    ctx.stroke();

    // 화이트핫 코어 — 머리는 흰색에 가깝게 타오른다
    ctx.globalAlpha = a * twinkle * 0.85;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const KINDS = ['peony', 'ring', 'palm', 'willow', 'chrysanthemum', 'crossette', 'spiral', 'comet', 'glitter', 'double'] as const;

/** variant 마다 터지는 성격이 다르다 */
function profileOf(v: number, power: number, thick: number) {
  // 파티클마다 블룸(shadowBlur)을 얹는 구조라 수가 곧 프레임 비용이다 — 밀도를 낮춰 연출은 유지하고 비용만 줄인다
  power *= 0.62;
  const V = ((v % 20) + 20) % 20;
  const kind = KINDS[V % 10];
  const big = V >= 10;
  const b = {
    kind,
    shots: 3 + (V % 2), // 3~4발
    count: Math.round((big ? 44 : 32) * power),
    speed: [1.4, 6.4] as [number, number],
    gravity: 0.85,
    friction: 0.95,
    decay: [0.009, 0.017] as [number, number],
    trail: 7,
    size: thick,
    even: false,
  };
  switch (kind) {
    case 'ring':
      return { ...b, count: Math.round(40 * power), speed: [4.8, 5.4] as [number, number], even: true, decay: [0.008, 0.014] as [number, number] };
    case 'palm':
      return { ...b, count: Math.round(22 * power), speed: [5.5, 8.5] as [number, number], gravity: 1.2, trail: 9, size: thick * 1.35 };
    case 'willow':
      return { ...b, count: Math.round(42 * power), speed: [2.4, 5.4] as [number, number], gravity: 0.26, friction: 0.978, decay: [0.005, 0.009] as [number, number], trail: 11, size: thick * 0.8 };
    case 'chrysanthemum':
      return { ...b, count: Math.round(58 * power), speed: [1.8, 6] as [number, number], trail: 8, size: thick * 1.2 };
    case 'crossette':
      return { ...b, count: Math.round(26 * power), speed: [3.8, 6.8] as [number, number], size: thick * 1.4, trail: 6 };
    case 'spiral':
      return { ...b, count: Math.round(46 * power), speed: [3.2, 6] as [number, number], even: true, trail: 8 };
    case 'comet':
      return { ...b, count: Math.round(18 * power), speed: [6, 9] as [number, number], trail: 13, size: thick * 1.45, decay: [0.008, 0.013] as [number, number] };
    case 'glitter':
      return { ...b, count: Math.round(66 * power), speed: [1, 4.6] as [number, number], size: thick * 0.62, trail: 5, decay: [0.013, 0.024] as [number, number] };
    case 'double':
      return { ...b, count: Math.round(54 * power), speed: [1.8, 7] as [number, number], trail: 7 };
    default:
      return b;
  }
}

export function CanvasFireworks({ width, height, colors, variant, power = 1, blend = 'add' }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(1.25, (globalThis as any).devicePixelRatio || 1);
    cv.width = Math.round(width * dpr);
    cv.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    const P = profileOf(variant, power, blend === 'add' ? 2.4 : 4.0);
    // 한 번에 확 터지고 빨리 사그라드는 스냅감 — 수명·트레일을 짧게 조인다
    P.decay = [P.decay[0] * 1.6, P.decay[1] * 1.6];
    P.trail = Math.min(P.trail, 6);
    const palette = colors.length ? colors : ['#ffffff'];
    const parts: Particle[] = [];
    const flashes: { x: number; y: number; r: number; a: number; color: string }[] = [];

    // 터질 자리 — 화면 위쪽에 폭을 넓게 흩는다. variant 마다 배치가 다르다.
    const spots = Array.from({ length: P.shots }, (_, i) => {
      const t = P.shots === 1 ? 0.5 : i / (P.shots - 1);
      const jitterX = ((variant * 37 + i * 53) % 100) / 100 - 0.5;
      return {
        x: width * (0.2 + t * 0.6 + jitterX * 0.07),
        y: height * (0.16 + (((variant * 17 + i * 29) % 100) / 100) * 0.3),
        delay: i * (55 + (variant % 4) * 20), // 살짝씩 시차를 두고 연달아 — 빠르게 몰아친다
        color: palette[i % palette.length],
      };
    });

    const burst = (x: number, y: number, color: string) => {
      for (let i = 0; i < P.count; i++) {
        const angle = P.even ? (i / P.count) * Math.PI * 2 : rand(0, Math.PI * 2);
        const speed = rand(P.speed[0], P.speed[1]);
        const col = P.kind === 'double' && i % 2 ? palette[(palette.length - 1) % palette.length] : color;
        parts.push(new Particle(x, y, col, P.friction, P.gravity, rand(P.decay[0], P.decay[1]), P.size, P.trail, angle, speed));
      }
      flashes.push({ x, y, r: 4, a: 0.95, color });
    };

    // 2차 크래클 — 일부 파티클이 사그라들며 잔불 스파크를 한 번 더 터뜨린다 (모던 폭죽 연출)
    const crackle = (px: number, py: number, color: string) => {
      const n = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        parts.push(
          new Particle(px, py, Math.random() < 0.4 ? '#FFFFFF' : color, 0.9, P.gravity * 0.6,
            rand(0.03, 0.05), Math.max(1.2, P.size * 0.45), 3, rand(0, Math.PI * 2), rand(0.8, 2.4)),
        );
      }
    };

    const timers = spots.map((s) => setTimeout(() => burst(s.x, s.y, s.color), s.delay));

    let raf = 0;
    let stopped = false;
    let idle = 0;

    const loop = () => {
      if (stopped) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = blend === 'add' ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';

      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, blend === 'add' ? `rgba(255,255,255,${f.a.toFixed(2)})` : f.color);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = blend === 'add' ? 1 : Math.max(0, f.a);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        f.r += 3.2;
        f.a -= 0.09;
        if (f.a <= 0) flashes.splice(i, 1);
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        parts[i].draw(ctx);
        if (parts[i].step()) {
          // 큰 파티클 일부는 사라지며 잔불 크래클을 남긴다
          if (parts[i].size >= 2 && Math.random() < 0.12 && parts.length < 150) {
            crackle(parts[i].x, parts[i].y, parts[i].color);
          }
          parts.splice(i, 1);
        }
      }

      // 다 사라지면 루프를 멈춘다. 한 번 터지고 끝나는 연출이라 계속 돌 이유가 없다.
      if (!parts.length && !flashes.length) {
        idle++;
        if (idle > 30) {
          stopped = true;
          return;
        }
      } else idle = 0;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [width, height, variant, power, blend, colors.join(',')]);

  if (Platform.OS !== 'web') return null;
  return <canvas ref={ref} style={{ position: 'absolute', top: 0, left: 0, width, height, pointerEvents: 'none' }} />;
}
