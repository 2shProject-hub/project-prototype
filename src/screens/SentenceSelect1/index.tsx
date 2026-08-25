/**
 * 뜻에 맞는 문장 고르기 (SentenceSelect1)
 * - 베트남어 문장을 읽고 한국어 문장 선택지 중 뜻에 맞는 것 고르기
 * - 프로그레스바 헤더
 * - 문장 선택 기반 답변
 * - 정답/오답 피드백
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Question {
  no: number;
  viSentence: string;
  koCorrectSentence: string;
  choices: string[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function SentenceSelect1({ questions = [], onNext, onBack, currentSetNumber = 1, totalSets = 1 }: Props) {
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

    const isCorrect = selectedAnswer === currentQuestion.koCorrectSentence;
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
          <Text style={s.title}>{pick(lang, '뜻에 맞는 문장을 고르세요', 'Hãy chọn câu có nghĩa phù hợp')}</Text>
        </View>

        {/* 베트남어 지문 카드 */}
        <View style={s.textCard}>
          <Text style={s.subtitle}>{pick(lang, 'Tiếng Việt:', 'Tiếng Việt:')}</Text>
          <Text style={s.viSentence}>{currentQuestion.viSentence}</Text>
        </View>

        {/* 한국어 문장 선택지 */}
        <View style={s.choicesContainer}>
          <Text style={s.choiceLabel}>{pick(lang, '한국어 선택지:', 'Lựa chọn Tiếng Hàn:')}</Text>
          {currentQuestion.choices.map((choice, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                s.choiceButton,
                selectedAnswer === choice && s.choiceButtonSelected,
              ]}
              onPress={() => handleSelectAnswer(choice)}
              activeOpacity={0.7}
            >
              <View style={s.choiceRadio}>
                {selectedAnswer === choice && <View style={s.choiceRadioFilled} />}
              </View>
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
            <Text style={s.modalText}>{pick(lang, '정답: ' + currentQuestion.koCorrectSentence, 'Đáp án: ' + currentQuestion.koCorrectSentence)}</Text>
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

  textCard: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  subtitle: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 8 },
  viSentence: { fontSize: 16, fontWeight: '700', color: colors.ink, lineHeight: 24, textAlign: 'center' },

  choicesContainer: { marginBottom: 32 },
  choiceLabel: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
    gap: 12,
  },
  choiceButtonSelected: {
    backgroundColor: '#ECF5F4',
    borderColor: colors.teal,
  },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  choiceRadioFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal,
  },
  choiceText: { fontSize: 15, fontWeight: '600', color: colors.ink, flex: 1, lineHeight: 20 },
  choiceTextSelected: { color: colors.teal, fontWeight: '700' },

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
  modalText: { fontSize: 14, fontWeight: '600', color: colors.teal, marginBottom: 16, textAlign: 'center', lineHeight: 20 },
  modalBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
