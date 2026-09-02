/**
 * 음원 듣고 입력하기 (ListenTyping1)
 * - 음원을 듣고 베트남어/한국어를 입력하는 활동
 * - 프로그레스바 헤더
 * - 음원 재생 버튼
 * - 텍스트 입력 필드
 * - 정답/오답 피드백
 */
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Question {
  no: number;
  audioUrl: string;
  hint?: string;
  answer: string;
  answerVi?: string;
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function ListenTyping1({ questions = [], onNext, onBack, currentSetNumber = 1, totalSets = 1 }: Props) {
  const { lang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const playAudio = () => {
    if (Platform.OS !== 'web' || !currentQuestion.audioUrl) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

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

  const handleConfirm = () => {
    if (!inputValue.trim()) return;

    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedAnswer = currentQuestion.answer.toLowerCase();
    const isCorrect = normalizedInput === normalizedAnswer;

    setModalState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (modalState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setInputValue('');
        setModalState(null);
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
          <Text style={s.title}>{pick(lang, '음원을 듣고 답을 입력해주세요', 'Hãy nghe âm thanh và nhập câu trả lời')}</Text>
        </View>

        {/* 음원 재생 카드 */}
        <View style={s.audioCard}>
          <TouchableOpacity
            style={[s.audioButton, isPlaying && s.audioButtonPlaying]}
            onPress={playAudio}
            activeOpacity={0.7}
          >
            <ThemedGlyph style={s.audioIcon} glyph={isPlaying ? '🔊' : '🔈'} />
          </TouchableOpacity>
          <Text style={s.audioLabel}>{pick(lang, '음원 재생', 'Phát âm thanh')}</Text>
        </View>

        {/* 힌트 (있으면 표시) */}
        {currentQuestion.hint && (
          <View style={s.hintCard}>
            <ThemedGlyph style={s.hintLabel} glyph="💡" /><Text style={s.hintLabel}> {pick(lang, '힌트', 'Gợi ý')}:</Text>
            <Text style={s.hintText}>{currentQuestion.hint}</Text>
          </View>
        )}

        {/* 입력 필드 */}
        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>{pick(lang, '답:', 'Câu trả lời:')}</Text>
          <TextInput
            style={s.textInput}
            placeholder={pick(lang, '여기에 입력하세요', 'Nhập tại đây')}
            placeholderTextColor={colors.muted}
            value={inputValue}
            onChangeText={setInputValue}
            multiline={false}
          />
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.confirmBtn, !inputValue.trim() && s.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!inputValue.trim()}
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
            {/* 정답은 노출하지 않는다 — 오답이면 다시 풀도록 */}
            {modalState === 'correct' && currentQuestion.answerVi ? (
              <Text style={s.modalSubText}>{currentQuestion.answerVi}</Text>
            ) : null}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', padding: 20 },

  titleBox: { marginBottom: 28 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink },

  audioCard: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.teal,
    alignItems: 'center',
  },
  audioButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioButtonPlaying: {
    backgroundColor: '#ECF5F4',
  },
  audioIcon: { fontSize: 40 },
  audioLabel: { fontSize: 14, fontWeight: '700', color: colors.teal },

  hintCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  hintLabel: { fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 6 },
  hintText: { fontSize: 13, fontWeight: '600', color: '#78350F', lineHeight: 18 },

  inputContainer: {
    marginBottom: 28,
  },
  inputLabel: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.line,
  },

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
  confirmBtnDisabled: { backgroundColor: '#d1d5db' },
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
  modalAnswer: { fontSize: 16, fontWeight: '800', color: colors.teal, marginBottom: 4, textAlign: 'center' },
  modalSubText: { fontSize: 13, color: colors.muted, marginBottom: 16, textAlign: 'center' },
  modalBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
