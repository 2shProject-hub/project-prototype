/**
 * 소리를 듣고 빈칸을 채우기 (WordLetterBlank)
 * - 프로그레스바 헤더
 * - 1번 세트에서 베트남어 안내 토스트 팝업 및 자동 음원 재생
 * - 공통 ActivityHeader, AudioPlayButton, CtaButton, QuizFeedbackModal 적용
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal, AudioPlayButton } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  desc: string;
  viText?: string;
  audioUrl?: string;
  answer: string;
  slots: string[];
  tiles: string[];
  displayFormat: string;
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordLetterBlank({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastAudioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(currentSetNumber === 1);
  const [isToastAudioPlaying, setIsToastAudioPlaying] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const playToastAudio = () => {
    if (Platform.OS !== 'web') return;

    try {
      const audioSrc = require('../../../assets/sounds/260825_word_2.mp3');
      if (!audioSrc) return;

      if (toastAudioRef.current) {
        toastAudioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      toastAudioRef.current = audio;
      setIsToastAudioPlaying(true);

      audio.play().catch(() => {
        setIsToastAudioPlaying(false);
      });

      audio.onended = () => {
        setIsToastAudioPlaying(false);
      };

      audio.onerror = () => {
        setIsToastAudioPlaying(false);
      };
    } catch {
      setIsToastAudioPlaying(false);
    }
  };

  const handleCloseToast = () => {
    if (toastAudioRef.current) {
      toastAudioRef.current.pause();
      toastAudioRef.current = null;
    }
    setIsToastAudioPlaying(false);
    setShowToast(false);
  };

  useEffect(() => {
    if (currentSetNumber === 1 && showToast) {
      const timer = setTimeout(() => {
        playToastAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSetNumber, showToast]);

  const playAudio = () => {
    if (!currentQuestion.audioUrl || Platform.OS !== 'web') return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const audio = new Audio(currentQuestion.audioUrl);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.play().catch(() => setIsPlaying(false));
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSelectTile = (tileIndex: number) => {
    if (usedTileIndices.has(tileIndex)) return;
    if (selectedTiles.length >= currentQuestion.slots.length) return;

    const newUsedIndices = new Set(usedTileIndices);
    newUsedIndices.add(tileIndex);
    setUsedTileIndices(newUsedIndices);
    setSelectedTiles([...selectedTiles, currentQuestion.tiles[tileIndex]]);
  };

  const handleRemoveTile = (slotIndex: number) => {
    const newSelected = [...selectedTiles];
    const removedTile = newSelected.splice(slotIndex, 1)[0];

    const tileIndex = currentQuestion.tiles.indexOf(removedTile);
    const newUsedIndices = new Set(usedTileIndices);
    newUsedIndices.delete(tileIndex);

    setSelectedTiles(newSelected);
    setUsedTileIndices(newUsedIndices);
  };

  const handleConfirm = () => {
    if (selectedTiles.length !== currentQuestion.slots.length) return;

    const userAnswer = selectedTiles.join('');
    const correct = userAnswer === currentQuestion.answer;
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
        setSelectedTiles([]);
        setUsedTileIndices(new Set());
      } else {
        onNext?.();
      }
    }
  };

  const progressPct = (currentSetNumber / totalSets) * 100;
  const isFilled = selectedTiles.length === currentQuestion.slots.length;

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
            {pick(lang, '소리를 듣고 빈칸을 채우세요', 'Hãy nghe đoạn âm thanh rồi điền vào chỗ trống nhé')}
          </Text>
          <Text style={s.subtitle}>
            {pick(lang, 'Hãy nghe đoạn âm thanh rồi điền vào chỗ trống nhé', '소리를 듣고 빈칸을 채우세요')}
          </Text>
        </View>

        {/* 음성 재생 버튼 */}
        <View style={s.audioBtnContainer}>
          <AudioPlayButton
            isPlaying={isPlaying}
            onPress={playAudio}
            size="lg"
            label={pick(lang, '듣기', 'Nghe')}
            disabled={!currentQuestion.audioUrl}
          />
        </View>

        {/* 1번 세트 안내 토스트 팝업 */}
        {showToast && currentSetNumber === 1 && (
          <View style={s.toastBox}>
            <TouchableOpacity
              style={s.toastCloseBtn}
              onPress={handleCloseToast}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={s.toastCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={s.toastMessage}>
              Nghe rồi tự chọn chữ để ghép thành từ. Bấm vào thẻ đúng theo thứ tự bạn nghe được.
            </Text>

            <View style={s.toastBottomRow}>
              <TouchableOpacity
                style={[s.toastSpeakerBtn, isToastAudioPlaying && s.toastSpeakerPlaying]}
                onPress={playToastAudio}
                activeOpacity={0.7}
              >
                <Text style={s.toastSpeakerIcon}>{isToastAudioPlaying ? '🔊' : '🔈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 빈칸 채우기 보드 */}
        <View style={s.boardContainer}>
          <View style={s.slotsContainer}>
            {currentQuestion.slots.map((slot, idx) => {
              const filledValue = selectedTiles[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  style={[s.slot, filledValue && s.slotFilled]}
                  onPress={() => handleRemoveTile(idx)}
                  disabled={filledValue === undefined}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, filledValue && s.slotTextFilled]}>
                    {filledValue || ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={s.boardHintText}>
            {pick(lang, '글자를 탭하여 빈칸에 채우세요', 'Chạm vào chữ để điền vào chỗ trống')}
          </Text>
        </View>

        {/* 글자 타일 목록 */}
        <View style={s.tilesContainer}>
          {currentQuestion.tiles.map((tile, idx) => {
            const isUsed = usedTileIndices.has(idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[s.tile, isUsed && s.tileUsed]}
                onPress={() => handleSelectTile(idx)}
                disabled={isUsed}
                activeOpacity={0.7}
              >
                <Text style={[s.tileText, isUsed && s.tileTextUsed]}>
                  {tile}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={handleConfirm}
          disabled={!isFilled}
          size="lg"
        />
      </View>

      {/* 공통 정답/오답 피드백 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect}
        answerText={currentQuestion.answer}
        explanation={currentQuestion.desc}
        onNext={handleNextFromModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
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
  audioBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  toastBox: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    ...shadow.soft,
  },
  toastCloseBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCloseText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginRight: spacing.xl,
    fontWeight: '500',
  },
  toastBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  toastSpeakerBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toastSpeakerPlaying: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  toastSpeakerIcon: {
    fontSize: 14,
  },
  boardContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  slot: {
    width: 54,
    height: 58,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.teal,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
  },
  slotFilled: {
    borderStyle: 'solid',
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealDark,
  },
  slotText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textMuted,
  },
  slotTextFilled: {
    color: colors.tealDark,
  },
  boardHintText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  tile: {
    minWidth: 54,
    height: 54,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  tileUsed: {
    backgroundColor: colors.bgDisabled,
    borderColor: colors.borderLight,
    opacity: 0.5,
  },
  tileText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tileTextUsed: {
    color: colors.textDisabled,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
