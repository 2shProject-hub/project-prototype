/**
 * VideoBridgeStage — 영상 브릿지 화면
 *
 * 학습 이동 시 영상으로 학습해야 하는 정보를 안내하는 활동.
 *
 * ■ 추가 기능 (Step 1: AI 튜터 인트로 Dim 레이어)
 *   - API/백오피스 데이터에 AI 튜터 안내 설정이 존재하거나 showAiTutorIntro가 true인 경우 조건부 진입.
 *   - Dim 오버레이, 상단 뱃지, 말풍선 텍스트, 스피커 아이콘(오디오 재생/Replay), AI 튜터 썸네일 노출.
 *   - 진입 시 오디오 자동재생, 하단 [확인] 버튼 클릭 시 오디오 정지 및 Step 2(본 영상 활동)로 전환.
 *   - 설정 데이터가 없을 경우 즉시 Step 2 진입 (하위 호환성 유지).
 */

import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Animated, Image,
} from 'react-native';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_VIDEO_BRIDGE_WITH_INTRO, type VideoBridgeData } from '../../data/lessonData';

import { isMb } from '../../theme/mb/mbSkin';

let LOCAL_VIDEO_ASSET: string | null = null;
try {
  LOCAL_VIDEO_ASSET = Platform.OS === 'web' ? (require('../../../assets/grammer_mov.mp4') as string) : null;
} catch {
  LOCAL_VIDEO_ASSET = null;
}

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');

let LOCAL_INTRO_AUDIO: string | null = null;
try {
  LOCAL_INTRO_AUDIO = Platform.OS === 'web'
    ? (require('../../../assets/ai-dec/ai-dec-1.mp3') as string)
    : null;
} catch {
  LOCAL_INTRO_AUDIO = null;
}

// ─── Props ────────────────────────────────────────────────────────
interface VideoBridgeStageProps {
  onPressConfirm: () => void;
  onClose: () => void;
  data?: VideoBridgeData;
}

// ─── 웹 전용 비디오 플레이어 ──────────────────────────────────────
function WebVideoPlayer({ src, forcePause }: { src: string; forcePause: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (forcePause) {
      v.pause();
      return;
    }

    const t = setTimeout(() => {
      const currentV = videoRef.current;
      if (!currentV || forcePause) return;
      currentV.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }, 150);
    return () => clearTimeout(t);
  }, [src, forcePause]);

  return React.createElement('video', {
    ref: videoRef,
    src,
    controls: true,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#111111',
      display: 'block',
    },
  });
}

// ─── 네이티브/영상 없음 플레이스홀더 ─────────────────────────────
function VideoPlaceholder({ title }: { title: string }) {
  return (
    <View style={p.wrap}>
      <View style={p.iconCircle}>
        <ThemedGlyph style={p.playIcon} glyph="▶" />
      </View>
      <Text style={p.title}>{title}</Text>
      <Text style={p.sub}>영상은 모바일 앱에서 재생됩니다.</Text>
    </View>
  );
}

const p = StyleSheet.create({
  wrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { fontSize: 28, color: '#ffffff', marginLeft: 4 },
  title: { fontSize: 16, fontWeight: '700', color: '#ffffff', textAlign: 'center', lineHeight: 24 },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
});

// 타이틀 카드 오버레이 — delayMs 뒤에 서서히 사라진다 (영상 인트로 자막 느낌)
function MbFadeOut({ delayMs, children }: { delayMs: number; children: React.ReactNode }) {
  const op = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(op, { toValue: 0, duration: 600, useNativeDriver: false }).start();
    }, delayMs);
    return () => clearTimeout(t);
  }, [delayMs, op]);
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 88, left: 24, right: 24, alignItems: 'center', gap: 10, zIndex: 5, opacity: op }}>
      {children}
    </Animated.View>
  );
}

// ─── 메인 화면 ────────────────────────────────────────────────────
export function VideoBridgeStage({
  onPressConfirm,
  onClose,
  data = MOCK_VIDEO_BRIDGE_WITH_INTRO,
}: VideoBridgeStageProps) {
  const { lang } = useLang();
  const { theme: __mbVbT, enabled: __mbVbE } = useTheme();
  const __mbVb = __mbVbE && isMb(__mbVbT.id);

  // 백오피스 설정 기반 Step 1(Dim 레이어) 노출 여부 판단
  const hasAiTutorConfig = Boolean(
    data?.showAiTutorIntro || data?.aiTutorText || data?.aiTutorAudioUri
  );

  const [showIntro, setShowIntro] = useState<boolean>(hasAiTutorConfig);
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(false);
  const [forcePauseVideo, setForcePauseVideo] = useState<boolean>(false);

  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  const videoSrc = data?.videoUri ?? LOCAL_VIDEO_ASSET;
  const introAudioSrc = data?.aiTutorAudioUri ?? LOCAL_INTRO_AUDIO;

  // ── Step 1: 오디오 자동 재생 및 정리 ──
  useEffect(() => {
    if (!showIntro || Platform.OS !== 'web' || !introAudioSrc) return;

    const timer = setTimeout(() => {
      try {
        const audio = new Audio(introAudioSrc as string);
        introAudioRef.current = audio;
        audio.play().catch(() => {});
        setIsPlayingIntro(true);
        audio.onended = () => setIsPlayingIntro(false);
      } catch {}
    }, 300);

    return () => {
      clearTimeout(timer);
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current = null;
      }
      setIsPlayingIntro(false);
    };
  }, [showIntro, introAudioSrc]);

  // 스피커 터치 시 오디오 반복 재생 (Replay)
  const handleReplayIntro = () => {
    if (Platform.OS !== 'web' || !introAudioSrc) return;
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current = null;
    }
    try {
      const audio = new Audio(introAudioSrc as string);
      introAudioRef.current = audio;
      audio.play().catch(() => {});
      setIsPlayingIntro(true);
      audio.onended = () => setIsPlayingIntro(false);
    } catch {}
  };

  // Step 1 [확인] 클릭 시: 오디오 정지 및 Step 2(본 활동)로 전환
  const handleConfirmIntro = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current = null;
    }
    setIsPlayingIntro(false);
    setShowIntro(false);
  };

  // 닫기 버튼 터치 시 전체 정리
  const handleClose = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current = null;
    }
    setIsPlayingIntro(false);
    onClose();
  };

  // Step 2 본 활동 완료 [다음] 클릭 시
  const handleConfirmMain = () => {
    setForcePauseVideo(true);
    onPressConfirm();
  };

  // 말풍선 안내 텍스트 (기본 Fallback 처리)
  const bubbleText = data?.aiTutorText
    ? pick(lang, data.aiTutorText, data.aiTutorTextVi)
    : pick(lang, '먼저 대화를 자막 없이 잘 들어보세요.', 'Trước tiên hãy lắng nghe đoạn thoại mà không có phụ đề.');

  return (
    <View style={s.screen}>

      {/* ── 영상 영역 ── */}
      <View style={s.videoArea}>
        {Platform.OS === 'web' && videoSrc ? (
          <WebVideoPlayer src={videoSrc as string} forcePause={showIntro || forcePauseVideo} />
        ) : (
          <VideoPlaceholder title={pick(lang, data?.title ?? '', data?.titleVi ?? '')} />
        )}
      </View>

      {/* ── 영상 위 타이틀 오버레이 ── */}
      {__mbVb && !showIntro ? (
        <MbFadeOut delayMs={2600}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', lineHeight: 34, letterSpacing: -0.4 }}>
            {pick(lang, data?.title ?? '', data?.titleVi ?? '')}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.72)', textAlign: 'center' }}>
            {pick(lang, '오늘 배운 문법을 영상으로 정리해요', 'Ôn lại ngữ pháp hôm nay qua video')}
          </Text>
        </MbFadeOut>
      ) : null}

      {/* ── X 닫기 버튼 오버레이 ── */}
      <TouchableOpacity style={s.closeBtn} onPress={handleClose} activeOpacity={0.8} hitSlop={8}>
        <Text style={s.closeBtnText}>✕</Text>
      </TouchableOpacity>

      {/* ── 하단 다음 버튼 (Step 2 전용) ── */}
      {!showIntro && (
        <View style={s.footer}>
          <TouchableOpacity style={s.ctaBtn} onPress={handleConfirmMain} activeOpacity={0.9}>
            <Text style={s.ctaBtnText}>
              {pick(lang, '다음', '다음')} →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step 1: AI 튜터 인트로 Dim 레이어 팝업 ── */}
      {showIntro && (
        <View style={s.dimOverlay}>
          {/* 상단 뱃지 */}
          <View style={s.badgeWrap}>
            <Text style={s.badgeText}>
              {pick(lang, data?.badgeText ?? '실전 듣기', data?.badgeText ?? 'Nghe thực tế')}
            </Text>
          </View>

          {/* 중앙~하단 말풍선 + AI 튜터 컨테이너 */}
          <View style={s.introContentContainer}>
            <View style={s.introTutorRow}>
              <View style={s.bubbleCard}>
                <Text style={s.bubbleText}>{bubbleText}</Text>
                
                {/* 스피커 아이콘 (오디오 재생 상태 / Replay 버튼) */}
                <TouchableOpacity
                  style={[s.speakerBtn, isPlayingIntro && s.speakerBtnPlaying]}
                  onPress={handleReplayIntro}
                  activeOpacity={0.8}
                >
                  <Text style={s.speakerIcon}>🔊</Text>
                </TouchableOpacity>
              </View>

              {/* AI 튜터 썸네일 이미지 */}
              <Image source={TUTOR_IMAGE} style={s.tutorImage} resizeMode="contain" />
            </View>

            {/* 하단 확인 버튼 */}
            <TouchableOpacity style={s.introConfirmBtn} onPress={handleConfirmIntro} activeOpacity={0.9}>
              <Text style={s.introConfirmBtnText}>
                {pick(lang, '확인', 'Xác nhận')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111111',
  },

  videoArea: {
    flex: 1,
    backgroundColor: '#111111',
  },

  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#111111',
  },
  ctaBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    color: '#00a8a6',
    fontSize: 16,
    fontWeight: '700',
  },

  // ─── Step 1: Dim 레이어 스타일 ───
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },

  // 상단 뱃지
  badgeWrap: {
    alignSelf: 'center',
    backgroundColor: '#D7F8F7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00A8A6',
    letterSpacing: -0.3,
  },

  introContentContainer: {
    width: '100%',
    gap: 16,
  },

  introTutorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    width: '100%',
  },

  bubbleCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 50,
    minHeight: 96,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 23,
  },

  speakerBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D7F8F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBtnPlaying: {
    backgroundColor: '#00A8A6',
  },
  speakerIcon: {
    fontSize: 18,
  },

  tutorImage: {
    width: 88,
    height: 122,
    flexShrink: 0,
  },

  introConfirmBtn: {
    backgroundColor: '#00A8A6',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  introConfirmBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
