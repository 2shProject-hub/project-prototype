/**
 * useSfx — 공통 효과음 훅
 *
 * 사용법: const sfx = useSfx();  →  sfx.play('tap');
 *
 * ■ 효과음 추가: SFX_MAP에 키/파일 추가 후 SfxKey 타입 자동 확장
 * ■ 제거(원복): import 및 useSfx() 선언 삭제, sfx.play() 호출 제거
 * ■ 네이티브 이식: Platform.OS !== 'web' 분기에 expo-av 연동
 */

import { Platform } from 'react-native';

// ── 효과음 목록 (여기에만 추가/수정) ──────────────────────────────
const SFX_MAP = {
  tap:       require('../../assets/sounds/sfx_touch.mp3') as string,
  correct:   require('../../assets/sounds/eff_correct.mp3') as string,
  incorrect: require('../../assets/sounds/sfx_fail.mp3') as string,
} as const;

export type SfxKey = keyof typeof SFX_MAP;

export function useSfx() {
  const play = (key: SfxKey = 'tap') => {
    if (Platform.OS !== 'web') return;
    // 이식 시: expo-av Audio.Sound 로 교체
    try {
      const audio = new Audio(SFX_MAP[key]);
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}
  };

  return { play };
}
