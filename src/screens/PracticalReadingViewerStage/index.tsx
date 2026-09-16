/**
 * PracticalReadingViewerStage — K-Chao 신규 액티비티 템플릿: AI 튜터 인트로(Dim) 및 콘텐츠 뷰어
 *
 * 2단계 학습 구성:
 *   [Step 1: AI 튜터 인트로 오버레이(Dim)]
 *     - 백오피스 데이터 설정 시 조건부 노출 (Dim 배경, 상단 뱃지, 말풍선 \n/<br> 개행 렌더링, 오디오 자동재생/Replay, 튜터 수평 배치)
 *     - [확인] 탭 또는 언마운트 시 오디오 정지 및 clean-up 처리 후 Step 2로 전환
 *   [Step 2: 콘텐츠 학습 뷰어 본 화면]
 *     - ActivityHeader, 한/베 다국어 지시문 병기(조건부 노출)
 *     - 중앙 삽화 미디어 카드 (Admin URL 바인딩 + 로컬 에셋 fallback)
 *     - 하단 본문 문장 카드 (1:1 매핑, 누락 번호 공백 유지, 문장 전체 부재 시 비노출)
 *     - 하단 [다음 →] 버튼
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import {
  MOCK_PRACTICAL_READING_VIEWER,
  type PracticalReadingViewerData,
} from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');
const FALLBACK_IMAGE = require('../../../assets/SetWordbookEvalStage/2_teacher.png');

interface Props {
  onNext: () => void;
  onClose: () => void;
  data?: PracticalReadingViewerData;
}

// ─── 개행(\n, <br>) 렌더링 지원 컴포넌트 ────────────────────────
function FormattedText({ text, style }: { text: string; style?: any }) {
  if (!text) return null;
  const lines = text.replace(/<br\s*\/?>/gi, '\n').split('\n');
  return (
    <Text style={style}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Text>
  );
}

export function PracticalReadingViewerStage({
  onNext,
  onClose,
  data = MOCK_PRACTICAL_READING_VIEWER,
}: Props) {
  const { lang } = useLang();

  // Step 1 Dim 레이어 노출 판단
  const hasIntroConfig = Boolean(
    data.intro?.showIntro || data.intro?.bubbleTextKo || data.intro?.audioUrl
  );

  const [showIntro, setShowIntro] = useState<boolean>(hasIntroConfig);
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  const introAudioSrc = data.intro?.audioUrl;

  // ── Step 1 오디오 자동 재생 및 clean-up ──
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

  // 스피커 터치 시 음원 반복 재생 (Replay)
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

  // Step 1 [확인] 탭 시 오디오 정지 및 Step 2 전환
  const handleConfirmIntro = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current = null;
    }
    setIsPlayingIntro(false);
    setShowIntro(false);
  };

  // 닫기 X 버튼 탭 시 clean-up
  const handleClose = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current = null;
    }
    setIsPlayingIntro(false);
    onClose();
  };

  // ── Step 2 지시문 병기 판단 ──
  const titleKo = data.mainContent?.title?.ko?.trim();
  const titleVi = data.mainContent?.title?.vi?.trim();

  // ── 이미지 및 본문 문장 데이터 ──
  const mediaImage = data.mainContent?.imageUrl ?? FALLBACK_IMAGE;
  const sentences = data.mainContent?.sentences ?? [];
  const hasSentences = sentences.length > 0;

  // 말풍선 문구 다국어 렌더링
  const bubbleText = data.intro?.bubbleTextKo
    ? pick(lang, data.intro.bubbleTextKo, data.intro.bubbleTextVi)
    : '다음 내용을 잘 읽고 제대로 이해했는지 확인 문제를 풀어 보세요.\n그 다음에는 쓰기 연습과 쓰기 실전을 천천히 해보세요.';

  return (
    <View style={s.screen}>
      {/* ── 상단 헤더 ── */}
      <ActivityHeader percentage={82} onClose={handleClose} />

      {/* ── Step 2: 활동 본 화면 (콘텐츠 뷰어) ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 다국어 지시문 영역 */}
        {(titleKo || titleVi) && (
          <View style={s.titleSection}>
            {titleKo && <Text style={s.titleKo}>{titleKo}</Text>}
            {titleVi && <Text style={s.titleVi}>{titleVi}</Text>}
          </View>
        )}

        {/* 중앙 미디어/이미지 카드 */}
        {mediaImage && (
          <View style={s.mediaCard}>
            <Image
              source={typeof mediaImage === 'string' ? { uri: mediaImage } : mediaImage}
              style={s.mediaImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* 하단 본문 문장 카드 (한국어 전체 블록 + 베트남어 전체 블록 분리 노출) */}
        {hasSentences && (
          <View style={s.passageCard}>
            {/* 1. 한국어 문장 전체 블록 */}
            {sentences.some((item) => item.ko?.trim()) && (
              <View style={s.koBlock}>
                {sentences.map((item, index) =>
                  item.ko?.trim() ? (
                    <Text key={index} style={s.sentenceKo}>
                      {item.ko}
                    </Text>
                  ) : null
                )}
              </View>
            )}

            {/* 2. 베트남어 번역 전체 블록 및 구분선 */}
            {sentences.some((item) => item.vi?.trim()) && (
              <View style={s.viBlock}>
                {sentences.some((item) => item.ko?.trim()) && <View style={s.divider} />}
                {sentences.map((item, index) =>
                  item.vi?.trim() ? (
                    <Text key={index} style={s.sentenceVi}>
                      {item.vi}
                    </Text>
                  ) : null
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── 하단 [다음 →] 버튼 (Step 2 전용) ── */}
      {!showIntro && (
        <View style={s.footer}>
          <TouchableOpacity style={s.ctaBtn} onPress={onNext} activeOpacity={0.9}>
            <Text style={s.ctaBtnText}>
              {pick(lang, '다음', 'Tiếp theo')} →
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
              {pick(
                lang,
                data.badgeKo ?? data.intro?.titleKo ?? '종합 읽기',
                data.badgeVi ?? data.intro?.titleVi ?? 'Đọc tổng hợp'
              )}
            </Text>
          </View>

          {/* 중앙~하단 말풍선 + AI 튜터 수평 레이아웃 */}
          <View style={s.introContentContainer}>
            <View style={s.introTutorRow}>
              <View style={s.bubbleCard}>
                <FormattedText text={bubbleText} style={s.bubbleText} />

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
            <TouchableOpacity
              style={s.introConfirmBtn}
              onPress={handleConfirmIntro}
              activeOpacity={0.9}
            >
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

// ─── 스타일시트 ───────────────────────────────────────────────────
const s = StyleSheet.create({
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
    paddingBottom: 28,
    gap: 16,
  },

  // 상단 지시문
  titleSection: {
    gap: 4,
  },
  titleKo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    lineHeight: 26,
  },
  titleVi: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },

  // 중앙 미디어 카드
  mediaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6E0F3',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  mediaImage: {
    width: '100%',
    height: 180,
  },

  // 하단 본문 문장 카드
  passageCard: {
    backgroundColor: '#F3EDFC',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 14,
  },
  koBlock: {
    gap: 6,
  },
  sentenceKo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    lineHeight: 25,
  },
  viBlock: {
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2D9F3',
    marginBottom: 10,
  },
  sentenceVi: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 21,
  },

  // 하단 네비게이션
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EFF5',
  },
  ctaBtn: {
    backgroundColor: '#00A8A6',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Step 1: Dim 레이어 스타일 ──
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    zIndex: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },

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
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
