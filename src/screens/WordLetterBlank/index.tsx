/**
 * 소리를 듣고 빈칸을 채우기 (WordLetterBlank)
 * - 프로그레스바 헤더
 * - 1번 세트에서 베트남어 안내 토스트 팝업 및 자동 음원 재생
 * - 음성 재생 버튼
 * - 빈칸 채우기 보드
 * - 글자 타일
 * - 정답/오답 피드백
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';
import { ActivityHeader } from '../../components/ActivityHeader';

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

export function WordLetterBlank({ questions = [], onNext, onBack, currentSetNumber = 1, totalSets = 1 }: Props) {
  const { lang } = useLang();
  const sfx = useSfx();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastAudioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<'correct' | 'wrong' | null>(null);
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
    const isCorrect = userAnswer === currentQuestion.answer;

    setModalState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (modalState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedTiles([]);
        setUsedTileIndices(new Set());
        setModalState(null);
      } else {
        onNext?.();
      }
    }
  };

  const handleReset = () => {
    setSelectedTiles([]);
    setUsedTileIndices(new Set());
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
          <Text style={s.title}>{pick(lang, '소리를 듣고 빈칸을 채우세요', 'Hãy nghe đoạn âm thanh rồi điền vào chỗ trống nhé')}</Text>
          <Text style={s.subtitle}>{pick(lang, 'Hãy nghe đoạn âm thanh rồi điền vào chỗ trống nhé', '소리를 듣고 빈칸을 채우세요')}</Text>
        </View>

        {/* 음성 재생 버튼 */}
        <View style={s.audioBtnContainer}>
          <TouchableOpacity
            style={[s.audioBtn, isPlaying && s.audioBtnPlaying]}
            onPress={playAudio}
            disabled={!currentQuestion.audioUrl}
            activeOpacity={0.7}
          >
            <Text style={s.audioBtnIcon}>{isPlaying ? '🔊' : '🔈'}</Text>
          </TouchableOpacity>
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
        <View style={[s.boardContainer, showToast && currentSetNumber === 1 && s.boardContainerWithToast]}>
          <Text style={s.boardText}>{currentQuestion.displayFormat}</Text>
          <View style={s.slotsContainer}>
            {currentQuestion.slots.map((slot, idx) => (
              <TouchableOpacity
                key={idx}
                style={s.slot}
                onPress={() => handleRemoveTile(idx)}
                disabled={selectedTiles[idx] === undefined}
              >
                <Text style={s.slotText}>{selectedTiles[idx] || slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 글자 타일 */}
        <View style={s.tilesContainer}>
          {currentQuestion.tiles.map((tile, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                s.tile,
                usedTileIndices.has(idx) && s.tileUsed,
              ]}
              onPress={() => handleSelectTile(idx)}
              disabled={usedTileIndices.has(idx)}
              activeOpacity={0.7}
            >
              <Text style={[s.tileText, usedTileIndices.has(idx) && s.tileTextUsed]}>
                {tile}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 초기화 버튼 */}
        {selectedTiles.length > 0 && (
          <TouchableOpacity style={s.resetBtn} onPress={handleReset} activeOpacity={0.7}>
            <Text style={s.resetBtnText}>{pick(lang, '초기화', 'Làm lại')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.confirmBtn, selectedTiles.length !== currentQuestion.slots.length && s.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={selectedTiles.length !== currentQuestion.slots.length}
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

  audioBtnContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  audioBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  audioBtnPlaying: { backgroundColor: '#0d9488' },
  audioBtnIcon: { fontSize: 32 },

  boardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.teal,
    marginBottom: 16,
  },
  boardContainerWithToast: { marginTop: 12 },
  boardText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  slot: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },

  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  tile: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 48,
    alignItems: 'center',
  },
  tileUsed: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  tileText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  tileTextUsed: {
    color: '#9ca3af',
  },

  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
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
