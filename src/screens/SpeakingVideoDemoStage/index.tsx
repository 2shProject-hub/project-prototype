/**
 * SpeakingVideoDemoStage (15-V. 말하기 - 15초 영상 시연형 화면)
 * 
 * [목적 및 특징]
 * - 한국어를 전혀 읽지 못하는 베트남인 초급 학습자를 위한 숏폼 모션 비디오 데모 화면
 * - 텍스트 설명 대신 15초 영상 시연 + 3단계 직관적 픽토그램 행동 카드로 말하기 조작법 안내
 * 
 * [다른 AI 및 개발자 참고사항]
 * - 데이터 바인딩: MOCK_SPEAKING_VIDEO_DEMO (src/data/lessonData.ts)
 * - 영상 소스: assets/video_bridge_intro.mp4 (웹 require 연동)
 * - 다국어 지원: useLang() 및 pick(lang, ko, vi) 유틸리티 함수 적용
 * - 디자인 토큰: src/theme/colors.ts (colors, shadow)
 */

import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import {
  MOCK_SPEAKING_VIDEO_DEMO,
  type SpeakingVideoDemoData,
} from '../../data/lessonData';

const VIDEO_ASSET = require('../../../assets/video_bridge_intro.mp4');

interface Props {
  data?: SpeakingVideoDemoData;
  onNext: () => void;
  onBack: () => void;
}

// ── 웹 전용 비디오 플레이어 ──────────────────────────────────────
function WebVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return React.createElement('video', {
    ref: videoRef,
    src,
    controls: true,
    autoPlay: true,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#000000',
      display: 'block',
    },
  }) as React.ReactElement;
}

export function SpeakingVideoDemoStage({
  data = MOCK_SPEAKING_VIDEO_DEMO,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const videoSrc = Platform.OS === 'web' ? VIDEO_ASSET : null;

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={50} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. 상단 배지 및 타이틀 ── */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {pick(lang, data.badgeKo, data.badgeVi)}
            </Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{data.videoDurationText}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {pick(lang, data.titleKo, data.titleVi)}
        </Text>

        {/* ── 2. 비디오 플레이어 영역 ── */}
        <View style={styles.videoCard}>
          {isPlayingVideo && Platform.OS === 'web' && videoSrc ? (
            <WebVideoPlayer src={videoSrc} />
          ) : (
            <TouchableOpacity
              style={styles.videoCover}
              onPress={() => setIsPlayingVideo(true)}
              activeOpacity={0.9}
            >
              {/* 비디오 썸네일 배경 */}
              <View style={styles.videoCoverBg}>
                <ThemedGlyph style={styles.videoCoverEmoji} glyph="🎬" />
              </View>

              {/* 중앙 큼직한 재생 버튼 */}
              <View style={styles.playBtnCircle}>
                <ThemedGlyph style={styles.playBtnIcon} glyph="▶" />
              </View>

              {/* 하단 시연 안내 띠지 */}
              <View style={styles.videoBanner}>
                <Text style={styles.videoBannerText}>
                  {pick(
                    lang,
                    '탭하여 15초 시연 영상 보기',
                    'Bấm để xem video hướng dẫn 15s'
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* ── 3. 영상 자막 하이라이트 박스 ── */}
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitleIcon}>💬</Text>
          <View style={styles.subtitleTextWrap}>
            <Text style={styles.subtitleKo}>{data.videoSubtitleKo}</Text>
            <Text style={styles.subtitleVi}>{data.videoSubtitleVi}</Text>
          </View>
        </View>

        {/* ── 4. 3단계 직관적 픽토그램 행동 카드 ── */}
        <View style={styles.actionSection}>
          <Text style={styles.actionSectionTitle}>
            {pick(lang, '따라하는 3단계 순서', '3 bước thực hiện')}
          </Text>

          <View style={styles.actionCardsRow}>
            {data.actionSteps.map((step) => (
              <View key={step.step} style={styles.actionCard}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>{step.step}</Text>
                </View>
                <Text style={styles.actionIcon}>{step.icon}</Text>
                <Text style={styles.actionName}>
                  {pick(lang, step.actionKo, step.actionVi)}
                </Text>
                <Text style={styles.actionTip}>
                  {pick(lang, step.tipKo, step.tipVi)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {pick(lang, '지금 말하기 시작하기  →', 'Bắt đầu luyện nói ngay  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },

  // 상단 배지 행
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
  },
  durationBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 30,
  },

  // 비디오 카드
  videoCard: {
    borderRadius: 18,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    backgroundColor: '#1E293B',
    ...shadow.card,
  },
  videoCover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCoverBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCoverEmoji: {
    fontSize: 64,
    opacity: 0.3,
  },
  playBtnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  playBtnIcon: {
    fontSize: 24,
    color: colors.teal,
    marginLeft: 4,
  },
  videoBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  videoBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // 자막 박스
  subtitleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFE8E6',
    gap: 10,
  },
  subtitleIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  subtitleTextWrap: {
    flex: 1,
    gap: 3,
  },
  subtitleKo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 18,
  },
  subtitleVi: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },

  // 3단계 행동 섹션
  actionSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  actionSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
    ...shadow.card,
  },
  stepNumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionIcon: {
    fontSize: 24,
    marginVertical: 2,
  },
  actionName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  actionTip: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 13,
  },

  // 하단 CTA
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
