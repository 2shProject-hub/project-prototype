/**
 * 완료 축하 화면 (CompletionCelebrationStage)
 * - 학습 완료 축하
 * - 파티클 애니메이션 (Lottie)
 * - 다국어 지원 (한국어/베트남어)
 * - 확인 버튼
 */
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  title?: string;
  titleVi?: string;
  description?: string;
  descriptionVi?: string;
  nextButtonText?: string;
  nextButtonTextVi?: string;
  onNext?: () => void;
  onBack?: () => void;
}

export function CompletionCelebrationStage({
  title = '대단해요!',
  titleVi = 'Tuyệt vời!',
  description = '오늘의 단어를 모두 학습했어요.\n이제 문법을 배워볼까요?',
  descriptionVi = 'Bạn đã học xong tất cả các từ vựng hôm nay.\nBây giờ, chúng ta cùng học ngữ pháp nhé!',
  nextButtonText = '확인',
  nextButtonTextVi = 'Xác nhận',
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();

  return (
    <View style={s.root}>
      <ActivityHeader percentage={100} onClose={onBack || (() => {})} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Lottie 파티클 애니메이션 */}
        <View style={s.lottieContainer}>
          <LottieView
            source={require('../../../assets/particle-rain.json')}
            autoPlay
            loop
            style={s.lottieAnimation}
          />
        </View>

        {/* 메인 콘텐츠 */}
        <View style={s.card}>
          {/* 축하 아이콘 */}
          <View style={s.iconContainer}>
            <Text style={s.icon}>🎉</Text>
          </View>

          {/* 타이틀 */}
          <Text style={s.title}>
            {pick(lang, title, titleVi)}
          </Text>

          {/* 설명 */}
          <Text style={s.description}>
            {pick(lang, description, descriptionVi)}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.confirmBtn}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={s.confirmBtnText}>
            {pick(lang, nextButtonText, nextButtonTextVi)}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // Lottie 애니메이션 컨테이너
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },

  // 카드
  card: {
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: '#FFFFFF',
  },

  // 아이콘
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 60,
  },

  // 텍스트
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 40,
  },

  // 하단 버튼
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
