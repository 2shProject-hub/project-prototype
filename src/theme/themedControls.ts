// 공용 컨트롤(ActivityHeader · CtaButton · ChoiceChip · QuizFeedbackModal)의 테마 스타일 계산.
//
// 이 네 컴포넌트는 수십 개 화면이 함께 쓴다. 여기서 형태(모서리·버튼꼴·색·서체)를
// 테마로 계산해 주면, 화면 코드를 건드리지 않고 형태가 전 화면으로 퍼진다.
// 각 컴포넌트는 원본 스타일 뒤에 이 결과를 덧붙이기만 한다 — enabled 가 아니면 원본 그대로.
import type { TextStyle, ViewStyle } from 'react-native';
import { type Theme, buttonRadius, bodyFont, shadowFor, readableOn } from './themeTypes';

/** 진행바 + 닫기 헤더 */
export function themedHeader(t: Theme) {
  const c = t.colors;
  const pill = t.layout.radius === 0 ? 0 : 999;
  return {
    header: { backgroundColor: c.canvas } as ViewStyle,
    track: { backgroundColor: c.line, borderRadius: pill, height: 8 } as ViewStyle,
    fill: { backgroundColor: c.primary, borderRadius: pill } as ViewStyle,
    sheen: { backgroundColor: 'rgba(255,255,255,0)' } as ViewStyle, // 광택은 테마에서 뺀다
    closeText: { color: c.muted, ...bodyFont(t, 600) } as TextStyle,
  };
}

/** 종료 확인 팝업 (Modal 은 포털이라 DOM 오버라이드가 못 닿는다 — 여기서 직접 입힌다) */
export function themedExitPopup(t: Theme) {
  const c = t.colors;
  return {
    card: { backgroundColor: c.surface, borderRadius: t.layout.radius === 0 ? 2 : Math.max(6, t.layout.radius) } as ViewStyle,
    message: { color: c.ink, ...bodyFont(t) } as TextStyle,
    btnPrimary: primaryBox(t),
    btnSecondary: {
      backgroundColor: t.layout.list === 'inset' ? c.backdrop : c.surface,
      borderWidth: Math.max(1, t.layout.hairline),
      borderColor: t.layout.button === 'block' ? c.ink : c.line,
      borderRadius: buttonRadius(t.layout.button, t.layout.radius),
      ...(t.layout.button === 'block' ? { borderBottomWidth: 3 } : null),
    } as ViewStyle,
    btnTextPrimary: { color: primaryFg(t), ...bodyFont(t, 700) } as TextStyle,
    btnTextSecondary: { color: c.textSecondary, ...bodyFont(t, 700) } as TextStyle,
  };
}

function primaryBox(t: Theme): ViewStyle {
  const c = t.colors;
  const L = t.layout;
  const r = buttonRadius(L.button, L.radius);
  switch (L.button) {
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary, borderRadius: r };
    case 'block':
      return { backgroundColor: c.primary, borderRadius: r, borderBottomWidth: 4, borderBottomColor: c.primaryDark };
    case 'text':
      return { backgroundColor: 'transparent', borderRadius: r };
    default:
      return { backgroundColor: c.primary, borderRadius: r, ...(shadowFor(L.shadow, c.primary) as ViewStyle) };
  }
}

function primaryFg(t: Theme): string {
  return t.layout.button === 'outline' || t.layout.button === 'text' ? t.colors.primaryDark : t.colors.onPrimary;
}

/** CtaButton — variant 별 테마 형태 */
export function themedCta(t: Theme, variant: 'primary' | 'secondary' | 'outline' | 'correct' | 'wrong', disabled: boolean) {
  const c = t.colors;
  const L = t.layout;
  const r = buttonRadius(L.button, L.radius);

  if (disabled) {
    return {
      box: { backgroundColor: c.line, borderRadius: r, borderWidth: 0, borderBottomWidth: 0 } as ViewStyle,
      text: { color: c.muted, ...bodyFont(t, 700) } as TextStyle,
      spinner: c.muted,
    };
  }

  let box: ViewStyle;
  let fg: string;
  switch (variant) {
    case 'primary':
      box = primaryBox(t);
      fg = primaryFg(t);
      break;
    case 'secondary':
      box = {
        backgroundColor: L.list === 'inset' ? c.backdrop : c.surface,
        borderWidth: Math.max(1, L.hairline),
        borderColor: L.button === 'block' ? c.ink : c.line,
        borderRadius: r,
        ...(L.button === 'block' ? { borderBottomWidth: 3 } : null),
      };
      fg = c.textSecondary;
      break;
    case 'outline':
      box = { backgroundColor: c.surface, borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary, borderRadius: r };
      fg = c.primaryDark;
      break;
    case 'correct':
      box = { backgroundColor: c.success, borderRadius: r, borderWidth: 0 };
      fg = readableOn(c.success, ['#ffffff', c.ink]);
      break;
    case 'wrong':
      box = { backgroundColor: c.danger, borderRadius: r, borderWidth: 0 };
      fg = readableOn(c.danger, ['#ffffff', c.ink]);
      break;
  }
  return { box, text: { color: fg, ...bodyFont(t, 700) } as TextStyle, spinner: fg };
}

/** ChoiceChip — 상태별 테마 형태 */
export function themedChip(t: Theme, state: 'default' | 'selected' | 'correct' | 'wrong') {
  const c = t.colors;
  const L = t.layout;
  const r = L.list === 'block' ? L.radius : Math.min(L.radius, 20);
  const blocky = L.list === 'block';
  const hair = blocky ? Math.max(1.5, L.hairline * 2) : Math.max(1, L.hairline);

  const map = {
    default: { border: blocky ? c.ink : c.line, bg: L.list === 'inset' ? c.backdrop : c.surface, fg: c.ink },
    selected: { border: c.primary, bg: c.primarySoft, fg: readableOn(c.primarySoft, [c.primaryDark, c.ink]) },
    correct: { border: c.success, bg: c.successSoft, fg: readableOn(c.successSoft, [c.success, c.ink]) },
    wrong: { border: c.danger, bg: c.dangerSoft, fg: readableOn(c.dangerSoft, [c.danger, c.ink]) },
  }[state];

  return {
    box: {
      borderRadius: r,
      borderWidth: hair,
      borderColor: map.border,
      backgroundColor: map.bg,
      ...(L.shadow === 'none' ? { shadowOpacity: 0, elevation: 0 } : null),
    } as ViewStyle,
    text: { color: map.fg, ...bodyFont(t, 700) } as TextStyle,
    sub: { color: c.muted, ...bodyFont(t) } as TextStyle,
    badge: {
      backgroundColor: state === 'default' ? c.backdrop : map.border,
      borderRadius: L.radius === 0 ? 2 : 999,
    } as ViewStyle,
    badgeText: {
      color: state === 'default' ? c.textSecondary : readableOn(map.border, ['#ffffff', c.ink]),
      ...bodyFont(t, 700),
    } as TextStyle,
  };
}

/** 퀴즈 정오답 피드백 시트 */
export function themedFeedback(t: Theme, correct: boolean) {
  const c = t.colors;
  const L = t.layout;
  const tone = correct ? c.success : c.danger;
  const toneSoft = correct ? c.successSoft : c.dangerSoft;
  return {
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: Math.max(8, L.radius * 1.4),
      borderTopRightRadius: Math.max(8, L.radius * 1.4),
      borderTopWidth: L.list === 'block' ? 2 : 0,
      borderTopColor: c.ink,
    } as ViewStyle,
    tone,
    toneSoft,
    title: { color: tone, ...bodyFont(t, 800) } as TextStyle,
    body: { color: c.ink, ...bodyFont(t) } as TextStyle,
    sub: { color: c.muted, ...bodyFont(t) } as TextStyle,
    button: primaryBox(t),
    buttonCorrect: { backgroundColor: tone, borderRadius: buttonRadius(L.button, L.radius), ...(L.button === 'block' ? { borderBottomWidth: 4, borderBottomColor: c.ink } : null) } as ViewStyle,
    buttonText: { color: readableOn(tone, ['#ffffff', c.ink]), ...bodyFont(t, 700) } as TextStyle,
  };
}

/** 네이티브 테마 영역 표시 — DOM 오버라이드의 이중 변환을 막는다 */
export const nativeThemeAttr = { dataSet: { 'native-theme': '1' } } as any;
