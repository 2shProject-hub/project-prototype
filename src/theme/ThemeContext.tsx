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
}

const Ctx = createContext<ThemeCtx>({
  theme: THEMES[0],
  themeId: THEMES[0].id,
  setThemeId: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children, initialId }: { children: ReactNode; initialId?: string }) {
  const [themeId, setThemeId] = useState(initialId ?? DEFAULT_THEME_ID);

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
  const value = useMemo(() => ({ theme, themeId, setThemeId, themes: THEMES }), [theme, themeId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  return useContext(Ctx);
}

export function useThemeColors() {
  return useContext(Ctx).theme.colors;
}
