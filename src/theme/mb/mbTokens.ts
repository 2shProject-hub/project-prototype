// 말해보카 전용(MB) 디자인 토큰 — BIKO(GDWEB 2024 WINNER) 컨셉.
//
// 말해보카 테마가 켜졌을 때만 쓰는 별도 소스 레이어다. 일반 테마 토큰과 독립:
// 비비드 바이올렛 풀블리드, 초대형 타이포(Pretendard 800~900), 청키 라운드 카드,
// 알약 CTA, 시원한 여백. 아이콘은 전부 벡터(SVG)·장식은 CSS, 학습 콘텐츠 사진만 실사.
export const mb = {
  violet: '#7B2FF2',
  violetDark: '#5B21C9',
  violetDeep: '#3D1690',
  lavender: '#F1EAFE',
  lavenderLine: '#E4D9FB',
  ink: '#17171B',
  sub: '#55516B',
  muted: '#8B87A0',
  line: '#ECE9F6',
  white: '#FFFFFF',
  yellow: '#FFD644',
  green: '#23D96C',
  pink: '#FF6EA9',
} as const;

export const mbFont = '"Pretendard", system-ui, sans-serif';

/** 초대형 디스플레이 */
export const mbDisplay = (size = 32, weight: '800' | '900' = '900') => ({
  fontFamily: mbFont,
  fontSize: size,
  fontWeight: weight as any,
  letterSpacing: -0.8,
  color: mb.ink,
});

export const mbBody = (size = 15, weight: '500' | '600' | '700' = '500') => ({
  fontFamily: mbFont,
  fontSize: size,
  fontWeight: weight as any,
  color: mb.sub,
  lineHeight: Math.round(size * 1.5),
});
