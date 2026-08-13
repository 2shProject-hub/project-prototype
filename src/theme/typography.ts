// Font stack: Pretendard → Noto Sans KR → system
// Expo 웹에서는 CSS 폰트 로드, 네이티브에서는 시스템 폰트 사용
import { Platform } from 'react-native';

const fontFamily = Platform.select({
  web: 'Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif',
  default: undefined, // 시스템 폰트
});

export const typography = {
  fontFamily,
  heading1: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30 },
  heading2: { fontSize: 18, fontWeight: '700' as const, lineHeight: 26 },
  heading3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 15 },
} as const;
