/**
 * 실전평가 - 음성 발화 평가 (SpeakingEvalStage)
 * - 빈칸 채우기 + 음성 녹음
 * - 4단계 (1/4, 2/4, 3/4, 4/4)
 * - 공통 ActivityHeader, CtaButton 적용
 */
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

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

  const progressPct = ((currentIdx + 1) / questions.length) * 100;
  const isLastStep = currentIdx === questions.length - 1;

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
            {pick(lang, '실전평가', 'Đánh giá thực chiến')} · {currentQuestion.step}/{currentQuestion.totalSteps}
          </Text>
        </View>

        {/* 제목 */}
        <View style={s.titleBox}>
          <Text style={s.title}>{pick(lang, '빈칸을 채우고 말해 보세요', 'Hãy điền vào chỗ trống và nói')}</Text>
          <Text style={s.subtitle}>{pick(lang, '주어진 정보를 넣어 문장을 완성한 뒤, 소리 내어 읽으세요', 'Điền thông tin được cung cấp để hoàn thành câu, sau đó đọc to lên')}</Text>
        </View>

        {/* 안내 지문 */}
        <View style={s.guidanceBox}>
          <Text style={s.guidanceLabel}>{pick(lang, '안내:', 'Hướng dẫn:')}</Text>
          {currentQuestion.blanks.map((blank, idx) => (
            <View key={idx} style={s.guidanceItem}>
              <Text style={s.guidanceArrow}>◀</Text>
              <Text style={s.guidanceText}>{pick(lang, blank.placeholder, blank.placeholderVi)}</Text>
            </View>
          ))}
        </View>

        {/* 입력 필드 카드 */}
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
                  placeholderTextColor={colors.textDisabled}
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

        {/* 마이크 녹음 박스 */}
        <View style={s.recordingBox}>
          <View style={s.recordingControls}>
            <TouchableOpacity
              style={[s.micButton, isRecording && s.micButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
              activeOpacity={0.7}
            >
              <Text style={s.micIcon}>🎤</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.recordingHint}>
            {pick(lang, '마이크를 눌러 단어를 소리 내어 읽으세요', 'Nhấp vào micrô để đọc từ to lên')}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 액션 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, isLastStep ? '제출' : '다음  →', isLastStep ? 'Gửi' : 'Tiếp theo  →')}
          onPress={handleNext}
          disabled={!isInputComplete}
          size="lg"
        />
      </View>
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
  stepBox: {
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
  },
  titleBox: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 18,
  },
  guidanceBox: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
  },
  guidanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tealDark,
    marginBottom: spacing.xs,
  },
  guidanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  guidanceArrow: {
    fontSize: 10,
    color: colors.teal,
  },
  guidanceText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  sentenceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  sentenceViText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  blankFieldsContainer: {
    gap: spacing.md,
  },
  blankFieldGroup: {
    gap: spacing.xs,
  },
  blankLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  blankInput: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  blankSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  recordingBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
    borderWidth: 2,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  micButtonActive: {
    backgroundColor: colors.wrongLight,
    borderColor: colors.wrong,
  },
  micIcon: {
    fontSize: 28,
  },
  recordingHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
