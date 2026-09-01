// 전역 테마 주입 — 헤더 셀렉트박스에서 20종 테마를 전환한다.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { THEMES, DEFAULT_THEME_ID } from './themes';
import { loadThemeFonts } from './fonts';
import type { Theme } from './themeTypes';

interface ThemeCtx {
  theme: Theme;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: Theme[];
  /** 테마 적용 토글 — 화면 컴포넌트가 이 값을 보고 테마/원본 렌더를 가른다 */
  enabled: boolean;
  setEnabled: (on: boolean) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: THEMES[0],
  themeId: THEMES[0].id,
  setThemeId: () => {},
  themes: THEMES,
  enabled: true,
  setEnabled: () => {},
});

const LS_KEY = 'kchao-theme';

function loadSaved(): { id?: string; enabled?: boolean } {
  try {
    const raw = globalThis.localStorage?.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function ThemeProvider({ children, initialId }: { children: ReactNode; initialId?: string }) {
  const saved = loadSaved();
  const [themeId, setThemeId] = useState(initialId ?? saved.id ?? DEFAULT_THEME_ID);
  const [enabled, setEnabled] = useState(saved.enabled ?? true);

  // 새로고침해도 고른 테마가 유지되도록 저장
  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(LS_KEY, JSON.stringify({ id: themeId, enabled }));
    } catch {}
  }, [themeId, enabled]);

  // 테마가 실제로 쓰는 서체만 주입한다 (웹 전용, 1회)
  useEffect(() => {
    const used = new Set<string>();
    for (const t of THEMES) {
      used.add(t.type.display);
      used.add(t.type.body);
    }
    loadThemeFonts([...used]);
  }, []);

  const theme = useMemo(() => THEMES.find((t) => t.id === themeId) ?? THEMES[0], [themeId]);
  const value = useMemo(() => ({ theme, themeId, setThemeId, themes: THEMES, enabled, setEnabled }), [theme, themeId, enabled]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  return useContext(Ctx);
}

export function useThemeColors() {
  return useContext(Ctx).theme.colors;
}
