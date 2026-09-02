/**
 * 전역 오디오 플레이어 — 항상 한 번에 하나의 콘텐츠 오디오만 재생.
 * 화면 전환 시 이전 화면의 오디오가 겹치는 버그를 방지한다.
 */

let _audio: HTMLAudioElement | null = null;

export function playExclusive(
  src: string,
  callbacks?: { onEnded?: () => void; onError?: () => void },
): void {
  stopExclusive();
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(src);
    _audio = audio;

    audio.onended = () => {
      if (_audio === audio) _audio = null;
      callbacks?.onEnded?.();
    };
    audio.onerror = () => {
      if (_audio === audio) _audio = null;
      callbacks?.onError?.();
    };
    audio.play().catch(() => {
      if (_audio === audio) _audio = null;
      callbacks?.onError?.();
    });
  } catch {
    callbacks?.onError?.();
  }
}

export function stopExclusive(): void {
  if (_audio) {
    _audio.pause();
    _audio = null;
  }
}
