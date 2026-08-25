/**
 * 실전평가 - 음성 발화 평가 (SpeakingEvalStage)
 * - 빈칸 채우기 + 음성 녹음
 * - 4단계 (1/4, 2/4, 3/4, 4/4)
 * - 다국어 지원
 */
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface BlankField {
  placeholder: string;
  placeholderVi: string;
}

interface Question {
  step: number;
  totalSteps: number;
  sentence: string;
  sentenceVi: string;
  blanks: BlankField[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function SpeakingEvalStage({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputs, setInputs] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const isInputComplete = inputs.length === currentQuestion.blanks.length && inputs.every(i => i.trim());

  const startRecording = async () => {
    if (Platform.OS !== 'web') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      mediaRecorder.start();
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(mediaRecorder.ondataavailable ? [mediaRecorder.ondataavailable] : [], { type: 'audio/wav' });
        console.log('Recording saved:', audioBlob);
      };
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleNext = () => {
    if (!isInputComplete) return;

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setInputs([]);
    } else {
      onNext?.();
    }
  };

  const isLastStep = currentIdx === questions.length - 1;
  const progressPct = (currentSetNumber / totalSets) * 100;

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 단계 표시 */}
        <View style={s.stepBox}>
          <Text style={s.stepText}>
            {pick(lang, `실전평가 · ${currentQuestion.step}/${currentQuestion.totalSteps}`, `Đánh giá thực tế · ${currentQuestion.step}/${currentQuestion.totalSteps}`)}
          </Text>
        </View>

        {/* 제목 */}
        <View style={s.titleBox}>
          <Text style={s.title}>{pick(lang, '빈칸을 채우고 말해 보세요', 'Hãy điền vào chỗ trống và nói')}</Text>
          <Text style={s.subtitle}>{pick(lang, '주어진 정보를 넣어 문장을 완성한 뒤, 소리 내어 읽으세요', 'Điền thông tin được cung cấp để hoàn thành câu, sau đó đọc to lên')}</Text>
        </View>

        {/* 베트남어 지문 */}
        <View style={s.guidanceBox}>
          <Text style={s.guidanceLabel}>{pick(lang, '안내:', 'Hướng dẫn:')}</Text>
          {currentQuestion.blanks.map((blank, idx) => (
            <View key={idx} style={s.guidanceItem}>
              <Text style={s.guidanceArrow}>◀</Text>
              <Text style={s.guidanceText}>{pick(lang, blank.placeholder, blank.placeholderVi)}</Text>
            </View>
          ))}
        </View>

        {/* 입력 필드들 */}
        <View style={s.sentenceCard}>
          <Text style={s.sentenceLabel}>{pick(lang, '한국어 문장:', 'Câu tiếng Hàn:')}</Text>
          <Text style={s.sentenceViText}>{currentQuestion.sentenceVi}</Text>

          <View style={s.blankFieldsContainer}>
            {currentQuestion.blanks.map((blank, idx) => (
              <View key={idx} style={s.blankFieldGroup}>
                <Text style={s.blankLabel}>
                  {pick(lang, blank.placeholder + '는 지는', blank.placeholderVi)}
                </Text>
                <TextInput
                  style={s.blankInput}
                  placeholder={pick(lang, '입력하세요', 'Nhập')}
                  placeholderTextColor={colors.muted}
                  value={inputs[idx] || ''}
                  onChangeText={(value) => handleInputChange(idx, value)}
                />
                <Text style={s.blankSubtext}>
                  {pick(lang, `국적: ${blank.placeholder}`, `Quốc tịch: ${blank.placeholderVi}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 마이크 버튼 + 안내 */}
        <View style={s.recordingBox}>
          <View style={s.recordingControls}>
            <TouchableOpacity style={s.smallBtn} activeOpacity={0.7}>
              <Text style={s.smallBtnText}>테스트</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.micButton, isRecording && s.micButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
              activeOpacity={0.7}
            >
              <Text style={s.micIcon}>🎤</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.smallBtn} activeOpacity={0.7}>
              <Text style={s.smallBtnText}>−</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.recordingHint}>
            {pick(lang, '마이크를 눌러 단어 소리 내어 읽으세요', 'Nhấp vào micrô để đọc từ to lên')}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, !isInputComplete && s.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isInputComplete}
          activeOpacity={0.8}
        >
          <Text style={s.nextBtnText}>
            {pick(lang, isLastStep ? '제출' : '다음', isLastStep ? 'Gửi' : 'Tiếp theo')} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', padding: 20 },

  stepBox: { marginBottom: 16 },
  stepText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  titleBox: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: '500', color: colors.muted, lineHeight: 18 },

  guidanceBox: {
    backgroundColor: '#F0FAFA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },
  guidanceLabel: { fontSize: 13, fontWeight: '700', color: colors.ink },
  guidanceItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  guidanceArrow: { fontSize: 12, fontWeight: '700', color: colors.teal, marginTop: 2 },
  guidanceText: { fontSize: 13, fontWeight: '600', color: colors.ink, flex: 1, lineHeight: 18 },

  sentenceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sentenceLabel: { fontSize: 13, fontWeight: '700', color: colors.muted, marginBottom: 6 },
  sentenceViText: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 14, lineHeight: 20 },

  blankFieldsContainer: { gap: 12 },
  blankFieldGroup: { marginBottom: 4 },
  blankLabel: { fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  blankInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.line,
    marginBottom: 4,
  },
  blankSubtext: { fontSize: 11, fontWeight: '500', color: colors.muted },

  recordingBox: { alignItems: 'center', marginBottom: 24 },
  recordingControls: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  smallBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBtnText: { fontSize: 18, fontWeight: '600', color: colors.ink },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.teal,
  },
  micButtonActive: { backgroundColor: '#00857F', borderColor: '#00857F' },
  micIcon: { fontSize: 32 },
  recordingHint: { fontSize: 12, fontWeight: '500', color: colors.muted, textAlign: 'center' },

  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  nextBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#D1D5DB' },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
