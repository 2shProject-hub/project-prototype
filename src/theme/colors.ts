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

  // ── 힌트 박스 전용 (쓰기 연습 등 노란색 힌트 영역) ──
  hintBg: '#FEF9C3',
  hintBorder: '#FDE047',
  hintText: '#854D0E',

  // ── 문화 학습 뷰어 전용 ──
  cultureBorder: '#C8C3E8',   // 이미지 컨테이너 테두리 (연보라)
  cultureBg: '#F0ECFA',       // 텍스트+오디오 카드 배경 (연보라)

  // ── 종합 말하기 Step 3 피드백 전용 ──
  speechResultBg: '#F3F0FF',    // 내 발화 결과 박스 (연보라)
  speechResultText: '#7C3AED',  // 내 발화 레이블/강조 (보라)
  modelAnswerBg: '#FFF3E8',     // 정답 박스 (연살구)
  modelAnswerText: '#EA580C',   // 정답 레이블/일치율 (오렌지)
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
