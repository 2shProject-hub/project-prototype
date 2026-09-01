// 기존 59개+ 화면에 테마를 입힌다 (웹 전용).
//
// 화면들은 전부 src/theme/colors.ts 의 고정 팔레트를 import 해서 StyleSheet.create 로
// 모듈 로드 시점에 스타일을 굳힌다. 그래서 colors 객체를 런타임에 바꿔도 이미 만들어진
// 스타일에는 반영되지 않는다. 화면 59개를 하나씩 고치면 반영되지만, 그건 테마를 고른 뒤에
// 할 일이지 "어떤 테마가 좋은지 보는" 단계에서 할 일이 아니다.
//
// 그래서 여기서는 react-native-web 이 만들어 둔 CSS 규칙을 훑어서,
// 기본 팔레트 색이 쓰인 규칙만 골라 테마 색으로 바꾼 오버라이드를 주입한다.
// 오버라이드는 [data-themed="on"] 안쪽으로만 적용되므로 뷰어 UI(좌측 패널·갤러리)는 그대로다.
//
// ⚠️ 한계 — 색과 본문 서체만 바뀐다. 모서리·여백·그림자 같은 형태 토큰은 그대로다.
//    형태까지 바꾸려면 화면 컴포넌트가 테마를 직접 읽어야 한다(테마 확정 후 작업).
import type { Theme } from './themeTypes';
import { fontStack } from './fonts';

const STYLE_ID = 'kchao-theme-override';

/** 기본 팔레트 → 테마 토큰. 순수 흰색(#ffffff)은 건드리지 않는다 — 버튼 위 흰 글자가 깨진다. */
function buildMap(t: Theme): Array<[string, string]> {
  const c = t.colors;
  // colors.ts 토큰만이 아니라, 화면들이 직접 박아 둔 hex 도 전부 매핑한다.
  // (src/screens 전체를 grep 해 2회 이상 등장하는 색을 계열별로 분류했다. 순수 흰색은 제외 —
  //  버튼 위 흰 글자·흰 카드가 한꺼번에 바뀌면 화면이 깨진다.)
  const teal = ['#00a8a6'];
  const tealDark = ['#008e8d', '#005e5d'];
  const tealSoft = ['#ddfbfa', '#f0fafa', '#e2f4f4', '#f0fcfc', '#e6f7f6', '#e6f8f7', '#f0fbfb', '#c8f0ef', '#bfe8e6', '#b2ebe8', '#c8eae8', '#fafffe', '#fafeff'];
  const inks = ['#04303d', '#111827', '#111111', '#1a2b3c', '#1a2233', '#1b2427'];
  const seconds = ['#3d4b57', '#334155', '#475569'];
  const muteds = ['#61727a', '#64748b', '#6b7280', '#9ca3af', '#a0aeb8', '#a0acb8'];
  const lines = ['#dce5e7', '#e0e4e8', '#b8c7cb', '#b0c8c8', '#b9c1c8', '#c8d0d8', '#cbd5e1', '#d0d8e0', '#d9d9d9', '#e5e7eb', '#e2e8f0', '#e2eaec'];
  const canvases = ['#f5f8f8', '#f8fafc', '#fafcfd', '#fafafa', '#f5f5f5', '#fafbfb', '#fcfcfc'];
  const backs = ['#eef3f3', '#f0f4f8', '#f1f5f9', '#f3f4f6', '#f0f3f5', '#f0f2f4', '#eff3f5', '#eef2f3', '#e8e8f0'];
  const warns = ['#ffb33c', '#f59e0b', '#f97316', '#92400e', '#78350f'];
  const warnSofts = ['#fff7eb', '#fffbeb', '#fef3c7', '#fde68a'];
  const dangers = ['#ef5e62', '#ef4444', '#c0392b'];
  const dangerSofts = ['#fdeeed', '#fef2f2', '#fdebeb'];
  const oks = ['#249b5b', '#22c55e', '#1c7a4d'];
  const okSofts = ['#e8f7ee', '#ecfdf5', '#a7f3d0', '#f0faf5'];

  const out: Array<[string, string]> = [];
  const push = (arr: string[], to: string) => arr.forEach((h) => out.push([h, to]));
  push(teal, c.primary);
  push(tealDark, c.primaryDark);
  push(tealSoft, c.primarySoft);
  push(inks, c.ink);
  push(seconds, c.textSecondary);
  push(muteds, c.muted);
  push(lines, c.line);
  push(canvases, c.canvas);
  push(backs, c.backdrop);
  push(warns, c.warning);
  push(warnSofts, c.warningSoft);
  push(dangers, c.danger);
  push(dangerSofts, c.dangerSoft);
  push(oks, c.success);
  push(okSofts, c.successSoft);
  return out;
}

const hexToRgbTriplet = (hex: string) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/** 같은 색이 rgb()/rgba()/hex 여러 표기로 나타나므로 전부 잡는다 */
function patternsFor(hex: string): string[] {
  const [r, g, b] = hexToRgbTriplet(hex);
  return [
    `rgba(${r}, ${g}, ${b}, 1)`,
    `rgb(${r}, ${g}, ${b})`,
    `rgba(${r},${g},${b},1)`,
    `rgb(${r},${g},${b})`,
    hex.toLowerCase(),
  ];
}

function withImportant(cssText: string): string {
  return cssText
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (d.includes('!important') ? d : `${d} !important`))
    .join('; ');
}

/**
 * 선언 단위 변환 — 색 치환에 더해 형태도 테마를 따르게 한다.
 *  · border-radius 계열: 기본 스케일(4~28px)을 테마 radius 비율로 스케일. pill(999)은 유지하되
 *    radius 0 테마(각진 디자인)에서는 2px 로 눌러 사각 형태로.
 *  · box-shadow: 그림자를 쓰지 않는 테마에서는 제거.
 * @returns 변환된 cssText. 아무것도 안 바뀌면 null.
 */
function transformDeclarations(cssText: string, replacements: Array<[string, string]>, theme: Theme): string | null {
  const r = theme.layout.radius;
  const factor = r / 12; // 기본 스케일의 중심값 lg=12 를 기준으로
  let changed = false;

  const decls = cssText.split(';').map((d) => d.trim()).filter(Boolean).map((decl) => {
    const colon = decl.indexOf(':');
    if (colon < 0) return decl;
    const prop = decl.slice(0, colon).trim().toLowerCase();
    let val = decl.slice(colon + 1);

    // 색 치환 (모든 속성)
    for (const [from, to] of replacements) {
      if (val.includes(from)) {
        val = val.split(from).join(to);
        changed = true;
      }
    }

    // 모서리 — 테마의 radius 를 따른다
    if (prop.includes('radius')) {
      const next = val.replace(/(\d+(?:\.\d+)?)px/g, (_m, n) => {
        const v = parseFloat(n);
        if (v === 0) return '0px';
        if (v >= 999) return r === 0 ? '2px' : `${Math.max(999, v)}px`;
        const mapped = r === 0 ? 0 : Math.max(2, Math.min(34, Math.round(v * factor)));
        return `${mapped}px`;
      });
      if (next !== val) { val = next; changed = true; }
    }

    // 그림자 — 안 쓰는 테마에서는 지운다
    if (prop === 'box-shadow' && theme.layout.shadow === 'none' && val.trim() !== 'none') {
      val = ' none';
      changed = true;
    }

    return `${decl.slice(0, colon)}:${val}`;
  });

  return changed ? decls.join('; ') : null;
}

/**
 * 테마를 DOM 에 적용한다.
 * @param theme 적용할 테마. null 이면 오버라이드를 제거한다(원래 색으로 복귀).
 */
export function applyThemeToDom(theme: Theme | null): void {
  if (typeof document === 'undefined') return;

  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!theme) {
    if (tag) tag.textContent = '';
    restoreInlineStyles();
    return;
  }
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_ID;
    document.head.appendChild(tag);
  }

  const map = buildMap(theme);
  // 색 문자열 → 바꿀 색. 표기 변형을 모두 키로 넣어 한 번에 치환한다.
  const replacements: Array<[string, string]> = [];
  for (const [from, to] of map) {
    for (const p of patternsFor(from)) replacements.push([p, to]);
  }

  const out: string[] = [];
  const seen = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    // 우리가 만든 오버라이드 시트는 건너뛴다
    if ((sheet.ownerNode as HTMLElement | null)?.id === STYLE_ID) continue;
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // 교차 출처 시트(구글 폰트 등)는 읽을 수 없다
    }
    for (const rule of Array.from(rules)) {
      const r = rule as CSSStyleRule;
      if (!r.selectorText || !r.style || !r.style.cssText) continue;
      const css = transformDeclarations(r.style.cssText, replacements, theme);
      if (css === null) continue;
      const key = r.selectorText + '|' + css;
      if (seen.has(key)) continue;
      seen.add(key);
      // 뷰어 UI 는 건드리지 않도록 테마 영역 안쪽으로만 스코프를 건다
      // data-native-theme 서브트리는 이미 테마 값으로 그려진 곳 — 또 변환하면 이중 적용이라 제외
      const scoped = r.selectorText
        .split(',')
        .map((sel) => `[data-themed="on"] ${sel.trim()}:not([data-native-theme]):not([data-native-theme] *)`)
        .join(', ');
      out.push(`${scoped}{${withImportant(css)}}`);
    }
  }

  // 본문 서체도 함께 바꾼다. 색만 바뀌면 같은 화면으로 보인다.
  // native-theme 영역은 컴포넌트가 display/body 서체를 직접 고른다 — 블랭킷 룰로 덮으면 안 된다
  out.push(`[data-themed="on"], [data-themed="on"] *:not([data-native-theme]):not([data-native-theme] *) { font-family: ${fontStack(theme.type.body)} !important; }`);
  // 지면색은 컨테이너에 직접
  out.push(`[data-themed="on"] { background-color: ${theme.colors.canvas} !important; }`);

  tag.textContent = out.join('\n');

  // react-native-web 은 동적 값을 인라인 style 로 내보낸다. 스타일시트에 없어서 위에서는 못 잡는다.
  patchInlineStyles(replacements, theme);
}

const ORIG_ATTR = 'data-kchao-orig-style';

/** 인라인 style 에 박힌 기본 팔레트 색을 테마 색으로 바꾼다 (되돌리기 위해 원본 보관) */
function patchInlineStyles(replacements: Array<[string, string]>, theme: Theme): void {
  document.querySelectorAll('[data-themed="on"]').forEach((root) => {
    const nodes = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
    for (const el of nodes) {
      if (el.closest && el.closest('[data-native-theme]')) continue; // 네이티브 테마 영역 제외
      const original = el.getAttribute(ORIG_ATTR) ?? el.getAttribute('style');
      if (!original) continue;
      const css = transformDeclarations(original, replacements, theme);
      if (css === null) {
        // 이전 테마에서 바꿔 뒀는데 이번 테마에서는 바꿀 게 없으면 원본으로 복구
        if (el.hasAttribute(ORIG_ATTR)) el.setAttribute('style', original);
        continue;
      }
      if (!el.hasAttribute(ORIG_ATTR)) el.setAttribute(ORIG_ATTR, original);
      el.setAttribute('style', css);
    }
  });
}

/** 인라인 style 을 원래대로 되돌린다 */
function restoreInlineStyles(): void {
  document.querySelectorAll('[' + ORIG_ATTR + ']').forEach((n) => {
    const el = n as HTMLElement;
    const orig = el.getAttribute(ORIG_ATTR);
    if (orig !== null) el.setAttribute('style', orig);
    el.removeAttribute(ORIG_ATTR);
  });
}
