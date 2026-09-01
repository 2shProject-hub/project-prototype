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
  return [
    ['#00a8a6', c.primary],       // teal / info
    ['#008e8d', c.primaryDark],   // tealDark
    ['#ddfbfa', c.primarySoft],   // tealSoft / infoLight
    ['#04303d', c.ink],           // ink / textPrimary
    ['#3d4b57', c.textSecondary],
    ['#61727a', c.muted],         // muted / textMuted
    ['#a0aeb8', c.muted],         // textDisabled
    ['#dce5e7', c.line],          // line / border
    ['#e0e4e8', c.line],          // borderLight / bgDisabled
    ['#b8c7cb', c.line],          // borderDark
    ['#f5f8f8', c.canvas],
    ['#eef3f3', c.backdrop],
    ['#f0f4f8', c.backdrop],      // bgSubtle
    ['#ffb33c', c.warning],       // amber / warning
    ['#fff7eb', c.warningSoft],
    ['#ef5e62', c.danger],        // red / wrong
    ['#fdeeed', c.dangerSoft],
    ['#249b5b', c.success],       // green / correct
    ['#e8f7ee', c.successSoft],
  ];
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
      let css = r.style.cssText;
      let hit = false;
      for (const [from, to] of replacements) {
        if (css.includes(from)) {
          css = css.split(from).join(to);
          hit = true;
        }
      }
      if (!hit) continue;
      const key = r.selectorText + '|' + css;
      if (seen.has(key)) continue;
      seen.add(key);
      // 뷰어 UI 는 건드리지 않도록 테마 영역 안쪽으로만 스코프를 건다
      const scoped = r.selectorText
        .split(',')
        .map((s) => `[data-themed="on"] ${s.trim()}`)
        .join(', ');
      out.push(`${scoped}{${withImportant(css)}}`);
    }
  }

  // 본문 서체도 함께 바꾼다. 색만 바뀌면 같은 화면으로 보인다.
  out.push(`[data-themed="on"], [data-themed="on"] * { font-family: ${fontStack(theme.type.body)} !important; }`);
  // 지면색은 컨테이너에 직접
  out.push(`[data-themed="on"] { background-color: ${theme.colors.canvas} !important; }`);

  tag.textContent = out.join('\n');

  // react-native-web 은 동적 값을 인라인 style 로 내보낸다. 스타일시트에 없어서 위에서는 못 잡는다.
  patchInlineStyles(replacements);
}

const ORIG_ATTR = 'data-kchao-orig-style';

/** 인라인 style 에 박힌 기본 팔레트 색을 테마 색으로 바꾼다 (되돌리기 위해 원본 보관) */
function patchInlineStyles(replacements: Array<[string, string]>): void {
  document.querySelectorAll('[data-themed="on"]').forEach((root) => {
    const nodes = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
    for (const el of nodes) {
      const original = el.getAttribute(ORIG_ATTR) ?? el.getAttribute('style');
      if (!original) continue;
      let css = original;
      let hit = false;
      for (const [from, to] of replacements) {
        if (css.includes(from)) {
          css = css.split(from).join(to);
          hit = true;
        }
      }
      if (!hit) continue;
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
