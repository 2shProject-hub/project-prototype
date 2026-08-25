/**
 * 실전 말하기 (PracticalSpeakingStage)
 * - 다단계(step N/total) 진행
 * - 빈칸에 텍스트 입력 또는 마이크 음성 입력
 * - 정/오답 평가는 추후 제공 예정 (현재 프로토타입은 입력 UI만 구현)
 * - KO/VI 다국어 지원
 */
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

// ── 데이터 타입 ──────────────────────────────────────────
export interface SpeakingBlank {
  prefix: string;
  prefixVi: string;
  placeholder: string;
  placeholderVi: string;
  suffix?: string;
  suffixVi?: string;
}

export interface SpeakingHint {
  label: string;
  labelVi: string;
  value: string;
  valueVi: string;
}

export interface SpeakingCard {
  blanks: SpeakingBlank[];
  hints: SpeakingHint[];
}

export interface PracticalSpeakingStep {
  cards: SpeakingCard[];
}

export interface PracticalSpeakingData {
  badge: string;
  badgeVi: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  steps: PracticalSpeakingStep[];
}

// ── Mock 데이터 ──────────────────────────────────────────
export const MOCK_PRACTICAL_SPEAKING: PracticalSpeakingData = {
  badge: '실전 말하기',
  badgeVi: 'Nói thực hành',
  title: '빈칸을 채우고 말해 보세요.',
  titleVi: 'Điền vào chỗ trống và đọc to.',
  subtitle: '주어진 정보를 넣어 문장을 완성한 뒤, 소리 내어 읽으세요.',
  subtitleVi: 'Điền thông tin đã cho vào câu rồi đọc to.',
  steps: [
    {
      cards: [
        {
          blanks: [
            { prefix: '안녕하세요? 저는', prefixVi: 'Xin chào. Tôi là', placeholder: '이름', placeholderVi: 'tên', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '국적', placeholderVi: 'quốc tịch', suffix: '.', suffixVi: '.' },
          ],
          hints: [
            { label: '이름', labelVi: 'Tên', value: '타오', valueVi: 'Tao' },
            { label: '국적', labelVi: 'Quốc tịch', value: '베트남', valueVi: 'Việt Nam' },
          ],
        },
        {
          blanks: [
            { prefix: '만나서 반가워요. 저는', prefixVi: 'Rất vui được gặp bạn. Tôi là', placeholder: '이름', placeholderVi: 'tên', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '국적', placeholderVi: 'quốc tịch', suffix: '.', suffixVi: '.' },
          ],
          hints: [
            { label: '이름', labelVi: 'Tên', value: '민준', valueVi: 'Minjun' },
            { label: '국적', labelVi: 'Quốc tịch', value: '한국', valueVi: 'Hàn Quốc' },
          ],
        },
      ],
    },
    {
      cards: [
        {
          blanks: [
            { prefix: '안녕하세요? 저는', prefixVi: 'Xin chào. Tôi là', placeholder: '이름', placeholderVi: 'tên', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '직업', placeholderVi: 'nghề nghiệp', suffix: '.', suffixVi: '.' },
          ],
          hints: [
            { label: '이름', labelVi: 'Tên', value: '세나', valueVi: 'Sena' },
            { label: '직업', labelVi: 'Nghề nghiệp', value: '선생님이에요', valueVi: 'là giáo viên' },
          ],
        },
      ],
    },
    {
      cards: [
        {
          blanks: [
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '이름', placeholderVi: 'tên', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '국적', placeholderVi: 'quốc tịch', suffix: '.', suffixVi: '.' },
          ],
          hints: [
            { label: '이름', labelVi: 'Tên', value: '리리', valueVi: 'Lily' },
            { label: '국적', labelVi: 'Quốc tịch', value: '중국 사람이에요', valueVi: 'là người Trung Quốc' },
          ],
        },
      ],
    },
    {
      cards: [
        {
          blanks: [
            { prefix: '안녕하세요? 저는', prefixVi: 'Xin chào. Tôi là', placeholder: '이름', placeholderVi: 'tên', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '국적', placeholderVi: 'quốc tịch', suffix: '.', suffixVi: '.' },
            { prefix: '저는', prefixVi: 'Tôi là', placeholder: '직업', placeholderVi: 'nghề nghiệp', suffix: '.', suffixVi: '.' },
          ],
          hints: [
            { label: '이름', labelVi: 'Tên', value: '나', valueVi: 'tôi' },
            { label: '국적', labelVi: 'Quốc tịch', value: '(내 나라)', valueVi: '(quê bạn)' },
            { label: '직업', labelVi: 'Nghề nghiệp', value: '(내 직업)', valueVi: '(nghề bạn)' },
          ],
        },
      ],
    },
  ],
};

// ── 컴포넌트 ──────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: PracticalSpeakingData;
}

export function PracticalSpeakingStage({ onNext, onBack, data }: Props) {
  const { lang } = useLang();
  const d = data ?? MOCK_PRACTICAL_SPEAKING;

  const [stepIdx, setStepIdx] = useState(0);
  // inputs[cardIdx][blankIdx] = 입력값
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [activeInputKey, setActiveInputKey] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard');

  const totalSteps = d.steps.length;
  const currentStep = d.steps[stepIdx];
  const progressPct = ((stepIdx + 1) / totalSteps) * 100;

  const inputKey = (cardIdx: number, blankIdx: number) => `${stepIdx}-${cardIdx}-${blankIdx}`;

  const setInput = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleMic = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // 프로토타입: 2초 후 자동 해제
      setTimeout(() => setIsRecording(false), 2000);
    }
  };

  const handleNext = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) {
      setStepIdx(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={progressPct} onClose={handleBack} />

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 단계 배지 */}
        <View style={s.stepBadge}>
          <Text style={s.stepBadgeText}>
            {pick(lang, `${d.badge} · ${stepIdx + 1}/${totalSteps}`, `${d.badgeVi} · ${stepIdx + 1}/${totalSteps}`)}
          </Text>
        </View>

        {/* 타이틀 */}
        <Text style={s.title}>{pick(lang, d.title, d.titleVi)}</Text>
        <Text style={s.subtitle}>{pick(lang, d.subtitle, d.subtitleVi)}</Text>

        {/* 문장 카드 */}
        {currentStep.cards.map((card, ci) => (
          <View key={ci} style={s.card}>
            {/* 빈칸 문장 */}
            {card.blanks.map((blank, bi) => {
              const key = inputKey(ci, bi);
              return (
                <View key={bi} style={s.blankRow}>
                  <Text style={s.blankPrefix}>{pick(lang, blank.prefix, blank.prefixVi)} </Text>
                  <TextInput
                    style={[s.blankInput, activeInputKey === key && s.blankInputActive]}
                    placeholder={pick(lang, blank.placeholder, blank.placeholderVi)}
                    placeholderTextColor={colors.muted}
                    value={inputs[key] ?? ''}
                    onChangeText={val => setInput(key, val)}
                    onFocus={() => setActiveInputKey(key)}
                    onBlur={() => setActiveInputKey(null)}
                  />
                  {(blank.suffix || blank.suffixVi) ? (
                    <Text style={s.blankSuffix}>{pick(lang, blank.suffix ?? '', blank.suffixVi ?? '')}</Text>
                  ) : null}
                </View>
              );
            })}

            {/* 힌트 목록 */}
            <View style={s.hintBlock}>
              {card.hints.map((hint, hi) => (
                <Text key={hi} style={s.hintText}>
                  <Text style={s.hintLabel}>{pick(lang, hint.label, hint.labelVi)}: </Text>
                  {pick(lang, hint.value, hint.valueVi)}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 하단 입력 툴바 */}
      <View style={s.toolbar}>
        {/* 키보드 모드 버튼 */}
        <TouchableOpacity
          style={[s.toolBtn, inputMode === 'keyboard' && s.toolBtnActive]}
          onPress={() => setInputMode('keyboard')}
          activeOpacity={0.75}
        >
          <Text style={s.toolIcon}>⌨️</Text>
        </TouchableOpacity>

        {/* 마이크 버튼 */}
        <TouchableOpacity
          style={[s.micBtn, isRecording && s.micBtnRecording]}
          onPress={handleMic}
          activeOpacity={0.8}
        >
          <Text style={s.micIcon}>🎤</Text>
        </TouchableOpacity>

        {/* 힌트 버튼 */}
        <TouchableOpacity style={s.toolBtn} activeOpacity={0.75}>
          <Text style={s.toolIcon}>💡</Text>
        </TouchableOpacity>
      </View>

      {/* 마이크 안내 텍스트 */}
      <Text style={s.micGuide}>
        {pick(lang, '마이크를 눌러 단어를 소리 내어 읽어주세요', 'Nhấn mic và đọc to từng từ')}
      </Text>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity style={s.ctaBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={s.ctaBtnText}>
            {stepIdx < totalSteps - 1
              ? pick(lang, '다음  →', 'Tiếp theo  →')
              : pick(lang, '완료  →', 'Hoàn thành  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 스타일 ────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, gap: 16 },

  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepBadgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  title: { fontSize: 22, fontWeight: '700', color: colors.ink, lineHeight: 32 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 22 },

  card: {
    backgroundColor: '#FAFCFD',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },

  blankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  blankPrefix: { fontSize: 15, fontWeight: '500', color: colors.ink },
  blankInput: {
    height: 36,
    minWidth: 80,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.line,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    backgroundColor: 'transparent',
  },
  blankInputActive: { borderBottomColor: colors.teal },
  blankSuffix: { fontSize: 15, fontWeight: '500', color: colors.ink },

  hintBlock: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 4,
  },
  hintText: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  hintLabel: { fontWeight: '700', color: colors.ink },

  // 툴바
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnActive: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  toolIcon: { fontSize: 20 },

  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnRecording: { backgroundColor: '#E53E3E' },
  micIcon: { fontSize: 28 },

  micGuide: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  // 하단 버튼
  footer: { padding: 16, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
