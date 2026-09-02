/**
 * 문법 학습 완료 (GrammarCompleteStage)
 * - 체크마크 아이콘 + 완료 메시지 (한국어/베트남어)
 * - 공통 ActivityHeader, CtaButton 적용
 */
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

interface Props {
  percentage?: number;
  onNext?: () => void;
  onBack?: () => void;
}

export function GrammarCompleteStage({
  percentage = 40,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={percentage}
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
          <Text style={s.mainText}>
            {pick(lang, '문법 학습을 완료했습니다.', 'Tôi đã hoàn thành phần học ngữ pháp.')}
          </Text>
          <Text style={s.subText}>
            {pick(lang, 'Tôi đã hoàn thành phần học ngữ pháp.', '문법 학습을 완료했습니다.')}
          </Text>
        </View>
      </View>

      {/* 하단 액션 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '다음', 'Tiếp tục')}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: radius.pill,
    backgroundColor: colors.correctLight,
    borderWidth: 3,
    borderColor: colors.correct,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.strong,
  },
  icon: {
    fontSize: 44,
    color: colors.correct,
    fontWeight: '900',
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 30,
  },
  subText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
