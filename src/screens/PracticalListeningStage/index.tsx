/**
 * 실전 듣기 (PracticalListeningStage)
 * - 스피커 아이콘 탭 시 해당 문장 음원 재생
 * - 문장 내 핵심 단어는 하이라이트 박스로 표시
 * - KO/VI 다국어 지원
 */
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

// ── 데이터 타입 ──────────────────────────────────────────
export interface ListeningSentence {
  prefix: string;
  prefixVi: string;
  highlight: string;
  highlightVi: string;
  suffix?: string;
  suffixVi?: string;
}

export interface ListeningItem {
  sentences: ListeningSentence[];
  audioUrl?: string;
}

export interface PracticalListeningData {
  badge: string;
  badgeVi: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  items: ListeningItem[];
}

// ── Mock 데이터 ──────────────────────────────────────────
export const MOCK_PRACTICAL_LISTENING: PracticalListeningData = {
  badge: '실전 듣기',
  badgeVi: 'Nghe thực hành',
  title: '문장을 듣고 확인해 보세요.',
  titleVi: 'Nghe và xác nhận các câu.',
  subtitle: '이어지는 문제에서 참고할 문장이에요. 스피커를 눌러 들어보세요.',
  subtitleVi: 'Đây là câu tham khảo cho bài tiếp theo. Hãy nhấn loa để nghe.',
  items: [
    {
      sentences: [
        { prefix: '안녕하세요? 저는', prefixVi: 'Xin chào. Tôi là', highlight: '하영이에요', highlightVi: 'Hayeong', suffix: '.', suffixVi: '.' },
        { prefix: '저는', prefixVi: 'Tôi là', highlight: '한국 사람이에요', highlightVi: 'người Hàn Quốc', suffix: '.', suffixVi: '.' },
      ],
    },
    {
      sentences: [
        { prefix: '만나서 반가워요. 저는', prefixVi: 'Rất vui được gặp bạn. Tôi là', highlight: '유키예요', highlightVi: 'Yuki', suffix: '.', suffixVi: '.' },
        { prefix: '저는', prefixVi: 'Tôi là', highlight: '일본 사람이에요', highlightVi: 'người Nhật', suffix: '.', suffixVi: '.' },
      ],
    },
  ],
};

// ── 컴포넌트 ──────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: PracticalListeningData;
}

export function PracticalListeningStage({ onNext, onBack, data }: Props) {
  const { lang } = useLang();
  const d = data ?? MOCK_PRACTICAL_LISTENING;

  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (idx: number, audioUrl?: string) => {
    if (Platform.OS !== 'web') return;

    // 재생 중이면 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }

    setPlayingIdx(idx);

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch(() => setPlayingIdx(null));
        audio.onended = () => setPlayingIdx(null);
      } catch {
        setPlayingIdx(null);
      }
    } else {
      // 프로토타입: 오디오 없을 때 1.5초 후 자동 해제
      setTimeout(() => setPlayingIdx(null), 1500);
    }
  };

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={50} onClose={onBack} />

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 배지 */}
        <View style={s.badge}>
          <Text style={s.badgeText}>{pick(lang, d.badge, d.badgeVi)}</Text>
        </View>

        {/* 타이틀 */}
        <Text style={s.title}>{pick(lang, d.title, d.titleVi)}</Text>
        <Text style={s.subtitle}>{pick(lang, d.subtitle, d.subtitleVi)}</Text>

        {/* 캐릭터 일러스트 */}
        <View style={s.illustContainer}>
          <Image
            source={require('../../../assets/practical-listening-illust.png')}
            style={s.illustImage}
            resizeMode="contain"
          />
        </View>

        {/* 문장 카드 목록 */}
        {d.items.map((item, idx) => (
          <View key={idx} style={s.card}>
            {/* 스피커 버튼 */}
            <TouchableOpacity
              style={[s.speakerBtn, playingIdx === idx && s.speakerBtnActive]}
              onPress={() => handlePlay(idx, item.audioUrl)}
              activeOpacity={0.75}
            >
              <Text style={s.speakerIcon}>{playingIdx === idx ? '🔊' : '🔈'}</Text>
            </TouchableOpacity>

            {/* 문장 목록 */}
            <View style={s.sentenceList}>
              {item.sentences.map((sen, si) => (
                <View key={si} style={s.sentenceRow}>
                  <Text style={s.sentencePrefix}>{pick(lang, sen.prefix, sen.prefixVi)} </Text>
                  <View style={s.highlightBox}>
                    <Text style={s.highlightText}>{pick(lang, sen.highlight, sen.highlightVi)}</Text>
                  </View>
                  {(sen.suffix || sen.suffixVi) ? (
                    <Text style={s.sentenceSuffix}>{pick(lang, sen.suffix ?? '', sen.suffixVi ?? '')}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity style={s.ctaBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={s.ctaBtnText}>{pick(lang, '다음  →', 'Tiếp theo  →')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 스타일 ────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 16 },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  title: { fontSize: 22, fontWeight: '700', color: colors.ink, lineHeight: 32 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 22 },

  illustContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  illustImage: {
    width: '100%',
    height: 180,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FAFCFD',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
  },

  speakerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  speakerBtnActive: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 22 },

  sentenceList: { flex: 1, gap: 10 },

  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  sentencePrefix: { fontSize: 15, fontWeight: '500', color: colors.ink },
  highlightBox: {
    backgroundColor: '#E6F7F7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  highlightText: { fontSize: 15, fontWeight: '700', color: colors.teal },
  sentenceSuffix: { fontSize: 15, fontWeight: '500', color: colors.ink },

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
