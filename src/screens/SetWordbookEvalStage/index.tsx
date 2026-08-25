/**
 * 단어장과 발음평가 (SetWordbookEvalStage)
 *
 * ■ 템플릿 구성 (첨부 이미지 기준 1:1 완벽 구현)
 *   1. 상단 배지: "단어장 1/3" (세트 번호에 따라 "단어장 1/3", "단어장 2/3", "단어장 3/3")
 *   2. 타이틀: "핵심 어휘를 확인해요."
 *   3. 서브텍스트: "Đây là thông tin quan trọng."
 *   4. 안내(토스트) 팝업 (Set 1에만 노출):
 *      - 텍스트: "Xem nghĩa và cách phát âm của từng từ. Bấm vào từ để tự luyện phát âm luôn nhé."
 *      - 우측 하단 스피커 아이콘: 반복 재생 가능
 *      - 우측 상단 [✕] 버튼: 닫기 시 기존 재생 배속(0.5x, 1.0x, 1.5x) 노출
 *   5. 3단 보기 모드 탭: "전체 보기" | "한국어 보기" | "베트남어 보기"
 *   6. 단어 목록 (Min 1 ~ Max 5개 어휘 카드):
 *      - 한국어 단어, 베트남어 번역, 스피커 음원 재생 버튼
 *   7. 하단 고정 2단 버튼:
 *      - 좌측: [단어 발음하기] (Teal 배경) ➔ 발음 평가 모달 실행
 *      - 우측: [세트 문제 풀기] (White 배경 / 테두리) ➔ 다음 템플릿(onNext) 이동
 */
import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, Platform, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';

interface Props {
  setNumber?: 1 | 2 | 3;
  totalSets?: number;
  onNext: () => void;
  onBack?: () => void;
}

// 세트별 어휘 데이터 (Min 1 ~ Max 5개 어휘)
const SET_WORDS_DATA: Record<number, Array<{ id: number; ko: string; vi: string }>> = {
  1: [
    { id: 1, ko: '베트남', vi: 'Việt Nam' },
    { id: 2, ko: '한국', vi: 'Hàn Quốc' },
    { id: 3, ko: '인도네시아', vi: 'Indonesia' },
    { id: 4, ko: '러시아', vi: 'Nga' },
  ],
  2: [
    { id: 5, ko: '사람', vi: 'người' },
    { id: 6, ko: '학생', vi: 'học sinh' },
    { id: 7, ko: '선생님', vi: 'giáo viên' },
    { id: 8, ko: '회사원', vi: 'nhân viên công ty' },
    { id: 9, ko: '의사', vi: 'bác sĩ' },
  ],
  3: [
    { id: 10, ko: '가수', vi: 'ca sĩ' },
    { id: 11, ko: '요리사', vi: 'đầu bếp' },
    { id: 12, ko: '친구', vi: 'bạn bè' },
    { id: 13, ko: '나라', vi: 'quốc gia' },
    { id: 14, ko: '이름', vi: 'tên' },
  ],
};

export function SetWordbookEvalStage({
  setNumber = 1,
  totalSets = 3,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();

  const words = SET_WORDS_DATA[setNumber] || SET_WORDS_DATA[1];

  const [tab, setTab] = useState<'all' | 'ko' | 'vi'>('all');
  const [speed, setSpeed] = useState<0.5 | 1.0 | 1.5>(1.0);

  // Set 1 안내 토스트 팝업 상태
  const [showToast, setShowToast] = useState(setNumber === 1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 음원 파일 재생
  const playToastAudio = () => {
    if (Platform.OS !== 'web') return;

    try {
      const audioSrc = require('../../../assets/sounds/word_set_1.mp3');
      if (!audioSrc) return;

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setIsAudioPlaying(true);

      audio.play().catch(() => {
        setIsAudioPlaying(false);
      });

      audio.onended = () => {
        setIsAudioPlaying(false);
      };

      audio.onerror = () => {
        setIsAudioPlaying(false);
      };
    } catch (e) {
      setIsAudioPlaying(false);
    }
  };

  const speakKo = (text: string) => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Set 1 진입 시 자동 음원 재생
  useEffect(() => {
    if (setNumber === 1) {
      const timer = setTimeout(() => {
        playToastAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [setNumber]);

  // 토스트 팝업 닫기
  const handleCloseToast = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    setShowToast(false);
  };

  // 발음 평가 상태
  const [showPronModal, setShowPronModal] = useState(false);
  const [pronIdx, setPronIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState<any>(null);

  // 모의 발음 결과 모달
  const [showResultModal, setShowResultModal] = useState(false);
  const [mockScore, setMockScore] = useState({ accuracy: 0, fluency: 0, completeness: 0, average: 0 });

  // 녹음 시작 시뮬레이션
  const startRecording = () => {
    setIsRecording(true);
    const timer = setTimeout(() => {
      stopRecording();
    }, 1800);
    setRecordingTimer(timer);
  };

  // 녹음 완료 및 랜덤 점수 생성
  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer) clearTimeout(recordingTimer);

    const accuracy = Math.floor(Math.random() * 24) + 75;
    const fluency = Math.floor(Math.random() * 24) + 75;
    const completeness = Math.floor(Math.random() * 15) + 84;
    const average = Math.round((accuracy + fluency + completeness) / 3);

    setMockScore({ accuracy, fluency, completeness, average });
    setShowResultModal(true);
  };

  const progressPct = (setNumber / totalSets) * 100;

  return (
    <View style={s.container}>
      {/* 프로그레스 바 헤더 */}
      <View style={s.headerBar}>
        <View style={s.progressCenter}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progressPct}%` as `${number}%` }]} />
          </View>
        </View>
        <TouchableOpacity style={s.closeBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={s.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 캡슐 배지: 단어장 N/M */}
        <View style={s.badgeWrap}>
          <View style={s.setCapsule}>
            <Text style={s.setCapsuleText}>단어장 {setNumber}/{totalSets}</Text>
          </View>
        </View>

        {/* 타이틀 및 다국어 서브텍스트 */}
        <View style={s.titleWrap}>
          <Text style={s.mainTitle}>핵심 어휘를 확인해요.</Text>
          <Text style={s.subTitle}>
            {lang === 'vi' ? 'Đây là thông tin quan trọng.' : 'Đây là thông tin quan trọng.'}
          </Text>
        </View>

        {/* Set 1 안내(토스트) 팝업 */}
        {showToast && setNumber === 1 ? (
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
              Xem nghĩa và cách phát âm của từng từ. Bấm vào từ để tự luyện phát âm luôn nhé.
            </Text>

            <View style={s.toastBottomRow}>
              <TouchableOpacity
                style={[s.toastSpeakerBtn, isAudioPlaying && s.toastSpeakerPlaying]}
                onPress={playToastAudio}
                activeOpacity={0.7}
              >
                <Text style={s.toastSpeakerIcon}>{isAudioPlaying ? '🔊' : '🔈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* 안내 팝업 닫힘 시 또는 Set 2, 3에서는 재생 배속 바 노출 */
          <View style={s.speedBarWrap}>
            <Text style={s.speedBarLabel}>재생 속도</Text>
            <View style={s.speedBtnGroup}>
              {([0.5, 1.0, 1.5] as const).map((spd) => (
                <TouchableOpacity
                  key={spd}
                  style={[s.speedBtn, speed === spd && s.speedBtnActive]}
                  onPress={() => setSpeed(spd)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.speedBtnText, speed === spd && s.speedBtnTextActive]}>
                    {spd}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 보기 모드 탭: 전체 보기 | 한국어 보기 | 베트남어 보기 */}
        <View style={s.tabContainer}>
          <TouchableOpacity
            style={[s.tabItem, tab === 'all' && s.tabItemActive]}
            onPress={() => { setTab('all'); sfx.play(); }}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'all' && s.tabTextActive]}>
              {pick(lang, '전체 보기', 'Xem tất cả')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tabItem, tab === 'ko' && s.tabItemActive]}
            onPress={() => { setTab('ko'); sfx.play(); }}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'ko' && s.tabTextActive]}>
              {pick(lang, '한국어 보기', 'Chỉ tiếng Hàn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tabItem, tab === 'vi' && s.tabItemActive]}
            onPress={() => { setTab('vi'); sfx.play(); }}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'vi' && s.tabTextActive]}>
              {pick(lang, '베트남어 보기', 'Chỉ tiếng Việt')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 어휘 카드 목록 (Min 1 ~ Max 5) */}
        <View style={s.wordList}>
          {words.map((item) => (
            <View key={item.id} style={s.wordCard}>
              <View style={s.wordInfo}>
                {tab !== 'vi' && (
                  <Text style={s.wordKo}>{item.ko}</Text>
                )}
                {tab !== 'ko' && (
                  <Text style={s.wordVi}>{item.vi}</Text>
                )}
              </View>

              <TouchableOpacity
                style={s.speakerCircle}
                onPress={() => speakKo(item.ko)}
                activeOpacity={0.7}
              >
                <Text style={s.speakerIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 하단 2단 고정 액션 버튼 */}
      <View style={s.bottomBar}>
        {/* 좌측: 단어 발음하기 */}
        <TouchableOpacity
          style={s.pronounceBtn}
          onPress={() => {
            setPronIdx(0);
            setShowPronModal(true);
            sfx.play();
          }}
          activeOpacity={0.8}
        >
          <Text style={s.pronounceBtnText}>
            {pick(lang, '단어 발음하기', 'Luyện phát âm')}
          </Text>
        </TouchableOpacity>

        {/* 우측: 세트 문제 풀기 */}
        <TouchableOpacity
          style={s.quizBtn}
          onPress={() => {
            sfx.play();
            onNext();
          }}
          activeOpacity={0.8}
        >
          <Text style={s.quizBtnText}>
            {pick(lang, '세트 문제 풀기', 'Làm bài tập')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── 단어 발음평가 모달 ──────────────────────────────────────── */}
      <Modal visible={showPronModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>
                {pick(lang, '단어 발음 연습', 'Luyện phát âm từ')} ({pronIdx + 1}/{words.length})
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPronModal(false);
                  if (recordingTimer) clearTimeout(recordingTimer);
                  setIsRecording(false);
                }}
              >
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <Text style={s.pronTargetKo}>{words[pronIdx]?.ko}</Text>
              <Text style={s.pronTargetVi}>{words[pronIdx]?.vi}</Text>

              <TouchableOpacity
                style={s.pronListenBtn}
                onPress={() => speakKo(words[pronIdx]?.ko)}
                activeOpacity={0.7}
              >
                <Text style={s.pronListenText}>🔊 {pick(lang, '원어민 발음 듣기', 'Nghe phát âm chuẩn')}</Text>
              </TouchableOpacity>

              <View style={s.micSection}>
                <TouchableOpacity
                  style={[s.micBtn, isRecording && s.micBtnRecording]}
                  onPress={isRecording ? stopRecording : startRecording}
                  activeOpacity={0.8}
                >
                  <Text style={s.micIcon}>{isRecording ? '⏹' : '🎙️'}</Text>
                </TouchableOpacity>
                <Text style={s.micDesc}>
                  {isRecording
                    ? pick(lang, '듣고 있어요... 말씀하세요!', 'Đang lắng nghe...')
                    : pick(lang, '마이크를 누르고 말해보세요', 'Bấm mic để nói')}
                </Text>
              </View>
            </View>

            <View style={s.modalFooter}>
              <TouchableOpacity
                style={[s.navWordBtn, pronIdx === 0 && s.navWordBtnDisabled]}
                disabled={pronIdx === 0}
                onPress={() => setPronIdx(pronIdx - 1)}
              >
                <Text style={s.navWordText}>◀ 이전 단어</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.navWordBtn, pronIdx === words.length - 1 && s.navWordBtnDisabled]}
                disabled={pronIdx === words.length - 1}
                onPress={() => setPronIdx(pronIdx + 1)}
              >
                <Text style={s.navWordText}>다음 단어 ▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── 발음 평가 결과 모달 ──────────────────────────────────── */}
      <Modal visible={showResultModal} animationType="fade" transparent>
        <View style={s.modalOverlay}>
          <View style={s.resultContainer}>
            <Text style={s.resultTitle}>🎉 발음 평가 결과</Text>
            <View style={s.scoreCircle}>
              <Text style={s.scoreNumber}>{mockScore.average}</Text>
              <Text style={s.scoreUnit}>점</Text>
            </View>

            <View style={s.scoreDetailRow}>
              <View style={s.scoreDetailItem}>
                <Text style={s.scoreDetailLabel}>정확도</Text>
                <Text style={s.scoreDetailVal}>{mockScore.accuracy}%</Text>
              </View>
              <View style={s.scoreDetailItem}>
                <Text style={s.scoreDetailLabel}>유창성</Text>
                <Text style={s.scoreDetailVal}>{mockScore.fluency}%</Text>
              </View>
              <View style={s.scoreDetailItem}>
                <Text style={s.scoreDetailLabel}>완성도</Text>
                <Text style={s.scoreDetailVal}>{mockScore.completeness}%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.resultConfirmBtn}
              onPress={() => setShowResultModal(false)}
            >
              <Text style={s.resultConfirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressCenter: {
    flex: 1,
    paddingHorizontal: 52,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0E4E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: 3,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#3D4B57',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // 상단 캡슐 배지
  badgeWrap: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  setCapsule: {
    backgroundColor: '#e6f7f6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  setCapsuleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00a8a6',
  },

  // 타이틀 & 서브텍스트
  titleWrap: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9ca3af',
  },

  // Set 1 안내(토스트) 팝업
  toastBox: {
    backgroundColor: '#e6f8f7',
    borderWidth: 1.5,
    borderColor: '#00a8a6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 18,
    position: 'relative',
  },
  toastCloseBtn: {
    position: 'absolute',
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

  // 재생 속도 바 (토스트 닫힘 시 노출)
  speedBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  speedBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  speedBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  speedBtnActive: {
    backgroundColor: '#00a8a6',
    borderColor: '#00a8a6',
  },
  speedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  speedBtnTextActive: {
    color: '#ffffff',
  },

  // 3단 보기 모드 탭
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderColor: '#00a8a6',
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#00a8a6',
    fontWeight: '800',
  },

  // 어휘 카드 목록
  wordList: {
    gap: 10,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#edf2f7',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  wordInfo: {
    flex: 1,
    gap: 4,
  },
  wordKo: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  wordVi: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
  },
  speakerCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#edf9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 16,
  },

  // 하단 고정 2단 액션 바
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  pronounceBtn: {
    flex: 1,
    backgroundColor: '#00a8a6',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pronounceBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  quizBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  // 발음 평가 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  modalClose: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
  },
  modalBody: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  pronTargetKo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
  },
  pronTargetVi: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 10,
  },
  pronListenBtn: {
    backgroundColor: '#e6f7f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  pronListenText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00a8a6',
  },
  micSection: {
    alignItems: 'center',
    gap: 8,
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00a8a6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00a8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  micBtnRecording: {
    backgroundColor: '#ef4444',
  },
  micIcon: {
    fontSize: 28,
  },
  micDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  navWordBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navWordBtnDisabled: {
    opacity: 0.3,
  },
  navWordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00a8a6',
  },

  // 결과 모달
  resultContainer: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f7f6',
    borderWidth: 3,
    borderColor: '#00a8a6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00a8a6',
  },
  scoreUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00a8a6',
    marginLeft: 2,
    marginTop: 6,
  },
  scoreDetailRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 4,
  },
  scoreDetailItem: {
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  scoreDetailVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  resultConfirmBtn: {
    width: '100%',
    backgroundColor: '#00a8a6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  resultConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
