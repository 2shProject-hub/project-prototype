// 테마별 한글 웹폰트 로더 (웹 전용).
// 서체를 테마의 일부로 두는 이유: 색만 바꾸고 시스템 폰트 하나로 전부 처리하면
// 어떤 팔레트를 써도 같은 화면으로 보인다. 서체가 바뀌어야 "다른 디자인"이 된다.

/** 서체별 실제 제공 굵기 (Google Fonts 실측 확인) */
export const FONT_WEIGHTS: Record<string, number[]> = {
  Pretendard: [300, 400, 500, 600, 700, 800, 900],
  'Noto Sans KR': [300, 400, 500, 700, 900],
  'Noto Serif KR': [300, 400, 600, 700, 900],
  'Nanum Myeongjo': [400, 700, 800],
  'Gothic A1': [300, 400, 500, 700, 900],
  'IBM Plex Sans KR': [300, 400, 500, 700],
  'Song Myung': [400],
  'Gowun Dodum': [400],
  'Gowun Batang': [400, 700],
  Hahmlet: [300, 400, 600, 700, 900],
  'Nanum Gothic': [400, 700, 800],
  'Nanum Gothic Coding': [400, 700],
  'Black Han Sans': [400],
  'Do Hyeon': [400],
  Jua: [400],
  Gaegu: [300, 400, 700],
  'Nanum Pen Script': [400],
  'Poor Story': [400],
};

/** 서체 성격에 맞는 CSS 폴백 스택 */
const FALLBACK: Record<string, string> = {
  'Noto Serif KR': 'serif',
  'Nanum Myeongjo': 'serif',
  'Song Myung': 'serif',
  'Gowun Batang': 'serif',
  Hahmlet: 'serif',
  'Nanum Gothic Coding': 'ui-monospace, monospace',
  Gaegu: 'cursive',
  'Nanum Pen Script': 'cursive',
  'Poor Story': 'cursive',
};

export const FONT_LIST = Object.keys(FONT_WEIGHTS);

/** 요청한 굵기를 그 서체가 실제로 가진 굵기 중 가장 가까운 값으로 맞춘다 */
export function snapWeight(family: string, weight: number): number {
  const avail = FONT_WEIGHTS[family];
  if (!avail || !avail.length) return weight;
  return avail.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), avail[0]);
}

/** RN/RNW 의 fontFamily 에 넣을 스택 문자열 */
export function fontStack(family: string): string {
  const fb = FALLBACK[family] ?? 'system-ui, sans-serif';
  return `"${family}", ${fb}`;
}

let loaded = false;

/** 웹에서 한 번만 호출 — 필요한 서체 전부를 <link> 로 주입한다 */
export function loadThemeFonts(families: string[] = FONT_LIST): void {
  if (loaded) return;
  if (typeof document === 'undefined') return;
  loaded = true;

  // Pretendard 는 Google Fonts 에 없어 jsDelivr 사용
  if (families.includes('Pretendard')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css';
    document.head.appendChild(l);
  }

  // preconnect 로 첫 렌더 지연을 줄인다
  for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    const pc = document.createElement('link');
    pc.rel = 'preconnect';
    pc.href = href;
    if (href.includes('gstatic')) pc.crossOrigin = 'anonymous';
    document.head.appendChild(pc);
  }

  // ⚠️ 한 링크에 여러 family 를 묶으면 그 중 하나라도 제공하지 않는 굵기가 있을 때
  //    요청 전체가 400 으로 실패한다. 서체마다 따로 요청한다.
  for (const f of families) {
    if (f === 'Pretendard') continue;
    const weights = FONT_WEIGHTS[f];
    if (!weights) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}` +
      `:wght@${weights.join(';')}&display=swap`;
    document.head.appendChild(link);
  }
}
