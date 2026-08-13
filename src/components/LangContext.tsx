import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'ko' | 'vi';

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void };

const LangContext = createContext<LangContextValue>({ lang: 'ko', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function pick(lang: Lang, ko: string, vi: string): string {
  return lang === 'vi' ? vi : ko;
}
