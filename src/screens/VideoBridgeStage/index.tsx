/**
 * VideoBridgeStage — 영상 브릿지 화면
 *
 * 학습 이동 시 영상으로 학습해야 하는 정보를 안내하는 활동.
 *
 * ■ Source A 참고
 *   act01 / intro_video / PreviewVideo1
 *   (src/screens/activity/preview/PreviewVideo1.tsx)
 *
 * ■ Source A 대비 주요 차이
 *   - ActivityLayout(showHeader=false) → <View> + 커스텀 X 버튼 오버레이
 *   - MissionSummaryVideoPlayer → 웹: <video> 태그 / 모바일: 플레이스홀더
 *   - 하단 버튼 텍스트: '학습 시작' → '다음'
 *   - 자막(SRT) 로딩 제외 (프로토타입 범위 밖)
 *
 * ■ 이식 가이드 (Source A ActivityLayout 연동 시)
 *   1. <View style={s.screen}> → <ActivityLayout showHeader={false} useScrollView={false}>
 *   2. VIDEO_ASSET require() → resolveActivityVideoSource(activity, videoValue)
 *   3. 하단 버튼 → MissionSummaryVideoPlayer bottomUi prop으로 전달
 *   4. recordQuestionAttempt + completeActivity 완료 후 navigateToNextActivityOrLessonComplete
 */

import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_VIDEO_BRIDGE, type VideoBridgeData } from '../../data/lessonData';

// 이식 시: resolveActivityVideoSource() 반환값으로 교체
const LOCAL_VIDEO_ASSET =
  Platform.OS === 'web'
    ? (require('../../../assets/video_bridge_intro.mp4') as string)
    : null;

// ─── Props ────────────────────────────────────────────────────────
interface VideoBridgeStageProps {
  onPressConfirm: () => void;
  onClose: () => void;
  data?: VideoBridgeData;
}

// ─── 웹 전용 비디오 플레이어 ──────────────────────────────────────
// 이식 시: MissionSummaryVideoPlayer 컴포넌트로 교체
function WebVideoPlayer({ src, forcePause }: { src: string; forcePause: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (forcePause && videoRef.current) {
    videoRef.current.pause();
  }

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
// 이식 시: MissionSummaryVideoPlayer 컴포넌트로 교체
function VideoPlaceholder({ title }: { title: string }) {
  return (
    <View style={p.wrap}>
      <View style={p.iconCircle}>
        <Text style={p.playIcon}>▶</Text>
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

// ─── 메인 화면 ────────────────────────────────────────────────────
export function VideoBridgeStage({
  onPressConfirm,
  onClose,
  data = MOCK_VIDEO_BRIDGE,
}: VideoBridgeStageProps) {
  const { lang } = useLang();
  const [forcePause, setForcePause] = useState(false);

  // 이식 시: data.videoUri → resolveActivityVideoSource() 결과로 교체
  const videoSrc = data.videoUri ?? LOCAL_VIDEO_ASSET;

  const handleConfirm = () => {
    setForcePause(true);
    // 이식 시: recordQuestionAttempt → completeActivity → navigateToNextActivityOrLessonComplete
    onPressConfirm();
  };

  return (
    <View style={s.screen}>

      {/* ── 영상 영역 ── */}
      {/* 이식 시: MissionSummaryVideoPlayer로 교체 (showExitConfirmPopup, captionsAvailable 등) */}
      <View style={s.videoArea}>
        {Platform.OS === 'web' && videoSrc ? (
          <WebVideoPlayer src={videoSrc as string} forcePause={forcePause} />
        ) : (
          <VideoPlaceholder title={pick(lang, data.title, data.titleVi)} />
        )}
      </View>

      {/* ── X 닫기 버튼 오버레이 ── */}
      {/* 이식 시: MissionSummaryVideoPlayer onPressClose prop으로 전달 */}
      <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.8} hitSlop={8}>
        <Text style={s.closeBtnText}>✕</Text>
      </TouchableOpacity>

      {/* ── 하단 다음 버튼 ── */}
      {/* 이식 시: MissionSummaryVideoPlayer bottomUi prop으로 전달 */}
      <View style={s.footer}>
        <TouchableOpacity style={s.ctaBtn} onPress={handleConfirm} activeOpacity={0.9}>
          <Text style={s.ctaBtnText}>
            {pick(lang, '다음', '다음')} →
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111111',
  },

  // 영상 영역 — 전체 화면을 채움 (하단 버튼 영역 제외)
  videoArea: {
    flex: 1,
    backgroundColor: '#111111',
  },

  // 닫기 버튼 — 우상단 고정
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
    zIndex: 10,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  // 하단 버튼 영역
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
  // 이식 시: Source A startButtonText 스타일 참고 (color: '#2E89FC', pretendard[700])
  ctaBtnText: {
    color: '#00a8a6',
    fontSize: 16,
    fontWeight: '700',
  },
});
