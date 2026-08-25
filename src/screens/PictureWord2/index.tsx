/**
 * 이미지 보고 단어 선택 (PictureWord2)
 * - 이미지 표시
 * - 단어 선택지
 * - 정답/오답 피드백
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  desc: string;
  imageUrl?: string;
  answer: string;
  words: string[];
  viText?: string;
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
}

export function PictureWord2({ questions = [], onNext, onBack }: Props) {
  const { lang } = useLang();
  const sfx = useSfx();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<'correct' | 'wrong' | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const handleSelect = (word: string, idx: number) => {
    if (showModal) return;

    const isCorrect = word === currentQuestion.answer;
    setSelectedIdx(idx);
    setSelectedState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (selectedState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedIdx(null);
        setSelectedState(null);
      } else {
        onNext?.();
      }
    }
  };

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 질문 제목 */}
        <Text style={s.title}>{currentQuestion.desc}</Text>

        {/* 이미지 */}
        {currentQuestion.imageUrl && (
          <View style={s.imageBox}>
            <Image
              source={{ uri: currentQuestion.imageUrl }}
              style={s.image}
              resizeMode="contain"
            />
          </View>
        )}

        {/* 단어 선택지 */}
        <View style={s.cardGrid}>
          {currentQuestion.words.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                s.card,
                selectedIdx === idx && (selectedState === 'correct' ? s.cardCorrect : s.cardWrong),
              ]}
              onPress={() => handleSelect(word, idx)}
              disabled={showModal}
              activeOpacity={0.7}
            >
              <Text style={s.cardText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 정답/오답 모달 */}
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>
              {selectedState === 'correct' ? '✅ 정답입니다!' : '❌ 오답입니다'}
            </Text>
            <Text style={s.modalAnswer}>{currentQuestion.answer}</Text>
            {currentQuestion.viText && (
              <Text style={s.modalViText}>{currentQuestion.viText}</Text>
            )}
            <TouchableOpacity
              style={s.modalBtn}
              onPress={handleCloseModal}
              activeOpacity={0.8}
            >
              <Text style={s.modalBtnText}>
                {selectedState === 'correct' ? '다음' : '다시 시도'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 하단 버튼 */}
      <View style={s.bottomBar}>
        {onBack && (
          <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={s.backBtnText}>{pick(lang, '돌아가기', 'Quay lại')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },

  title: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 20 },

  imageBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: { width: '100%', height: '100%' },

  cardGrid: { gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
  },
  cardCorrect: { backgroundColor: '#ecfdf5', borderColor: '#10b981' },
  cardWrong: { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
  cardText: { fontSize: 16, fontWeight: '600', color: colors.ink },

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
  modalAnswer: { fontSize: 20, fontWeight: '800', color: colors.teal, marginBottom: 6 },
  modalViText: { fontSize: 13, color: colors.muted, marginBottom: 16 },
  modalBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  bottomBar: { padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line },
  backBtn: { paddingVertical: 12, alignItems: 'center' },
  backBtnText: { fontSize: 14, fontWeight: '700', color: colors.teal },

  container: { flex: 1, backgroundColor: colors.canvas },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', padding: 20 },
});
