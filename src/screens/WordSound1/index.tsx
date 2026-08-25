/**
 * 단어를 보고 음원 선택 (WordSound1)
 * - 한국어/베트남어 단어 텍스트 제시
 * - 4개 음원 선택지
 * - 1번 세트에서 베트남어 안내 토스트 팝업 및 자동 음원 재생
 * - 정답/오답 피드백
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';
import { ActivityHeader } from '../../components/ActivityHeader';

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

export function WordSound1({ questions = [], onNext, onBack, currentSetNumber = 1, totalSets = 1 }: Props) {
  const { lang } = useLang();
  const sfx = useSfx();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastAudioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedItemValue, setSelectedItemValue] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<'correct' | 'wrong' | null>(null);
  const [playingValue, setPlayingValue] = useState<number | null>(null);
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
      const audioSrc = require('../../../assets/sounds/260825_word_1.mp3');
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
    } catch (e) {
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

  const playAudio = (audioSrc?: string) => {
    if (!audioSrc || Platform.OS !== 'web') return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setPlayingValue(null);

      audio.play().catch(() => setPlayingValue(null));
      audio.onended = () => setPlayingValue(null);
      audio.onerror = () => setPlayingValue(null);
    } catch {
      setPlayingValue(null);
    }
  };

  const handleSelectAndPlay = (item: SoundItem) => {
    if (!item) return;
    setSelectedItemValue(item.value);
    if (!item.audioSrc) return;
    setPlayingValue(item.value);
    playAudio(item.audioSrc);
  };

  const handleConfirm = () => {
    if (selectedItemValue === null) return;

    const isCorrect = selectedItemValue === currentQuestion.answer;
    setModalState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (modalState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedItemValue(null);
        setModalState(null);
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
          <Text style={s.title}>{pick(lang, '단어를 보고 음원을 고르세요', 'Nhìn từ rồi chọn âm thanh đúng')}</Text>
          <Text style={s.subtitle}>{pick(lang, 'Nhìn từ rồi chọn âm thanh đúng', '단어를 보고 음원을 고르세요')}</Text>
        </View>

        {/* 단어 카드 */}
        <View style={s.wordCardContainer}>
          <View style={s.wordCard}>
            <Text style={s.wordText}>{currentQuestion.desc}</Text>
          </View>
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
              Nghe và xác nhận âm thanh đúng. Bấm để nghe trước, bấm lại lần nữa để chọn.
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

        {/* 음원 선택지 (2x2 그리드) */}
        <View style={[s.soundGridContainer, showToast && currentSetNumber === 1 && s.soundGridContainerWithToast]}>
          <View style={s.soundRow}>
            {currentQuestion.items.slice(0, 2).map((item) => (
              <View key={item.value} style={s.soundCardWrapper}>
                <TouchableOpacity
                  style={[
                    s.soundCard,
                    selectedItemValue === item.value && s.soundCardSelected,
                  ]}
                  onPress={() => handleSelectAndPlay(item)}
                  activeOpacity={0.7}
                >
                  <Text style={s.soundIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={s.soundRow}>
            {currentQuestion.items.slice(2, 4).map((item) => (
              <View key={item.value} style={s.soundCardWrapper}>
                <TouchableOpacity
                  style={[
                    s.soundCard,
                    selectedItemValue === item.value && s.soundCardSelected,
                  ]}
                  onPress={() => handleSelectAndPlay(item)}
                  activeOpacity={0.7}
                >
                  <Text style={s.soundIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.confirmBtn, selectedItemValue === null && s.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={selectedItemValue === null}
          activeOpacity={0.8}
        >
          <Text style={s.confirmBtnText}>{pick(lang, '확인', 'Xác nhận')}</Text>
        </TouchableOpacity>
      </View>

      {/* 정답/오답 모달 */}
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>
              {modalState === 'correct' ? '✅ 정답입니다!' : '❌ 오답입니다'}
            </Text>
            <Text style={s.modalAnswer}>{currentQuestion.desc}</Text>
            {currentQuestion.viText && (
              <Text style={s.modalViText}>{currentQuestion.viText}</Text>
            )}
            <TouchableOpacity
              style={s.modalBtn}
              onPress={handleCloseModal}
              activeOpacity={0.8}
            >
              <Text style={s.modalBtnText}>
                {modalState === 'correct' ? '다음' : '다시 시도'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  toastBox: {
    backgroundColor: '#e6f8f7',
    borderWidth: 1.5,
    borderColor: '#00a8a6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 12,
  },
  toastCloseBtn: {
    position: 'absolute' as const,
    top: 8,
    right: 10,
    padding: 4,
  },
  toastCloseText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 19,
    paddingRight: 20,
  },
  toastBottomRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  toastSpeakerBtn: {
    padding: 4,
    borderRadius: 8,
  },
  toastSpeakerPlaying: {
    backgroundColor: '#b2ecea',
  },
  toastSpeakerIcon: {
    fontSize: 18,
  },

  titleBox: { marginBottom: 32 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.muted },

  wordCardContainer: {
    marginBottom: 16,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    minHeight: 98,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  wordText: { fontSize: 24, fontWeight: '800', color: colors.ink, textAlign: 'center' },

  soundGridContainer: { gap: 16, marginBottom: 32 },
  soundGridContainerWithToast: { marginTop: 12 },
  soundRow: { flexDirection: 'row', gap: 16 },
  soundCardWrapper: { flex: 1 },
  soundCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 2.04,
  },
  soundCardSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: colors.teal,
    borderWidth: 2,
  },
  soundIcon: { fontSize: 36 },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  modalAnswer: { fontSize: 20, fontWeight: '800', color: colors.teal, marginBottom: 4 },
  modalViText: { fontSize: 13, color: colors.muted, marginBottom: 16 },
  modalBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  container: { flex: 1, backgroundColor: '#FFFFFF' },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', padding: 20 },
});
