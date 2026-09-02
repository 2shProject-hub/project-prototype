/**
 * 단어를 보고 음원 선택 (WordSound1)
 * - 한국어/베트남어 단어 텍스트 제시
 * - 4개 음원 선택지
 * - 공통 ActivityHeader, CtaButton, QuizFeedbackModal 적용
 */
import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Animated } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal } from '../../components';
import { useSfx } from '../../hooks/useSfx';
import { playExclusive, stopExclusive } from '../../utils/audioPlayer';

interface SoundItem {
  value: number;
  audioSrc: string;
}

interface Question {
  no: number;
  desc: string;
  viText?: string;
  items: SoundItem[];
  answer: number;
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordSound1({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedItemValue, setSelectedItemValue] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [playingValue, setPlayingValue] = useState<number | null>(null);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  useEffect(() => {
    return () => {
      stopExclusive();
    };
  }, []);

  const playAudio = (audioSrc?: string, itemVal?: number) => {
    if (!audioSrc || Platform.OS !== 'web') return;
    if (itemVal !== undefined) setPlayingValue(itemVal);
    playExclusive(audioSrc, {
      onEnded: () => setPlayingValue(null),
      onError: () => setPlayingValue(null),
    });
  };

  const handleSelectAndPlay = (item: SoundItem) => {
    if (!item) return;
    setSelectedItemValue(item.value);
    if (item.audioSrc) {
      playAudio(item.audioSrc, item.value);
    }
  };

  const handleConfirm = () => {
    if (selectedItemValue === null) return;

    const correct = selectedItemValue === currentQuestion.answer;
    setIsCorrect(correct);
    setShowModal(true);

    if (correct) {
      sfx.play('correct');
    } else {
      sfx.play('wrong');
    }
  };

  const handleNextFromModal = () => {
    setShowModal(false);

    if (isCorrect) {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedItemValue(null);
        setPlayingValue(null);
      } else {
        onNext?.();
      }
    }
  };

  const progressPct = (currentSetNumber / totalSets) * 100;

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 질문 제목 */}
        <View style={s.titleBox}>
          <Text style={s.title}>
            {pick(lang, '단어를 보고 음원을 고르세요', 'Nhìn từ rồi chọn âm thanh đúng')}
          </Text>
          <Text style={s.subtitle}>
            {pick(lang, 'Nhìn từ rồi chọn âm thanh đúng', '단어를 보고 음원을 고르세요')}
          </Text>
        </View>

        {/* 제시 단어 카드 */}
        <View style={s.wordCardContainer}>
          <View style={s.wordCard}>
            <Text style={s.wordText}>{currentQuestion.desc}</Text>
          </View>
        </View>

        {/* 음원 선택지 그리드 (2x2) */}
        <View style={s.soundGrid}>
          {currentQuestion.items.map((item, idx) => {
            const isSelected = selectedItemValue === item.value;
            const isPlaying = playingValue === item.value;

            return (
              <PulseCard key={item.value} active={isPlaying} style={{ width: '47.5%' }}>
              <TouchableOpacity
                style={[
                  s.soundCard,
                  { width: '100%' },
                  __mbBtn && { minHeight: 138, borderRadius: 18 },
                  isSelected && s.soundCardSelected,
                  isPlaying && s.soundCardPlaying,
                ]}
                onPress={() => handleSelectAndPlay(item)}
                activeOpacity={0.7}
              >
                <View style={[s.badge, isSelected && s.badgeSelected]}>
                  <Text style={[s.badgeText, isSelected && s.badgeTextSelected]}>
                    {idx + 1}
                  </Text>
                </View>
                <ThemedGlyph style={s.soundIcon} glyph={isPlaying ? '⏸' : '🔊'} />
                <Text style={[s.soundLabel, isSelected && s.soundLabelSelected]}>
                  {pick(lang, `음원 ${idx + 1}`, `Âm thanh ${idx + 1}`)}
                </Text>
              </TouchableOpacity>
              </PulseCard>
            );
          })}
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={handleConfirm}
          disabled={selectedItemValue === null}
          size="lg"
        />
      </View>

      {/* 공통 정답/오답 피드백 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect}
        answerText={pick(lang, `음원 ${currentQuestion.answer}번`, `Âm thanh số ${currentQuestion.answer}`)}
        explanation={currentQuestion.desc}
        onNext={handleNextFromModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

// 재생 중인 카드만 커졌다 작아졌다 — transform 이라 옆 카드는 밀리지 않는다
function PulseCard({ active, children, style }: { active: boolean; children: React.ReactNode; style?: any }) {
  const scale = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    if (!active) { scale.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 320, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 1, duration: 320, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => { loop.stop(); scale.setValue(1); };
  }, [active, scale]);
  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  titleBox: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    marginTop: spacing.xs,
  },
  wordCardContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  wordCard: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 2,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    ...shadow.soft,
  },
  wordText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.tealDark,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  soundCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadow.soft,
  },
  soundCardSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  soundCardPlaying: {
    borderColor: colors.tealDark,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.teal,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  badgeTextSelected: {
    color: colors.surface,
  },
  soundIcon: {
    fontSize: 32,
    marginVertical: spacing.xs,
  },
  soundLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  soundLabelSelected: {
    color: colors.tealDark,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
