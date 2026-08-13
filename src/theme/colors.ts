// Design tokens — Source B (kchao-lesson1-main/src/index.css) 기준
export const colors = {
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
} as const;
