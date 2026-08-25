// Design tokens — Source B (kchao-lesson1-main/src/index.css) 기준 및 확장
export const colors = {
  // ── 기본 브랜드/테마 컬러 (기존 유지) ──
  teal: '#00a8a6',
  tealDark: '#008e8d',
  tealSoft: '#ddfbfa',
  ink: '#04303d',
  muted: '#61727a',
  line: '#dce5e7',
  surface: '#ffffff',
  canvas: '#f5f8f8',
  backdrop: '#eef3f3',
  amber: '#ffb33c',
  red: '#ef5e62',
  green: '#249b5b',

  // ── 상태/피드백 컬러 (신규 확장) ──
  correct: '#249b5b',
  correctLight: '#e8f7ee',
  wrong: '#ef5e62',
  wrongLight: '#fdeeed',
  warning: '#ffb33c',
  warningLight: '#fff7eb',
  info: '#00a8a6',
  infoLight: '#ddfbfa',

  // ── 텍스트 컬러 (시맨틱 토큰) ──
  textPrimary: '#04303d',
  textSecondary: '#3D4B57',
  textMuted: '#61727a',
  textDisabled: '#A0AEB8',
  textWhite: '#ffffff',

  // ── 배경 및 테두리 (시맨틱 토큰) ──
  border: '#dce5e7',
  borderLight: '#E0E4E8',
  borderDark: '#b8c7cb',
  bgSubtle: '#F0F4F8',
  bgCard: '#ffffff',
  bgDisabled: '#E0E4E8',
} as const;

export const shadow = {
  card: {
    shadowColor: '#04303d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  strong: {
    shadowColor: '#04303d',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 55,
    elevation: 12,
  },
  soft: {
    shadowColor: '#04303d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export type Colors = typeof colors;
export type Shadow = typeof shadow;
