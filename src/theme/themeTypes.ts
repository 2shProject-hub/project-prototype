import { svgDataUri } from './graphics';
import { fontStack, snapWeight } from './fonts';

// 테마 타입 — 색 + 서체 + 형태.
// 형태 어휘는 "레퍼런스가 요구하는 것"만 담는다. 조합 가짓수를 늘리려고 만든 값은 없다.

export type HeaderStyle = 'editorial' | 'rule' | 'photo' | 'band' | 'compact' | 'stacked';
export type ListStyle = 'rule' | 'card' | 'inset' | 'outline' | 'block';
export type ButtonStyle = 'pill' | 'rect' | 'outline' | 'text' | 'block';
export type ProgressStyle = 'bar' | 'rule' | 'count' | 'dots' | 'none';
export type PhotoStyle = 'square' | 'rounded' | 'circle' | 'wide';
export type Density = 'tight' | 'normal' | 'open';
export type ShadowStyle = 'none' | 'hair' | 'soft';

/**
 * 화면 구조 — 테마를 가르는 가장 큰 축.
 * 색과 모서리만 바꾸면 20종이 결국 같은 화면으로 보인다. 구조가 달라야 다른 앱처럼 보인다.
 *  focus-list : 지금 학습 중인 단어 하나를 크게 세우고 나머지는 목록으로 (듀오링고·엘사)
 *  plain-list : 초점 없이 균일한 목록. 정보를 있는 그대로 (앙키·코세라·칸)
 *  grid       : 2열 격자 카드 (퀴즐렛·멤라이즈)
 *  tabs-list  : 상단 분류 탭 + 목록 (부수·링고디어·케이크)
 *  hero-list  : 상단 큰 실사 사진 + 목록 (로제타·유데미)
 *  stat-list  : 상단 숫자 통계 블록 + 목록 (산타·브릴리언트)
 */
export type Structure = 'focus-list' | 'plain-list' | 'grid' | 'tabs-list' | 'hero-list' | 'stat-list';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  ink: string;
  textSecondary: string;
  muted: string;
  line: string;
  surface: string;
  canvas: string;
  backdrop: string;
  onPrimary: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
}

export interface ThemeType {
  display: string;
  body: string;
  displayWeight: number;
  bodyWeight: number;
  displaySize: number;
  bodySize: number;
  displayTracking: number;
  displayLine: number;
  bodyLine: number;
  labelTracking: number;
  labelCase: 'normal' | 'upper';
}

export interface ThemeLayout {
  structure: Structure;
  header: HeaderStyle;
  list: ListStyle;
  button: ButtonStyle;
  progress: ProgressStyle;
  photo: PhotoStyle;
  density: Density;
  radius: number;
  hairline: number;
  shadow: ShadowStyle;
  edge: number;
}

export interface Theme {
  id: string;
  name: string;
  nameEn: string;
  reference: string;
  idea: string;
  colors: ThemeColors;
  type: ThemeType;
  layout: ThemeLayout;
  photo: { heroTags: string; lock: number };
  avoid: string;
  rationale: string;
}

// ─── 서체 ─────────────────────────────────────────────────────────
/** 테마의 서체를 RN 스타일 조각으로 — 굵기는 그 서체가 실제로 가진 값으로 스냅한다 */
export function displayFont(t: Theme) {
  return { fontFamily: fontStack(t.type.display), fontWeight: String(snapWeight(t.type.display, t.type.displayWeight)) as any };
}
export function bodyFont(t: Theme, weight?: number) {
  const w = weight ?? t.type.bodyWeight;
  return { fontFamily: fontStack(t.type.body), fontWeight: String(snapWeight(t.type.body, w)) as any };
}

// ─── 실사 사진 ────────────────────────────────────────────────────
export function photoUrl(tags: string, w: number, h: number, lock: number): string {
  const t = encodeURI(String(tags).replace(/\s+/g, ''));
  return `https://loremflickr.com/${Math.round(w)}/${Math.round(h)}/${t}?lock=${lock}`;
}

/**
 * 표시 영역보다 세로로 1.5배 긴 원본을 받아 cover 로 위·아래를 잘라 낸다.
 * loremflickr 는 사진 위 가장자리에 라이선스 배지("cc-nc-sa"), 아래 가장자리에
 * 출처 문구("KOREA.NET - Official page…")를 구워서 내려준다. 그대로 쓰면 시안에 글자 쓰레기가 남는다.
 */
export function coverPhoto(tags: string, dispW: number, dispH: number, lock: number): string {
  const w = Math.max(140, Math.round(dispW * 2));
  const h = Math.min(1400, Math.round(w * (dispH / dispW) * 1.5));
  return photoUrl(tags, w, h, lock);
}

export function heroPhoto(theme: Theme, w = 640, h = 360): string {
  return coverPhoto(theme.photo.heroTags, w, h, theme.photo.lock);
}

// ─── 그라디언트 (밴드 헤더 전용. 장식용 그라디언트는 쓰지 않는다) ───
export function gradientUri(from: string, to: string, angle: number): string {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = (50 + Math.cos(rad + Math.PI) * 50).toFixed(2);
  const y1 = (50 + Math.sin(rad + Math.PI) * 50).toFixed(2);
  const x2 = (50 + Math.cos(rad) * 50).toFixed(2);
  const y2 = (50 + Math.sin(rad) * 50).toFixed(2);
  return svgDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'>` +
      `<defs><linearGradient id='g' x1='${x1}%' y1='${y1}%' x2='${x2}%' y2='${y2}%'>` +
      `<stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/>` +
      `</linearGradient></defs><rect width='100' height='100' fill='url(#g)'/></svg>`
  );
}

// ─── 파생 토큰 ────────────────────────────────────────────────────
export function shadowFor(style: ShadowStyle, tint: string) {
  switch (style) {
    case 'hair':
      return { shadowColor: tint, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 };
    case 'soft':
      return { shadowColor: tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 14, elevation: 3 };
    default:
      return {};
  }
}

export function spacing(d: Density) {
  return d === 'open' ? { gap: 14, row: 16, block: 26 } : d === 'tight' ? { gap: 6, row: 9, block: 14 } : { gap: 10, row: 12, block: 20 };
}

export function buttonRadius(style: ButtonStyle, radius: number): number {
  if (style === 'pill') return 999;
  if (style === 'text') return 0;
  return radius;
}

export function photoRadius(style: PhotoStyle, size: number, radius: number): number {
  if (style === 'circle') return size / 2;
  if (style === 'square') return 0;
  if (style === 'wide') return Math.min(radius, 10);
  return Math.min(radius, Math.round(size * 0.3));
}

// ─── 대비 ─────────────────────────────────────────────────────────
export function luminance(hex: string): number {
  const h = String(hex).replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function readableOn(bg: string, candidates: string[]): string {
  let best = candidates[0];
  let bestC = 0;
  for (const c of candidates) {
    const ct = contrast(bg, c);
    if (ct > bestC) {
      bestC = ct;
      best = c;
    }
  }
  return best;
}
