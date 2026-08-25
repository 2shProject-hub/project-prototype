import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export function CompletionCelebrationClassStage({
  title = '수고했어요!',
  titleVi = 'Bạn đã làm rất tốt!',
  description = '오늘 수업을 모두 완료했어요.\n나의 학습 리포트를 확인해 보세요.',
  descriptionVi = 'Bạn đã hoàn thành toàn bộ bài học hôm nay.\nHãy xem báo cáo học tập của bạn nhé.',
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

        {/* 메인 콘텐츠 */}
        <View style={s.card}>
          {/* 축하 아이콘 */}
          <View style={s.iconContainer}>
            <Text style={s.icon}>🎉</Text>
          </View>

          {/* 한국어 */}
          <Text style={s.titleKo}>{title}</Text>
          <Text style={s.descriptionKo}>{description}</Text>

          {/* 베트남어 */}
          <Text style={s.titleVi}>{titleVi}</Text>
          <Text style={s.descriptionVi}>{descriptionVi}</Text>
        </View>
      </View>

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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },

  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    overflow: 'hidden',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },

  card: {
    alignItems: 'center',
    marginTop: 120,
  },

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

  titleKo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  descriptionKo: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.ink,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  titleVi: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 4,
  },
  descriptionVi: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
  },

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
