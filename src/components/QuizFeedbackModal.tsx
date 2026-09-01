import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';
import { useLang, pick } from './LangContext';
import { useTheme } from '../theme/ThemeContext';
import { bodyFont, readableOn } from '../theme/themeTypes';
import { nativeThemeAttr } from '../theme/themedControls';
import { themeAssets } from '../theme/themeAssets';
import { CtaButton } from './CtaButton';

export interface QuizFeedbackModalProps {
  visible: boolean;
  isCorrect: boolean;
  title?: string;
  titleVi?: string;
  answerText?: string;
  answerTextVi?: string;
  explanation?: string;
  explanationVi?: string;
  nextText?: string;
  nextTextVi?: string;
  onNext: () => void;
  onClose?: () => void;
}

export function QuizFeedbackModal({
  visible,
  isCorrect,
  title,
  titleVi,
  answerText,
  answerTextVi,
  explanation,
  explanationVi,
  nextText,
  nextTextVi,
  onNext,
  onClose,
}: QuizFeedbackModalProps) {
  const { lang } = useLang();
  // Modal 은 포털이라 DOM 오버라이드가 못 닿는다 — 여기서 직접 테마를 입힌다
  const { theme, enabled: themeOn } = useTheme();
  // 브랜드 자산 테마: 정오답 얼굴을 캐릭터로 (정답=메인, 오답=서브)
  const asset = themeOn ? themeAssets(theme.id) : null;
  const charImg = asset ? (isCorrect ? asset.character : asset.bubble ?? asset.character) : null;
  const tm = themeOn
    ? (() => {
        const c = theme.colors;
        const L = theme.layout;
        const tone = isCorrect ? c.success : c.danger;
        const toneSoft = isCorrect ? c.successSoft : c.dangerSoft;
        return {
          card: { backgroundColor: c.surface, borderRadius: L.radius === 0 ? 2 : Math.max(8, Math.round(L.radius * 1.4)), borderWidth: L.list === 'block' ? 2 : 0, borderColor: c.ink },
          icon: { backgroundColor: toneSoft, borderRadius: L.radius === 0 ? 4 : 999 },
          iconText: { color: readableOn(toneSoft, [tone, c.ink]), ...bodyFont(theme, 700) },
          title: { color: tone, ...bodyFont(theme, 700) },
          answerBox: { backgroundColor: c.backdrop, borderRadius: L.radius },
          answerLabel: { color: c.muted, ...bodyFont(theme, 600) },
          answerValue: { color: c.ink, ...bodyFont(theme, 700) },
          explanation: { color: c.textSecondary, ...bodyFont(theme) },
        };
      })()
    : null;

  const defaultTitle = isCorrect
    ? pick(lang, '정답입니다!', 'Chính xác!')
    : pick(lang, '아쉬워요, 오답입니다', 'Tiếc quá, chưa chính xác');

  const defaultNextText = isCorrect
    ? pick(lang, '다음 단계로', 'Tiếp tục')
    : pick(lang, '다시 풀기', 'Thử lại');

  const displayTitle = title ? pick(lang, title, titleVi || title) : defaultTitle;
  const displayAnswer = answerText ? pick(lang, answerText, answerTextVi || answerText) : null;
  const displayExplanation = explanation ? pick(lang, explanation, explanationVi || explanation) : null;
  const displayBtnText = nextText ? pick(lang, nextText, nextTextVi || nextText) : defaultNextText;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, tm && tm.card]} {...(tm ? nativeThemeAttr : null)}>
              {/* 상단 상태 뱃지 / 아이콘 */}
              <View
                style={[
                  styles.iconCircle,
                  isCorrect ? styles.iconCorrect : styles.iconWrong,
                  tm && tm.icon,
                ]}
              >
                {charImg ? (
                  <Image source={charImg} style={{ width: 46, height: 46, borderRadius: 12 }} resizeMode="contain" />
                ) : (
                  <Text style={[styles.iconText, tm && tm.iconText]}>{isCorrect ? '✓' : '✕'}</Text>
                )}
              </View>

              {/* 피드백 타이틀 */}
              <Text
                style={[
                  styles.title,
                  isCorrect ? styles.titleCorrect : styles.titleWrong,
                  tm && tm.title,
                ]}
              >
                {displayTitle}
              </Text>

              {/* 정답 안내 영역 */}
              {displayAnswer && (
                <View style={[styles.answerBox, tm && tm.answerBox]}>
                  <Text style={[styles.answerLabel, tm && tm.answerLabel]}>
                    {pick(lang, '정답', 'Đáp án')}
                  </Text>
                  <Text style={[styles.answerValue, tm && tm.answerValue]}>{displayAnswer}</Text>
                </View>
              )}

              {/* 해설 영역 */}
              {displayExplanation && (
                <View style={styles.explanationBox}>
                  <Text style={[styles.explanationText, tm && tm.explanation]}>{displayExplanation}</Text>
                </View>
              )}

              {/* 하단 액션 버튼 */}
              <View style={styles.buttonWrapper}>
                <CtaButton
                  title={displayBtnText}
                  onPress={onNext}
                  variant={isCorrect ? 'primary' : 'secondary'}
                  size="lg"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 48, 61, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    ...shadow.strong,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCorrect: {
    backgroundColor: colors.correctLight,
  },
  iconWrong: {
    backgroundColor: colors.wrongLight,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.correct,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  titleCorrect: {
    color: colors.correct,
  },
  titleWrong: {
    color: colors.wrong,
  },
  answerBox: {
    width: '100%',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 2,
  },
  answerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  explanationBox: {
    width: '100%',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  explanationText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: spacing.xs,
  },
});
