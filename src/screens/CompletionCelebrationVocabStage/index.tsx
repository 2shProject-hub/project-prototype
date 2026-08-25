import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

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

export function CompletionCelebrationVocabStage({
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

      <View style={s.content}>
        {/* Lottie 파티클 애니메이션 */}
        <View style={s.lottieContainer} pointerEvents="none">
          <LottieView
            source={require('../../../assets/particle-rain.json')}
            autoPlay
            loop
            style={s.lottieAnimation}
          />
        </View>

        {/* 메인 콘텐츠 카드 */}
        <View style={s.card}>
          <View style={s.iconContainer}>
            <Text style={s.icon}>🎉</Text>
          </View>

          {/* 한국어 */}
          <Text style={s.titleKo}>{title}</Text>
          <Text style={s.descriptionKo}>{description}</Text>

          {/* 구분선 */}
          <View style={s.divider} />

          {/* 베트남어 */}
          <Text style={s.titleVi}>{titleVi}</Text>
          <Text style={s.descriptionVi}>{descriptionVi}</Text>
        </View>
      </View>

      {/* 하단 액션 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, nextButtonText, nextButtonTextVi)}
          onPress={onNext}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    overflow: 'hidden',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    ...shadow.strong,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 44,
  },
  titleKo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  descriptionKo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  titleVi: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.tealDark,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  descriptionVi: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
