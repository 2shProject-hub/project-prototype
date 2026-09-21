import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, radius, shadow } from '../../theme';
import { MOCK_COMPREHENSIVE_SPEAKING } from '../../data/lessonData';
import type { ComprehensiveSpeakingData } from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');

type Step = 1 | 2 | 3;

interface Props {
  data?: ComprehensiveSpeakingData;
  onComplete: (isCorrect: boolean) => void;
  onBack: () => void;
}

function calcSimilarity(userText: string, answer: string): number {
  const norm = (s: string) => s.replace(/[\s.,!?。]/g, '');
  const a = norm(answer);
  const b = norm(userText);
  if (!a.length) return 0;
  const pool = [...b];
  let matched = 0;
  for (const ch of [...a]) {
    const idx = pool.indexOf(ch);
    if (idx !== -1) { matched++; pool.splice(idx, 1); }
  }
  return Math.min(100, Math.round((matched / a.length) * 100));
}

export function ComprehensiveSpeakingStage({
  data = MOCK_COMPREHENSIVE_SPEAKING,
  onComplete,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [similarity, setSimilarity] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // ── Step 1: 튜터 안내 오디오 자동 재생 ─────────────────────────
  useEffect(() => {
    if (step !== 1 || Platform.OS !== 'web' || !data.tutorAudioUri) return;
    const timer = setTimeout(() => {
      try {
        const audio = new Audio(data.tutorAudioUri as string);
        introAudioRef.current = audio;
        audio.play().catch(() => {});
        setIsPlayingIntro(true);
        audio.onended = () => setIsPlayingIntro(false);
      } catch {}
    }, 300);
    return () => {
      clearTimeout(timer);
      introAudioRef.current?.pause();
      introAudioRef.current = null;
      setIsPlayingIntro(false);
    };
  }, [step]);

  // ── Step 2: 대화문 오디오 자동 재생 ─────────────────────────────
  useEffect(() => {
    if (step !== 2 || Platform.OS !== 'web' || !data.dialogue.audioUri) return;
    const audio = new Audio(data.dialogue.audioUri as string);
    dialogueAudioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); dialogueAudioRef.current = null; };
  }, [step]);

  const handleReplayIntro = () => {
    if (Platform.OS !== 'web' || !data.tutorAudioUri) return;
    introAudioRef.current?.pause();
    try {
      const audio = new Audio(data.tutorAudioUri as string);
      introAudioRef.current = audio;
      audio.play().catch(() => {});
      setIsPlayingIntro(true);
      audio.onended = () => setIsPlayingIntro(false);
    } catch {}
  };

  const handleConfirmIntro = () => {
    introAudioRef.current?.pause();
    introAudioRef.current = null;
    setIsPlayingIntro(false);
    setStep(2);
  };

  const replayDialogueAudio = () => {
    if (Platform.OS !== 'web' || !data.dialogue.audioUri) return;
    if (!dialogueAudioRef.current) dialogueAudioRef.current = new Audio(data.dialogue.audioUri as string);
    dialogueAudioRef.current.currentTime = 0;
    dialogueAudioRef.current.play().catch(() => {});
  };

  const handleSpeechResult = (text: string) => {
    setIsListening(false);
    const speech = text.trim() || pick(lang, '(인식 실패)', '(Không nhận diện được)');
    setUserSpeech(speech);
    setSimilarity(text.trim() ? calcSimilarity(text, data.correctAnswer) : 0);
    setStep(3);
  };

  const startSTT = () => {
    if (Platform.OS !== 'web') return;
    dialogueAudioRef.current?.pause();
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      handleSpeechResult(data.correctAnswer); // ponytail: STT 미지원 브라우저용 모의 결과
      return;
    }
    setIsListening(true);
    const rec = new SR();
    rec.lang = 'ko-KR';
    rec.interimResults = false;
    rec.onresult = (e: any) => handleSpeechResult(e.results[0][0].transcript);
    rec.onerror = () => handleSpeechResult('');
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const onRetry = () => {
    recognitionRef.current?.abort();
    setUserSpeech('');
    setSimilarity(0);
    setIsListening(false);
    setStep(2);
  };

  const percentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={percentage} onClose={onBack} />

      {/* ── Step 2 본 화면 (항상 렌더링) ─────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={step !== 1}
      >
        {/* 대화문 카드 */}
        <View style={[s.dialogueCard, shadow.soft]}>
          <View style={s.dialogueBody}>
            <Text style={s.dialogueKo}>{data.dialogue.ko}</Text>
            <Text style={s.dialogueVi}>{data.dialogue.vi}</Text>
          </View>
          <TouchableOpacity style={s.dialogueSpeakerBtn} onPress={replayDialogueAudio} activeOpacity={0.7}>
            <Text style={s.speakerIcon}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* 미션 카드 */}
        <View style={s.missionCard}>
          <Text style={s.missionCardTitle}>
            {pick(lang, data.missionTitle.ko ?? '', data.missionTitle.vi ?? '')}
          </Text>
          <Text style={s.missionCardSub}>
            {pick(lang, data.missionTitle.vi ?? '', data.missionTitle.ko ?? '')}
          </Text>
          <View style={s.answerLines}>
            {data.answerViLines.map((line, i) => (
              <Text key={i} style={s.answerViText}>{line}</Text>
            ))}
          </View>
          <View style={s.chipsRow}>
            {data.answerChips.map(chip => (
              <View key={String(chip.id)} style={s.chip}>
                <Text style={s.chipText}>{chip.text}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* 마이크 영역 — 화면 하단 고정 */}
      <View style={s.micFooter}>
        <Text style={s.micLabel}>
          {isListening
            ? pick(lang, '듣고 있어요...', 'Đang nghe...')
            : pick(lang, '탭하여 말하기', 'Nhấn để nói')}
        </Text>
        <TouchableOpacity
          style={[s.micBtn, isListening && s.micBtnActive]}
          onPress={startSTT}
          activeOpacity={0.8}
          disabled={step !== 2}
        >
          <Text style={s.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* ── Step 1: dim 오버레이 (Video Bridge 패턴) ─────────────── */}
      {step === 1 && (
        <View style={s.dimOverlay}>
          {/* 상단 배지 */}
          <View style={s.badgeWrap}>
            <Text style={s.badgeText}>
              {pick(lang, '종합 말하기 미션', 'Nhiệm vụ luyện nói')}
            </Text>
          </View>

          {/* 하단: 말풍선 + 튜터 이미지 + 확인 버튼 */}
          <View style={s.introContent}>
            <View style={s.introTutorRow}>
              {/* 말풍선 (스피커 버튼 포함) */}
              <View style={s.bubbleCard}>
                <Text style={s.bubbleText}>
                  {pick(lang, data.tutorText.ko ?? '', data.tutorText.vi ?? '')}
                </Text>
                <TouchableOpacity
                  style={[s.speakerBtn, isPlayingIntro && s.speakerBtnPlaying]}
                  onPress={handleReplayIntro}
                  activeOpacity={0.8}
                >
                  <Text style={s.speakerIcon}>🔊</Text>
                </TouchableOpacity>
              </View>

              {/* AI 튜터 이미지 */}
              <Image source={TUTOR_IMAGE} style={s.tutorImage} resizeMode="contain" />
            </View>

            {/* 확인 버튼 */}
            <TouchableOpacity style={s.confirmBtn} onPress={handleConfirmIntro} activeOpacity={0.9}>
              <Text style={s.confirmBtnText}>
                {pick(lang, '확인', 'Xác nhận')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Step 3: 피드백 바텀시트 ──────────────────────────────── */}
      {step === 3 && (
        <View style={s.feedbackOverlay}>
          <View style={s.feedbackSheet}>
            <View style={s.resultHeaderRow}>
              <Text style={s.speechLabel}>
                {pick(lang, '내 답변', 'Câu trả lời của tôi')}
              </Text>
              <View style={[s.speakerBtn, { opacity: 0.35 }]}>
                <Text style={s.speakerIcon}>🔊</Text>
              </View>
            </View>
            <View style={s.speechResultBox}>
              <Text style={s.speechResultText}>{userSpeech}</Text>
            </View>

            <Text style={s.modelLabel}>
              {pick(lang, '정답', 'Đáp án mẫu')}
            </Text>
            <View style={s.modelAnswerBox}>
              <Text style={s.modelAnswerText}>{data.correctAnswer}</Text>
              <Text style={s.similarityText}>
                {pick(
                  lang,
                  `일치율 ${similarity}%`,
                  `Câu trả lời của bạn khớp ${similarity}% với đáp án mẫu.`,
                )}
              </Text>
            </View>

            <View style={s.feedbackBtnRow}>
              <TouchableOpacity style={s.retryBtn} onPress={onRetry} activeOpacity={0.8}>
                <Text style={s.retryBtnText}>{pick(lang, '다시풀기', 'Làm lại')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.nextBtn}
                onPress={() => onComplete(similarity >= 80)}
                activeOpacity={0.8}
              >
                <Text style={s.nextBtnText}>{pick(lang, '다음 →', 'Tiếp theo →')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },

  // ── Step 2 ─────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 16 },
  dialogueCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: 16, gap: 10,
    borderWidth: 1, borderColor: colors.line,
  },
  dialogueBody: { flex: 1, gap: 4 },
  dialogueKo: { fontSize: 15, fontWeight: '600', color: colors.ink, lineHeight: 24 },
  dialogueVi: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  dialogueSpeakerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.tealSoft,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  missionCard: {
    borderWidth: 1.5, borderColor: colors.teal,
    borderRadius: radius.md, backgroundColor: colors.surface,
    padding: 16, gap: 10,
  },
  missionCardTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  missionCardSub: { fontSize: 12, color: colors.muted },
  answerLines: { gap: 4 },
  answerViText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.pill, backgroundColor: colors.tealSoft,
    borderWidth: 1, borderColor: colors.teal,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.teal },
  micFooter: {
    alignItems: 'center', gap: 12,
    paddingTop: 16, paddingBottom: 28,
    backgroundColor: colors.canvas,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  micLabel: { fontSize: 13, color: colors.muted },
  micBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: colors.tealDark },
  micIcon: { fontSize: 28 },

  // ── Step 1: Dim 오버레이 (Video Bridge 패턴) ───────────────────
  dimOverlay: {
    // @ts-ignore — absoluteFillObject 타입 정의 누락 (Expo 57 알려진 이슈)
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  badgeWrap: {
    alignSelf: 'center',
    backgroundColor: '#D7F8F7',
    paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  badgeText: { fontSize: 20, fontWeight: '800', color: colors.teal, letterSpacing: -0.3 },
  introContent: { width: '100%', gap: 16 },
  introTutorRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10, width: '100%',
  },
  bubbleCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 20,
    paddingVertical: 18, paddingLeft: 18, paddingRight: 52,
    minHeight: 96, position: 'relative', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 5,
  },
  bubbleText: { fontSize: 15, fontWeight: '700', color: '#111111', lineHeight: 23 },
  speakerBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#D7F8F7',
    alignItems: 'center', justifyContent: 'center',
  },
  speakerBtnPlaying: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 18 },
  tutorImage: { width: 88, height: 122, flexShrink: 0 },
  confirmBtn: {
    backgroundColor: colors.teal, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  confirmBtnText: { color: colors.textWhite, fontSize: 18, fontWeight: '700' },

  // ── Step 3: 피드백 바텀시트 ───────────────────────────────────
  feedbackOverlay: {
    // @ts-ignore — absoluteFillObject 타입 정의 누락 (Expo 57 알려진 이슈)
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,48,61,0.45)',
    justifyContent: 'flex-end',
    zIndex: 30,
  },
  feedbackSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 12,
  },
  resultHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  speechLabel: { fontSize: 13, fontWeight: '700', color: colors.speechResultText },
  speechResultBox: { backgroundColor: colors.speechResultBg, borderRadius: radius.md, padding: 12 },
  speechResultText: { fontSize: 14, color: colors.ink, lineHeight: 22 },
  modelLabel: { fontSize: 13, fontWeight: '700', color: colors.modelAnswerText, marginTop: 4 },
  modelAnswerBox: { backgroundColor: colors.modelAnswerBg, borderRadius: radius.md, padding: 12, gap: 6 },
  modelAnswerText: { fontSize: 14, color: colors.ink, lineHeight: 22 },
  similarityText: { fontSize: 13, fontWeight: '700', color: colors.modelAnswerText },
  feedbackBtnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  retryBtn: {
    flex: 1, height: 48, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
  },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: colors.teal },
  nextBtn: {
    flex: 2, height: 48, borderRadius: radius.md,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: colors.textWhite },
});
