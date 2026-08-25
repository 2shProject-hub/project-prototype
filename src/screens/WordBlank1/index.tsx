/**
 * 단어 빈칸 채우기 (WordBlank1)
 * - 베트남어 단어를 읽고 한국어 단어의 빈칸을 선택지에서 고르기
 * - 프로그레스바 헤더
 * - 단어 선택 기반 답변
 * - 정답/오답 피드백
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Question {
  no: number;
  viWord: string;
  koWord: string;
  answer: string;
  choices: string[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordBlank1({ questions = [], onNext, onBack, currentSetNumber = 1, totalSets = 1 }: Props) {
  const { lang } = useLang();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

  const handleSelectAnswer = (choice: string) => {
    setSelectedAnswer(choice);
  };

  const handleConfirm = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.answer;
    setModalState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (modalState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAnswer(null);
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
          <Text style={s.title}>{pick(lang, '빈칸에 알맞은 말을 고르세요', 'Hãy chọn từ phù hợp cho chỗ trống')}</Text>
        </View>

        {/* 베트남어 단어 */}
        <View style={s.wordCard}>
          <Text style={s.subtitle}>{pick(lang, 'Từ tiếng Việt:', 'Tiếng Việt:')}</Text>
          <Text style={s.viWord}>{currentQuestion.viWord}</Text>
        </View>

        {/* 한국어 단어 (빈칙 표시) */}
        <View style={s.wordCard}>
          <Text style={s.subtitle}>{pick(lang, '한국어:', 'Tiếng Hàn:')}</Text>
          <View style={s.koWordContainer}>
            {currentQuestion.koWord.split('___').map((part, idx, arr) => (
              <View key={idx} style={s.wordPart}>
                <Text style={s.koWord}>{part}</Text>
                {idx < arr.length - 1 && (
                  <View style={[s.blankSlot, selectedAnswer && s.blankSlotFilled]}>
                    <Text style={s.blankSlotText}>{selectedAnswer || '___'}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 선택지 */}
        <View style={s.choicesContainer}>
          {currentQuestion.choices.map((choice) => (
            <TouchableOpacity
              key={choice}
              style={[
                s.choiceButton,
                selectedAnswer === choice && s.choiceButtonSelected,
              ]}
              onPress={() => handleSelectAnswer(choice)}
              activeOpacity={0.7}
            >
              <Text style={[
                s.choiceText,
                selectedAnswer === choice && s.choiceTextSelected,
              ]}>
                {choice}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.confirmBtn, !selectedAnswer && s.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedAnswer}
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
            <Text style={s.modalText}>{pick(lang, '정답: ' + currentQuestion.answer, 'Đáp án: ' + currentQuestion.answer)}</Text>
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

  titleBox: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink },

  wordCard: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  subtitle: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 8 },
  viWord: { fontSize: 18, fontWeight: '800', color: colors.ink, textAlign: 'center' },

  koWordContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 4 },
  wordPart: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  koWord: { fontSize: 16, fontWeight: '800', color: colors.ink },
  blankSlot: {
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 50,
    alignItems: 'center',
  },
  blankSlotFilled: { backgroundColor: '#ECF5F4' },
  blankSlotText: { fontSize: 14, fontWeight: '800', color: colors.teal },

  choicesContainer: { gap: 10, marginBottom: 32 },
  choiceButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: '#ECF5F4',
    borderColor: colors.teal,
  },
  choiceText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  choiceTextSelected: { color: colors.teal },

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
  modalText: { fontSize: 15, fontWeight: '600', color: colors.teal, marginBottom: 16, textAlign: 'center' },
  modalBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
