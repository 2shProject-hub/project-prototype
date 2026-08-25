/**
 * 1 세트 학습 완료 (SetCompleteStage)
 * - 프로그레스바 헤더
 * - 체크마크 아이콘
 * - 완료 메시지 (한국어/베트남어)
 * - 다음 버튼
 * - 자동 음원 재생
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  setNumber?: number;
  totalSets?: number;
  onNext?: () => void;
  onBack?: () => void;
}

export function SetCompleteStage({ setNumber = 1, totalSets = 3, onNext, onBack }: Props) {
  const { lang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const playAudio = () => {
    if (Platform.OS !== 'web') return;

    try {
      const audioSrc = require('../../../assets/sounds/260825_setcomplete.mp3');
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

  useEffect(() => {
    // 화면 진입 시 500ms 후 음원 자동 재생
    const timer = setTimeout(() => {
      playAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const progressPct = (setNumber / totalSets) * 100;

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <View style={s.container}>
        {/* 체크마크 아이콘 */}
        <View style={s.iconContainer}>
          <View style={s.iconCircle}>
            <Text style={s.icon}>✓</Text>
          </View>
        </View>

        {/* 텍스트 영역 */}
        <View style={s.textContainer}>
          {/* 텍스트 1: 완료 메시지 (한국어/베트남어) */}
          <Text style={s.mainText}>
            {pick(lang, `${setNumber} 세트 학습을 완료했습니다!`, `Bạn đã hoàn thành ${setNumber} set học rồi!`)}
          </Text>

          {/* 텍스트 2: 베트남어/한국어 번역 */}
          <Text style={s.subText}>
            {pick(lang, `Bạn đã hoàn thành ${setNumber} set học rồi!`, `${setNumber} 세트 학습을 완료했습니다!`)}
          </Text>

          {/* 텍스트 3: 다음 단계 안내 */}
          <Text style={s.subText}>
            {setNumber === totalSets
              ? pick(lang, '다음 단계로 넘어가세요.', 'Hãy chuyển sang giai đoạn tiếp theo nhé.')
              : pick(lang, '다음 단어로 넘어가세요.', 'Hãy chuyển sang từ tiếp theo nhé.')
            }
          </Text>
        </View>
      </View>

      {/* 하단 다음 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.nextBtn}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={s.nextBtnText}>
            {pick(lang, '다음', 'Tiếp theo')} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D0F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.teal,
  },

  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.teal,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  nextBtn: {
    backgroundColor: '#E8F4F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.teal,
  },
});
