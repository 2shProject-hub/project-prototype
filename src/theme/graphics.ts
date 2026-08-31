// 목업/테마 프리뷰용 벡터 그래픽 — 전부 SVG data URI 라 별도 라이브러리 없이 RN·RNW 양쪽에서 Image 로 쓴다.
// 이모지 대신 이걸 쓰는 이유: 이모지는 플랫폼마다 모양이 달라지고 시안이 싸구려로 보인다.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** 의존성 없는 base64 (SVG 는 전부 ASCII 라 latin1 만으로 충분) */
function toBase64(str: string): string {
  const g = globalThis as any;
  if (typeof g.btoa === 'function') return g.btoa(str);
  let out = '';
  for (let i = 0; i < str.length; i += 3) {
    const c1 = str.charCodeAt(i);
    const c2 = str.charCodeAt(i + 1);
    const c3 = str.charCodeAt(i + 2);
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4);
    const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6);
    const e4 = isNaN(c3) ? 64 : c3 & 63;
    out += B64[e1] + B64[e2] + (e3 === 64 ? '=' : B64[e3]) + (e4 === 64 ? '=' : B64[e4]);
  }
  return out;
}

/**
 * SVG → data URI.
 * ⚠️ 반드시 base64 로 실어야 한다. `;utf8,` + 퍼센트 인코딩 방식은
 * 브라우저가 img.src 를 URL 로 직렬화하면서 '%' 를 '%25' 로 다시 인코딩해버려
 * 색상값('%23xxxxxx')이 통째로 깨진다(아이콘 안 보임 / 그라디언트 투명 / 스크림 검정).
 */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${toBase64(svg.replace(/\s+/g, ' ').trim())}`;
}

function uri(svg: string): string {
  return svgDataUri(svg);
}

const wrap = (inner: string, size = 24) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none">${inner}</svg>`;

type IconName = 'volume' | 'mic' | 'check' | 'chevron' | 'play' | 'sparkle' | 'bookmark' | 'close' | 'back';

const PATHS: Record<IconName, (c: string, w: number) => string> = {
  volume: (c, w) =>
    `<path d="M4 9.5h3l4-3.2v11.4l-4-3.2H4z" fill="${c}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>` +
    `<path d="M15.2 9.1a4 4 0 0 1 0 5.8" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<path d="M17.9 6.6a7.6 7.6 0 0 1 0 10.8" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="0.55"/>`,
  mic: (c, w) =>
    `<rect x="9" y="3" width="6" height="10.5" rx="3" fill="${c}"/>` +
    `<path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<path d="M12 17.6V21" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`,
  check: (c, w) => `<path d="M5 12.6l4.4 4.4L19 7.4" stroke="${c}" stroke-width="${w + 0.4}" stroke-linecap="round" stroke-linejoin="round"/>`,
  chevron: (c, w) => `<path d="M9.5 5.5L16 12l-6.5 6.5" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
  play: (c) => `<path d="M8.5 5.6l10 6.4-10 6.4z" fill="${c}"/>`,
  sparkle: (c) =>
    `<path d="M12 2.6l1.9 5.6 5.6 1.9-5.6 1.9L12 17.6l-1.9-5.6L4.5 10.1l5.6-1.9z" fill="${c}"/>` +
    `<path d="M18.6 15.4l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z" fill="${c}" opacity="0.6"/>`,
  bookmark: (c, w) => `<path d="M6.5 3.8h11v16.4L12 16.4l-5.5 3.8z" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`,
  close: (c, w) => `<path d="M6 6l12 12M18 6L6 18" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`,
  back: (c, w) => `<path d="M14.5 5.5L8 12l6.5 6.5" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export function icon(name: IconName, color: string, size = 20, strokeWidth = 1.7): string {
  return uri(wrap(PATHS[name](color, strokeWidth), size));
}

// ─── 사진 위 스크림 (아래로 갈수록 짙어지는 그라디언트) ───────────
// 단색 반투명 오버레이보다 사진이 훨씬 덜 탁해진다.
export function scrimUri(color: string, topOpacity = 0, bottomOpacity = 0.78): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none">` +
      `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0%" stop-color="${color}" stop-opacity="${topOpacity}"/>` +
      `<stop offset="45%" stop-color="${color}" stop-opacity="${(topOpacity + bottomOpacity) * 0.32}"/>` +
      `<stop offset="100%" stop-color="${color}" stop-opacity="${bottomOpacity}"/>` +
      `</linearGradient></defs><rect width="100" height="100" fill="url(#s)"/></svg>`
  );
}

// ─── 종이 그레인 (편집/페이퍼 계열 테마용) ────────────────────────
export function grainUri(opacity = 0.05): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">` +
      `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>` +
      `<feColorMatrix type="saturate" values="0"/></filter>` +
      `<rect width="160" height="160" filter="url(#n)" opacity="${opacity}"/></svg>`
  );
}

// ─── 헤더 장식 ────────────────────────────────────────────────────
/** 큰 원호 — gradient-band, floating-card 계열 헤더의 여백을 잡아준다 */
export function arcUri(color: string, opacity = 0.14): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">` +
      `<circle cx="168" cy="26" r="70" fill="none" stroke="${color}" stroke-width="16" opacity="${opacity}"/>` +
      `<circle cx="168" cy="26" r="104" fill="none" stroke="${color}" stroke-width="10" opacity="${opacity * 0.6}"/></svg>`
  );
}

/** 도트 그리드 — 에디토리얼/미니멀 계열 */
export function dotGridUri(color: string, opacity = 0.5, gap = 12): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap * 6}" height="${gap * 6}">` +
      `<defs><pattern id="p" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">` +
      `<circle cx="1.4" cy="1.4" r="1.4" fill="${color}" opacity="${opacity}"/></pattern></defs>` +
      `<rect width="100%" height="100%" fill="url(#p)"/></svg>`
  );
}

/** 사선 스트라이프 — 팝/스티커 계열 */
export function stripeUri(color: string, opacity = 0.16, gap = 10): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap * 4}" height="${gap * 4}">` +
      `<defs><pattern id="p" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
      `<rect width="${gap / 2}" height="${gap}" fill="${color}" opacity="${opacity}"/></pattern></defs>` +
      `<rect width="100%" height="100%" fill="url(#p)"/></svg>`
  );
}

/** 가로 괘선 — 페이퍼/노트 계열 */
export function ruledUri(color: string, opacity = 0.5, gap = 22): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap * 4}" height="${gap * 4}">` +
      `<defs><pattern id="p" width="${gap * 4}" height="${gap}" patternUnits="userSpaceOnUse">` +
      `<line x1="0" y1="${gap - 0.5}" x2="${gap * 4}" y2="${gap - 0.5}" stroke="${color}" stroke-width="1" opacity="${opacity}"/></pattern></defs>` +
      `<rect width="100%" height="100%" fill="url(#p)"/></svg>`
  );
}

// ─── 움직이는 축하 반짝임 (SMIL — img 태그 안에서도 재생된다) ─────
export function sparkleBurstUri(color: string, accent: string): string {
  const star = (cx: number, cy: number, r: number, c: string, delay: number) =>
    `<g transform="translate(${cx} ${cy})" opacity="0">` +
      `<path d="M0 ${-r}L${r * 0.28} ${-r * 0.28}L${r} 0L${r * 0.28} ${r * 0.28}L0 ${r}L${-r * 0.28} ${r * 0.28}L${-r} 0L${-r * 0.28} ${-r * 0.28}Z" fill="${c}"/>` +
      `<animateTransform attributeName="transform" type="scale" additive="sum" values="0.4;1.15;0.4" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>` +
    `</g>`;
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">` +
      star(48, 52, 13, color, 0) +
      star(150, 44, 10, accent, 0.5) +
      star(168, 128, 8, color, 1.0) +
      star(34, 140, 11, accent, 1.5) +
      star(100, 30, 7, color, 0.8) +
      star(96, 172, 9, accent, 1.9) +
      `</svg>`
  );
}

/** 진행 링 — 애니메이션 없는 정확한 원호 (border 회전 트릭보다 훨씬 깔끔) */
export function ringUri(track: string, fill: string, pct: number, stroke = 3.6): string {
  const r = 12;
  const cflen = 2 * Math.PI * r;
  const dash = (cflen * pct).toFixed(2);
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">` +
      `<circle cx="16" cy="16" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>` +
      `<circle cx="16" cy="16" r="${r}" fill="none" stroke="${fill}" stroke-width="${stroke}" stroke-linecap="round" ` +
      `stroke-dasharray="${dash} ${(cflen - Number(dash)).toFixed(2)}" transform="rotate(-90 16 16)"/></svg>`
  );
}

/** 파형 — 발음/듣기 활동 표시용 */
export function waveUri(color: string, bars = 22): string {
  const H = [6, 12, 20, 30, 22, 14, 26, 34, 18, 10, 24, 32, 16, 8, 20, 28, 12, 22, 30, 14, 8, 18];
  const w = 3;
  const gap = 2;
  const cells = Array.from({ length: bars }, (_, i) => {
    const h = H[i % H.length];
    const x = i * (w + gap);
    return `<rect x="${x}" y="${(40 - h) / 2}" width="${w}" height="${h}" rx="1.5" fill="${color}" opacity="${i < bars * 0.45 ? 1 : 0.32}"/>`;
  }).join('');
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bars * (w + gap)} 40" width="${bars * (w + gap)}" height="40">${cells}</svg>`
  );
}

// ─── 완료 화면 마크 ───────────────────────────────────────────────
// 모든 테마가 같은 캐릭터 하나를 쓰면 완료 화면이 전부 같아 보인다.
// 테마 성격에 맞는 벡터 모티프를 따로 그린다(캐릭터 일러스트·실사 사진과 섞어 쓴다).
export type MarkKind = 'check-circle' | 'seed' | 'star-burst' | 'trophy' | 'rosette' | 'medal' | 'arc-rings' | 'grid-tick';

export function markUri(kind: MarkKind, color: string, accent: string, size = 120): string {
  const w = (inner: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none">${inner}</svg>`;
  switch (kind) {
    case 'check-circle':
      return uri(w(
        `<circle cx="50" cy="50" r="38" fill="${color}"/>` +
        `<path d="M33 51l12 12 23-25" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`
      ));
    case 'seed':
      return uri(w(
        `<path d="M50 84V44" stroke="${color}" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M50 46C50 30 62 18 78 18c0 16-12 28-28 28z" fill="${color}"/>` +
        `<path d="M50 56C50 44 40 34 26 34c0 12 10 22 24 22z" fill="${accent}"/>`
      ));
    case 'star-burst':
      return uri(w(
        `<path d="M50 12l9 26 26 9-26 9-9 26-9-26-26-9 26-9z" fill="${color}"/>` +
        `<path d="M22 20l3.5 9.5L35 33l-9.5 3.5L22 46l-3.5-9.5L9 33l9.5-3.5z" fill="${accent}"/>` +
        `<path d="M80 62l2.8 7.6L90 72l-7.2 2.4L80 82l-2.8-7.6L70 72l7.2-2.4z" fill="${accent}"/>`
      ));
    case 'trophy':
      return uri(w(
        `<path d="M30 18h40v22a20 20 0 0 1-40 0z" fill="${color}"/>` +
        `<path d="M30 24H18v6a14 14 0 0 0 14 14M70 24h12v6a14 14 0 0 1-14 14" stroke="${color}" stroke-width="6" stroke-linecap="round"/>` +
        `<path d="M50 60v14M36 84h28" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`
      ));
    case 'rosette':
      return uri(w(
        `<circle cx="50" cy="42" r="26" fill="${color}"/>` +
        `<circle cx="50" cy="42" r="12" fill="${accent}"/>` +
        `<path d="M36 64L28 90l14-8 14 8-8-26z" fill="${color}"/>`
      ));
    case 'medal':
      return uri(w(
        `<path d="M34 12l10 30M66 12L56 42" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>` +
        `<circle cx="50" cy="62" r="26" fill="${color}"/>` +
        `<path d="M50 50l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L50 73.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z" fill="${accent}"/>`
      ));
    case 'arc-rings':
      return uri(w(
        `<circle cx="50" cy="50" r="36" stroke="${color}" stroke-width="7" opacity="0.28"/>` +
        `<path d="M50 14a36 36 0 0 1 30 55" stroke="${color}" stroke-width="7" stroke-linecap="round"/>` +
        `<circle cx="50" cy="50" r="16" fill="${accent}"/>`
      ));
    case 'grid-tick':
    default: {
      const dots = [];
      for (let r = 0; r < 3; r++) for (let cI = 0; cI < 3; cI++) {
        const on = r * 3 + cI < 6;
        dots.push(`<rect x="${20 + cI * 22}" y="${20 + r * 22}" width="14" height="14" rx="2" fill="${on ? color : accent}" opacity="${on ? 1 : 0.35}"/>`);
      }
      return uri(w(dots.join('')));
    }
  }
}

// ─── 완료 폭죽 ────────────────────────────────────────────────────
// 게임 연출처럼 "아래에서 심지가 솟아 → 섬광 → 사방으로 터지고 → 중력으로 처지며 사라진다".
// SMIL 이라 라이브러리 없이 Image 안에서 그대로 재생된다.
//
// ⚠️ viewBox 를 실제 표시 비율과 맞춘다. 100x100 정사각 viewBox 를 가로로 긴 박스에
//    slice 로 늘리면 입자가 가느다란 획으로 찌그러져 폭죽으로 안 보인다.
type Burst =
  | 'peony' | 'ring' | 'palm' | 'willow' | 'chrysanthemum'
  | 'crossette' | 'spiral' | 'comet' | 'glitter' | 'double';

const BURSTS: Burst[] = ['peony', 'ring', 'palm', 'willow', 'chrysanthemum', 'crossette', 'spiral', 'comet', 'glitter', 'double'];

/**
 * @param variant 0~19 — 터지는 형태·개수·타이밍·중력이 전부 달라진다
 * @param a,b,c   불꽃 색 3종
 * @param power   0.6(절제) ~ 1.0(요란)
 * @param W,H     표시 영역 크기. viewBox 를 여기에 맞춰 왜곡을 없앤다.
 */
export function fireworkUri(variant: number, a: string, b: string, c: string, power = 1, W = 390, H = 360): string {
  const V = ((variant % 20) + 20) % 20;
  const style = BURSTS[V % 10];
  const big = V >= 10;
  const D = 2.8 + (V % 5) * 0.22;

  const shells = [
    { x: W * (0.24 + (V % 5) * 0.03), y: H * (0.30 + (V % 3) * 0.06), t: 0, col: a, k: 1 },
    { x: W * (0.74 - (V % 4) * 0.04), y: H * (0.22 + (V % 4) * 0.05), t: D * 0.34, col: b, k: 0.82 },
    { x: W * (0.5 + ((V % 2) ? 0.1 : -0.12)), y: H * (0.42 + (V % 3) * 0.04), t: D * 0.66, col: c, k: 0.68 },
  ].slice(0, power < 0.75 ? 2 : 3);

  const out: string[] = [];

  for (const sh of shells) {
    const R = (big ? 86 : 70) * sh.k * (0.75 + power * 0.35);
    const n = (big ? 22 : 15) + (style === 'ring' ? 6 : 0) - (style === 'palm' ? 4 : 0);
    const bg = `${sh.t.toFixed(2)}s`;
    const g = style === 'willow' ? 58 : style === 'palm' ? 40 : style === 'glitter' ? 34 : 20; // 중력 처짐

    // ── 발사 심지: 밝은 헤드 + 꼬리
    out.push(
      `<g opacity="0">` +
        `<rect x="${(sh.x - 1.4).toFixed(1)}" y="0" width="2.8" height="26" rx="1.4" fill="${sh.col}" opacity="0.5"/>` +
        `<circle cx="${sh.x.toFixed(1)}" cy="26" r="3.2" fill="${sh.col}"/>` +
        `<animateTransform attributeName="transform" type="translate" values="0,${H};0,${H};0,${sh.y.toFixed(0)};0,${sh.y.toFixed(0)}" keyTimes="0;0.02;0.21;1" dur="${D}s" begin="${bg}" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.15 0.7 0.4 1;0 0 1 1"/>` +
        `<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.19;0.22;1" dur="${D}s" begin="${bg}" repeatCount="indefinite"/>` +
      `</g>`
    );

    // ── 터질 때 섬광
    out.push(
      `<circle cx="${sh.x.toFixed(1)}" cy="${sh.y.toFixed(1)}" r="1" fill="${sh.col}" opacity="0">` +
        `<animate attributeName="r" values="1;1;${(R * 0.42).toFixed(0)};${(R * 0.62).toFixed(0)}" keyTimes="0;0.21;0.27;0.34" dur="${D}s" begin="${bg}" repeatCount="indefinite" fill="freeze"/>` +
        `<animate attributeName="opacity" values="0;0;0.85;0;0" keyTimes="0;0.21;0.235;0.34;1" dur="${D}s" begin="${bg}" repeatCount="indefinite"/>` +
      `</circle>`
    );

    // ── 파편
    for (let j = 0; j < n; j++) {
      const ang = (j / n) * Math.PI * 2 + V * 0.19 + (style === 'spiral' ? j * 0.12 : 0);
      let rad = R;
      if (style === 'peony' || style === 'chrysanthemum') rad = R * (0.68 + ((j * 53) % 100) / 300);
      if (style === 'double') rad = j % 2 ? R : R * 0.55;
      if (style === 'palm') rad = R * (j % 3 === 0 ? 1 : 0.55);
      if (style === 'comet') rad = R * (0.8 + ((j * 29) % 100) / 400);

      const dx = Math.cos(ang) * rad;
      const dy = Math.sin(ang) * rad * (style === 'palm' ? 0.75 : 1);
      const col = style === 'double' ? (j % 2 ? sh.col : c) : style === 'crossette' && j % 3 === 0 ? b : sh.col;
      const sz = (style === 'chrysanthemum' ? 2.6 : style === 'glitter' ? 1.8 : 2.2) * (big ? 1.15 : 1);

      let shape = `<circle r="${sz.toFixed(1)}" fill="${col}"/>`;
      if (style === 'comet') shape = `<ellipse rx="${(sz * 2.4).toFixed(1)}" ry="${sz.toFixed(1)}" fill="${col}" transform="rotate(${((ang * 180) / Math.PI).toFixed(0)})"/>`;
      if (style === 'crossette') shape = `<rect x="-${sz.toFixed(1)}" y="-${sz.toFixed(1)}" width="${(sz * 2).toFixed(1)}" height="${(sz * 2).toFixed(1)}" rx="0.6" fill="${col}"/>`;

      // 3단계: 빠르게 튀어나가고 → 느려지고 → 중력으로 처지며 사라진다
      const vals =
        `${sh.x.toFixed(0)},${sh.y.toFixed(0)};` +
        `${sh.x.toFixed(0)},${sh.y.toFixed(0)};` +
        `${(sh.x + dx * 0.62).toFixed(0)},${(sh.y + dy * 0.62).toFixed(0)};` +
        `${(sh.x + dx).toFixed(0)},${(sh.y + dy + g * 0.35).toFixed(0)};` +
        `${(sh.x + dx * 1.06).toFixed(0)},${(sh.y + dy + g).toFixed(0)}`;

      out.push(
        `<g opacity="0">` +
          shape +
          `<animateTransform attributeName="transform" type="translate" values="${vals}" keyTimes="0;0.21;0.34;0.58;0.86" dur="${D}s" begin="${bg}" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.1 0.8 0.3 1;0.4 0 0.7 1;0.5 0 1 1"/>` +
          `<animate attributeName="opacity" values="0;0;1;${(0.85 * power).toFixed(2)};0;0" keyTimes="0;0.21;0.26;0.62;0.86;1" dur="${D}s" begin="${bg}" repeatCount="indefinite"/>` +
        `</g>`
      );

      // 반짝이 잔상 — 일부 스타일만
      if ((style === 'glitter' || style === 'chrysanthemum' || style === 'willow') && j % 2 === 0) {
        out.push(
          `<g opacity="0">` +
            `<circle r="${(sz * 0.6).toFixed(1)}" fill="${b}"/>` +
            `<animateTransform attributeName="transform" type="translate" values="${vals}" keyTimes="0;0.24;0.37;0.61;0.9" dur="${D}s" begin="${bg}" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.1 0.8 0.3 1;0.4 0 0.7 1;0.5 0 1 1"/>` +
            `<animate attributeName="opacity" values="0;0;0.9;0;0.7;0" keyTimes="0;0.26;0.34;0.5;0.66;0.9" dur="${D}s" begin="${bg}" repeatCount="indefinite"/>` +
          `</g>`
        );
      }
    }
  }

  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${out.join('')}</svg>`);
}
