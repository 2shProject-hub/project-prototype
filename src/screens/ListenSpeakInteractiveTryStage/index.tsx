/**
 * ListenSpeakInteractiveTryStage (17-T. 듣고 말하기 - 1회 인터랙티브 체험형 화면)
 * 
 * [목적 및 특징]
 * - 한국어를 전혀 읽지 못하는 베트남인 초급 학습자를 위한 1회 체험 튜토리얼 화면
 * - 텍스트 없이 스피커 탭(1단계) -> 마이크 탭(2단계)의 실제 조작을 1회 체험한 후 본 활동 진입
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_LISTEN_SPEAK_INTERACTIVE_TRY } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ListenSpeakInteractiveTryStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_LISTEN_SPEAK_INTERACTIVE_TRY;

  // 진행 상태: 'step1' (스피커 누르기) -> 'step2' (마이크 누르기) -> 'completed' (성공)
  const [stageState, setStageState] = useState<'step1' | 'step2' | 'completed'>('step1');
  const [isPlayingSpeaker, setIsPlayingSpeaker] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);

  const handlePressSpeaker = () => {
    setIsPlayingSpeaker(true);
    setTimeout(() => {
      setIsPlayingSpeaker(false);
      if (stageState === 'step1') setStageState('step2');
    }, 1500);
  };

  const handlePressMic = () => {
    setIsRecordingMic(true);
    setTimeout(() => {
      setIsRecordingMic(false);
      setStageState('completed');
    }, 1500);
  };

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={80} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. 상단 배지 및 타이틀 ── */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {pick(lang, data.badgeKo, data.badgeVi)}
          </Text>
        </View>
        <Text style={styles.title}>
          {pick(lang, data.titleKo, data.titleVi)}
        </Text>

        {/* ── 2. 1단계: 스피커 버튼 체험 카드 ── */}
        <View
          style={[
            styles.tryCard,
            stageState === 'step1' && styles.tryCardActive,
            stageState !== 'step1' && styles.tryCardCompleted,
          ]}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.stepBadge,
                stageState === 'step1' && styles.stepBadgeActive,
                stageState !== 'step1' && styles.stepBadgeDone,
              ]}
            >
              <Text style={styles.stepBadgeText}>
                {stageState !== 'step1' ? '✓' : '1단계'}
              </Text>
            </View>
            <Text style={styles.guideText}>
              {pick(lang, data.step1.guideKo, data.step1.guideVi)}
            </Text>
          </View>

          {/* 펄스 스피커 버튼 */}
          <TouchableOpacity
            style={[
              styles.actionBigBtn,
              isPlayingSpeaker && styles.actionBigBtnPlaying,
            ]}
            onPress={handlePressSpeaker}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBigIcon}>
              {isPlayingSpeaker ? '🔊' : '🔈'}
            </Text>
            <Text style={styles.actionBigLabel}>
              {isPlayingSpeaker
                ? pick(lang, '듣는 중...', 'Đang nghe...')
                : pick(lang, '소리 듣기 (Bấm để nghe)', 'Bấm để nghe')}
            </Text>
          </TouchableOpacity>

          <View style={styles.speechPreviewBox}>
            <Text style={styles.previewKo}>{data.step1.speakerTextKo}</Text>
            <Text style={styles.previewVi}>{data.step1.speakerTextVi}</Text>
          </View>
        </View>

        {/* ── 3. 2단계: 마이크 버튼 체험 카드 ── */}
        <View
          style={[
            styles.tryCard,
            stageState === 'step2' && styles.tryCardActive,
            stageState === 'completed' && styles.tryCardCompleted,
            stageState === 'step1' && styles.tryCardDisabled,
          ]}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.stepBadge,
                stageState === 'step2' && styles.stepBadgeActive,
                stageState === 'completed' && styles.stepBadgeDone,
              ]}
            >
              <Text style={styles.stepBadgeText}>
                {stageState === 'completed' ? '✓' : '2단계'}
              </Text>
            </View>
            <Text style={styles.guideText}>
              {pick(lang, data.step2.guideKo, data.step2.guideVi)}
            </Text>
          </View>

          {/* 펄스 마이크 버튼 */}
          <TouchableOpacity
            style={[
              styles.actionBigBtn,
              styles.actionMicBtn,
              isRecordingMic && styles.actionMicBtnRecording,
              stageState === 'step1' && styles.actionBtnDisabled,
            ]}
            onPress={handlePressMic}
            disabled={stageState === 'step1'}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBigIcon}>
              {isRecordingMic ? '🔴' : '🎙️'}
            </Text>
            <Text
              style={[
                styles.actionBigLabel,
                styles.actionMicLabel,
                isRecordingMic && styles.actionMicLabelRecording,
              ]}
            >
              {isRecordingMic
                ? pick(lang, '녹음 중... “저는 베트남 사람이에요!”', 'Đang ghi âm...')
                : pick(lang, '마이크로 말하기 (Bấm để nói)', 'Bấm để nói')}
            </Text>
          </TouchableOpacity>

          <View style={styles.speechPreviewBox}>
            <Text style={styles.previewKo}>{data.step2.sampleAnswerKo}</Text>
            <Text style={styles.previewVi}>{data.step2.sampleAnswerVi}</Text>
          </View>
        </View>

        {/* ── 4. 성공 축하 카드 ── */}
        {stageState === 'completed' && (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>
              {pick(
                lang,
                data.successBadge.titleKo,
                data.successBadge.titleVi
              )}
            </Text>
            <Text style={styles.successDesc}>
              {pick(
                lang,
                data.successBadge.descKo,
                data.successBadge.descVi
              )}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.ctaBtn,
            stageState !== 'completed' && styles.ctaBtnDisabled,
          ]}
          onPress={onNext}
          disabled={stageState !== 'completed'}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {pick(lang, '듣고 말하기 시작하기  →', 'Bắt đầu nghe và nói  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },
  title: { fontSize: 23, fontWeight: '800', color: colors.ink, lineHeight: 30 },

  // 체험 카드 공통
  tryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    ...shadow.card,
  },
  tryCardActive: { borderColor: colors.teal, backgroundColor: '#FAFCFD' },
  tryCardCompleted: { borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' },
  tryCardDisabled: { opacity: 0.5, backgroundColor: '#F8FAFC' },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  stepBadgeActive: { backgroundColor: colors.tealSoft },
  stepBadgeDone: { backgroundColor: '#22C55E' },
  stepBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  guideText: { fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1 },

  // 액션 대형 버튼
  actionBigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.tealSoft,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#B2EBE8',
  },
  actionBigBtnPlaying: { backgroundColor: '#C8EAE8', borderColor: colors.teal },
  actionBigIcon: { fontSize: 24 },
  actionBigLabel: { fontSize: 14, fontWeight: '800', color: colors.teal },

  actionMicBtn: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  actionMicBtnRecording: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  actionMicLabel: { color: '#B45309' },
  actionMicLabelRecording: { color: '#DC2626' },
  actionBtnDisabled: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },

  speechPreviewBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  previewKo: { fontSize: 13, fontWeight: '700', color: colors.ink },
  previewVi: { fontSize: 11, color: colors.muted },

  // 성공 축하 카드
  successCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    gap: 4,
    ...shadow.card,
  },
  successTitle: { fontSize: 15, fontWeight: '800', color: '#065F46' },
  successDesc: { fontSize: 12, color: '#047857' },

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
  ctaBtnDisabled: { backgroundColor: '#CBD5E1' },
  ctaBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
