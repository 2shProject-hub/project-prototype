import { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { SESSION1, STAGE_ORDER, STAGE_LABELS, MOCK_ADMIN_WORDBOOK_ACTIVITY } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

let QUIZ_ENTRY_AUDIO: string | null = null;
try {
  QUIZ_ENTRY_AUDIO = require('../../../assets/sounds/tutor_word_6.wav') as string;
} catch {
  QUIZ_ENTRY_AUDIO = null;
}

export function VocabWordbookStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const sfx = useSfx();

  const [isNavigating, setIsNavigating] = useState(false);
  const quizAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleQuizEntry = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    sfx.play();

    if (Platform.OS !== 'web') {
      onNext();
      return;
    }

    try {
      const audio = new Audio(QUIZ_ENTRY_AUDIO);
      audio.volume = 0.9;
      quizAudioRef.current = audio;
      audio.play().catch(() => { onNext(); });
      audio.onended = () => { onNext(); };
    } catch {
      onNext();
    }
  };

  const activityData = MOCK_ADMIN_WORDBOOK_ACTIVITY;
  const words = activityData.questions.map(q => {
    const item = q.questionItems.find(i => i.itemCd === 'speaking_word') || {};
    return {
      ko: item.extra2 || '',
      vi: item.extra3 || '',
      audio: item.extra1 || '',
    };
  });
  const [tab, setTab] = useState<'all' | 'ko' | 'vi'>('all');
  const [speed, setSpeed] = useState<0.5 | 1.0 | 1.5>(1.0);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  
  // 발음 평가 상태
  const [showPronModal, setShowPronModal] = useState(false);
  const [pronIdx, setPronIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState<any>(null);
  
  // 모의 발음 결과 모달
  const [showResultModal, setShowResultModal] = useState(false);
  const [mockScore, setMockScore] = useState({ accuracy: 0, fluency: 0, completeness: 0, average: 0 });

  // Web Speech API를 활용한 한국어 단어 발음 재생 (배속 제어)
  const speakKo = (text: string) => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`[Sound Playback] Text: "${text}", Speed: ${speed}x`);
    }
  };

  // 녹음 시작 시뮬레이션
  const startRecording = () => {
    setIsRecording(true);
    const timer = setTimeout(() => {
      stopRecording();
    }, 1800); // 1.8초간 녹음 모사
    setRecordingTimer(timer);
  };

  // 녹음 완료 및 랜덤 점수 생성
  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer) clearTimeout(recordingTimer);
    
    // 점수 생성 (75 ~ 98점 범위)
    const accuracy = Math.floor(Math.random() * 24) + 75;
    const fluency = Math.floor(Math.random() * 24) + 75;
    const completeness = Math.floor(Math.random() * 15) + 84;
    const average = Math.round((accuracy + fluency + completeness) / 3);

    setMockScore({ accuracy, fluency, completeness, average });
    setShowResultModal(true);
  };

  const handleNextPron = () => {
    setShowResultModal(false);
    if (pronIdx < words.length - 1) {
      setPronIdx(prev => prev + 1);
    } else {
      // 모든 단어 평가 완료
      setShowPronModal(false);
      alert(pick(lang, '모든 단어의 발음 평가가 완료되었습니다!', 'Đã hoàn thành đánh giá phát âm của tất cả các từ!'));
    }
  };

  const progressPct = (2 / STAGE_ORDER.length) * 100;

  return (
    <View style={styles.screen}>
      {/* ── Activity Header ── */}
      <View style={styles.header}>
        <View style={styles.progressCenter}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as `${number}%` }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* ── 콘텐츠 ── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>오늘의 단어</Text>
        </View>

        <View style={styles.introBlock}>
          <Text style={styles.introTitle}>{pick(lang, activityData.title, activityData.titleVi)}</Text>
          <Text style={styles.introSub}>단어의 철자, 발음, 뜻을 학습해요.</Text>
        </View>

        {/* 배속 조절 컨트롤러 */}
        <View style={styles.speedRow}>
          <Text style={styles.speedLabel}>재생 배속</Text>
          <TouchableOpacity
            style={styles.speedToggle}
            onPress={() => { sfx.play(); setShowSpeedPicker(p => !p); }}
            activeOpacity={0.7}
          >
            <Text style={styles.speedToggleText}>{speed.toFixed(1)}x</Text>
          </TouchableOpacity>
        </View>

        {showSpeedPicker && (
          <View style={styles.speedPicker}>
            {([0.5, 1.0, 1.5] as const).map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.speedOption, speed === s && styles.speedOptionActive]}
                onPress={() => { sfx.play(); setSpeed(s); setShowSpeedPicker(false); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.speedOptionText, speed === s && styles.speedOptionTextActive]}>
                  {s.toFixed(1)}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 3개 보기 모드 탭 */}
        <View style={styles.tabList} role="tablist">
          <TouchableOpacity
            style={[styles.tabItem, tab === 'all' && styles.tabItemActive]}
            onPress={() => { sfx.play(); setTab('all'); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>전체 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, tab === 'ko' && styles.tabItemActive]}
            onPress={() => { sfx.play(); setTab('ko'); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'ko' && styles.tabTextActive]}>한국어 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, tab === 'vi' && styles.tabItemActive]}
            onPress={() => { sfx.play(); setTab('vi'); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'vi' && styles.tabTextActive]}>베트남어 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 단어 목록 */}
        <View style={styles.wordList}>
          {words.map((w, idx) => (
            <View key={idx} style={styles.wordRow}>
              <View style={styles.wordTextContainer}>
                {tab !== 'vi' && <Text style={styles.wordKo}>{w.ko}</Text>}
                {tab !== 'ko' && <Text style={styles.wordVi}>{w.vi}</Text>}
              </View>
              <TouchableOpacity
                style={styles.speakerBtn}
                onPress={() => speakKo(w.ko)}
                activeOpacity={0.7}
              >
                <Text style={styles.speakerIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── 하단 CTA 버튼 2개 ── */}
      <View style={styles.footer}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.teal, flex: 1.2 }]}
            onPress={() => {
              sfx.play();
              setPronIdx(0);
              setShowPronModal(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>단어 발음하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaBtn, { flex: 1 }, isNavigating
              ? { backgroundColor: colors.line, borderColor: colors.line, borderWidth: 1 }
              : { backgroundColor: '#FFFFFF', borderColor: colors.line, borderWidth: 1 }
            ]}
            onPress={handleQuizEntry}
            activeOpacity={isNavigating ? 1 : 0.85}
            disabled={isNavigating}
          >
            <Text style={[styles.ctaBtnText, { color: isNavigating ? colors.muted : colors.ink }]}>바로 문제 풀기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 1. 단어 발음 평가 모달 (Source A 구현 재현) ── */}
      <Modal visible={showPronModal} animationType="slide" transparent={false}>
        <View style={styles.pronModalContainer}>
          {/* 모달 헤더 */}
          <View style={styles.header}>
            <View style={styles.progressCenter}>
              <Text style={styles.progressTitle}>발음 평가 ({pronIdx + 1}/{words.length})</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPronModal(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 모달 내용 */}
          <View style={styles.pronContent}>
            <View style={styles.pronCard}>
              <Text style={styles.pronCardEmoji}>📖</Text>
              <View style={styles.pronWordRow}>
                <TouchableOpacity style={styles.pronSpeaker} onPress={() => speakKo(words[pronIdx].ko)} activeOpacity={0.7}>
                  <Text style={styles.pronSpeakerEmoji}>🔊</Text>
                </TouchableOpacity>
                <Text style={styles.pronWordKo}>{words[pronIdx].ko}</Text>
              </View>
              <Text style={styles.pronWordVi}>{words[pronIdx].vi}</Text>
            </View>
          </View>

          {/* 모달 하단 마이크 조작영역 */}
          <View style={styles.pronFooter}>
            <TouchableOpacity style={styles.skipBtn} onPress={() => { sfx.play(); handleNextPron(); }}>
              <Text style={styles.skipText}>발음 평가를 하기 어려운 상황이에요</Text>
              <Text style={styles.skipLink}>건너뛰기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.micBtn, isRecording && styles.micBtnRecording]}
              onPress={() => { sfx.play(); isRecording ? stopRecording() : startRecording(); }}
              activeOpacity={0.8}
            >
              <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
            </TouchableOpacity>
            <Text style={styles.micHelpText}>
              {isRecording ? '녹음 중입니다... (말씀을 마친 뒤 다시 눌러주세요)' : '마이크를 눌러 단어를 소리 내어 읽어주세요'}
            </Text>
          </View>
        </View>

        {/* ── 2. 모의 발음 평가 결과 모달 (PronSimpleModal 재현) ── */}
        <Modal visible={showResultModal} transparent animationType="fade">
          <View style={styles.resultBackdrop}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>발음 평가 결과</Text>
              <Text style={styles.resultScoreNum}>{mockScore.average}점</Text>
              
              <View style={styles.scoreRow}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>정확도</Text>
                  <Text style={styles.scoreVal}>{mockScore.accuracy}점</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>유창성</Text>
                  <Text style={styles.scoreVal}>{mockScore.fluency}점</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>완성도</Text>
                  <Text style={styles.scoreVal}>{mockScore.completeness}점</Text>
                </View>
              </View>

              <View style={styles.resultActionRow}>
                <TouchableOpacity
                  style={[styles.resultBtn, { backgroundColor: '#e2f4f4' }]}
                  onPress={() => { sfx.play(); setShowResultModal(false); }}
                >
                  <Text style={[styles.resultBtnText, { color: colors.teal }]}>다시 발음</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.resultBtn, { backgroundColor: colors.teal }]}
                  onPress={() => { sfx.play(); handleNextPron(); }}
                >
                  <Text style={[styles.resultBtnText, { color: '#ffffff' }]}>다음 단어</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' },
  progressCenter: { flex: 1, paddingHorizontal: 52, justifyContent: 'center' },
  progressTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  progressTrack: { height: 6, backgroundColor: '#E0E4E8', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 3 },
  closeBtn: { position: 'absolute', right: 12, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 18, color: '#3D4B57', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 14 },
  stageBadge: { alignSelf: 'flex-start', backgroundColor: colors.tealSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  stageBadgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  introBlock: { gap: 4, marginBottom: 4 },
  introTitle: { fontSize: 24, fontWeight: '800', color: colors.ink },
  introSub: { fontSize: 14, color: colors.muted },
  
  // 재생 배속
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eef2f3',
    marginVertical: 4,
  },
  speedLabel: { fontSize: 13, fontWeight: '600', color: colors.ink },
  speedToggle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
    flexShrink: 0,
  },
  speedToggleText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  // ── Speed Picker ──
  speedPicker: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#F5F8F8',
  },
  speedOptionActive: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  speedOptionText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  speedOptionTextActive: { color: colors.teal },

  // 탭 목록
  tabList: { flexDirection: 'row', gap: 8, marginVertical: 6 },
  tabItem: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fcfcfc', alignItems: 'center' },
  tabItemActive: { borderColor: colors.teal, backgroundColor: '#ffffff' },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  tabTextActive: { color: colors.teal, fontWeight: '700' },

  // 단어 리스트
  wordList: { gap: 10 },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderWidth: 1, borderColor: '#eff3f5', borderRadius: 14, backgroundColor: '#ffffff' },
  wordTextContainer: { flex: 1, gap: 3 },
  wordKo: { fontSize: 16, fontWeight: '700', color: colors.ink },
  wordVi: { fontSize: 13, color: colors.muted },
  speakerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fbfb', alignItems: 'center', justifyContent: 'center' },
  speakerIcon: { fontSize: 16 },

  // 하단 버튼 구성
  footer: { padding: 16, paddingBottom: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#f0f3f5' },
  btnRow: { flexDirection: 'row', gap: 10 },
  ctaBtn: { borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // 발음 평가 모달
  pronModalContainer: { flex: 1, backgroundColor: '#F5F8F8' },
  pronContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  pronCard: { backgroundColor: '#ffffff', borderRadius: 24, paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#e2eaec' },
  pronCardEmoji: { fontSize: 48 },
  pronWordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pronSpeaker: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2f4f4', alignItems: 'center', justifyContent: 'center' },
  pronSpeakerEmoji: { fontSize: 14 },
  pronWordKo: { fontSize: 24, fontWeight: '850', color: colors.ink },
  pronWordVi: { fontSize: 16, color: colors.muted },
  pronFooter: { padding: 24, alignItems: 'center', gap: 14, backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  skipBtn: { alignItems: 'center', marginBottom: 8 },
  skipText: { fontSize: 12, color: colors.muted },
  skipLink: { fontSize: 13, color: colors.teal, fontWeight: '700', textDecorationLine: 'underline', marginTop: 2 },
  micBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#e2f4f4' },
  micBtnRecording: { backgroundColor: colors.red, borderColor: '#fdebeb' },
  micIcon: { fontSize: 28 },
  micHelpText: { fontSize: 12, color: colors.muted, textAlign: 'center' },

  // 결과 오버레이 모달
  resultBackdrop: { flex: 1, backgroundColor: 'rgba(4, 48, 61, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  resultCard: { width: '100%', maxWidth: 320, backgroundColor: '#ffffff', borderRadius: 24, padding: 24, alignItems: 'center', gap: 18 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: colors.muted },
  resultScoreNum: { fontSize: 36, fontWeight: '850', color: colors.teal },
  scoreRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 8 },
  scoreItem: { alignItems: 'center', gap: 4 },
  scoreLabel: { fontSize: 12, color: colors.muted },
  scoreVal: { fontSize: 14, fontWeight: '700', color: colors.ink },
  resultActionRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 6 },
  resultBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultBtnText: { fontSize: 14, fontWeight: '700' }
});
