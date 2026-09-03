// 말해보카 블루 — 보라 원본(malhaeboka)을 "색상만" 파랑 계열로 옮긴 자매 테마.
//
// 왜 소스의 hex 를 하나하나 고치지 않는가:
// MB 룩은 27개 파일에 흩어진 ~150개의 보라 리터럴로 그려진다(대부분 __mb 게이트 안의 인라인 스타일).
// 그걸 전부 손으로 바꾸면 원본 보라 테마가 깨질 위험이 크다. 이 레포는 원래도 일반 테마 20종을
// DOM/CSSOM 재작성(applyThemeToDom)으로 입히므로, 블루도 같은 방식 — 기기 화면 안쪽에서
// "보라 계열 색만" 파랑으로 옮기는 변환 패스 — 으로 처리한다. 원본 보라는 한 줄도 건드리지 않는다.
//
// 변환 규칙: HSL 로 바꿔 색상(hue)만 브랜드 블루(#139AFF ≈ 206°) 쪽으로 옮기고 채도·명도는 그대로 둔다.
// 그래서 대비·가독성이 원본과 동일하게 유지된다. 분홍 포인트(330~340°)·하늘색 지면(205°)·
// 국기 사진 같은 건 범위 밖이라 그대로 남는다.

export const isMb = (id?: string | null): boolean => id === 'malhaeboka' || id === 'malhaeboka-blue';
export const isMbBlue = (id?: string | null): boolean => id === 'malhaeboka-blue';

const HUE_MIN = 232;   // 남보라 시작
const HUE_MAX = 302;   // 자주 끝
const SAT_MIN = 0.05;  // 무채색(회색·검정·흰색)은 건드리지 않는다
const TARGET_HUE = 208;

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0));
  else if (max === G) h = (B - R) / d + 2;
  else h = (R - G) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = ((h % 360) + 360) % 360 / 360;
  const conv = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [conv(hk + 1 / 3), conv(hk), conv(hk - 1 / 3)].map((v) => Math.round(v * 255)) as [number, number, number];
}

/** 보라 계열이면 파랑으로 옮긴 rgb 를, 아니면 null 을 돌려준다(= 손대지 않음) */
export function blueify(r: number, g: number, b: number): [number, number, number] | null {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (s < SAT_MIN || h < HUE_MIN || h > HUE_MAX) return null;
  return hslToRgb(TARGET_HUE, s, l);
}

const hex2 = (n: number) => n.toString(16).padStart(2, '0');
export const blueifyHex = (hex: string): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (full.length !== 6) return hex;
  const out = blueify(parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16));
  return out ? `#${out.map(hex2).join('')}` : hex;
};

/** 색 표기(hex·rgb·rgba)만 옮긴다 */
function transposePlain(text: string): string {
  let out = text.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m) => blueifyHex(m));
  out = out.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,[^)]*)?\)/g, (m, r, g, b, rest) => {
    const c = blueify(+r, +g, +b);
    return c ? `rgb${rest ? 'a' : ''}(${c[0]}, ${c[1]}, ${c[2]}${rest || ''})` : m;
  });
  return out;
}

const SVG_URI = /data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g;

/**
 * 문자열(스타일 선언·SVG 마크업) 안의 보라 계열 색을 전부 파랑으로 옮긴다. 멱등이다.
 * ⚠️ 벡터 아이콘은 react-native-web 이 <img> 가 아니라 div 의 background-image 로 그린다.
 *    그래서 색이 base64 데이터 URI 안에 숨는다 — 풀어서 바꾸고 다시 싸야 잡힌다.
 */
export function transposeColors(text: string): string {
  let out = text;
  if (out.indexOf('data:image/svg+xml;base64,') >= 0) {
    out = out.replace(SVG_URI, (m, b64) => {
      try {
        const svg = atob(b64);
        const next = transposePlain(svg);
        return next === svg ? m : 'data:image/svg+xml;base64,' + btoa(next);
      } catch {
        return m;
      }
    });
  }
  return transposePlain(out);
}

const ORIG_STYLE = 'data-mbblue-style';
const ORIG_SRC = 'data:mbblue-src';

/**
 * 기기 화면 안쪽의 보라를 파랑으로 옮긴다(블루 테마일 때만).
 * 변환이 멱등이라 리렌더 뒤 다시 불러도 안전하고, 되돌릴 수 있도록 최초 원본만 보관한다.
 */
export function applyMbBlueSkin(active: boolean): void {
  if (typeof document === 'undefined') return;
  if (!active) {
    document.querySelectorAll('[' + ORIG_STYLE + ']').forEach((n) => {
      const el = n as HTMLElement;
      el.setAttribute('style', el.getAttribute(ORIG_STYLE) || '');
      el.removeAttribute(ORIG_STYLE);
    });
    document.querySelectorAll('img[data-mbblue-src]').forEach((n) => {
      const el = n as HTMLImageElement;
      el.src = el.getAttribute('data-mbblue-src') || el.src;
      el.removeAttribute('data-mbblue-src');
    });
    return;
  }

  document.querySelectorAll('[data-themed="on"]').forEach((root) => {
    const nodes = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
    for (const el of nodes) {
      const style = el.getAttribute('style');
      if (style) {
        const next = transposeColors(style);
        if (next !== style) {
          if (!el.hasAttribute(ORIG_STYLE)) el.setAttribute(ORIG_STYLE, style);
          el.setAttribute('style', next);
        }
      }
      if (el.tagName === 'IMG') {
        const img = el as HTMLImageElement;
        const src = img.getAttribute('src') || '';
        if (src.startsWith('data:image/svg+xml;base64,')) {
          const next = transposeColors(src);
          if (next !== src) {
            if (!img.hasAttribute('data-mbblue-src')) img.setAttribute('data-mbblue-src', src);
            img.src = next;
          }
        }
      }
    }
  });
}
