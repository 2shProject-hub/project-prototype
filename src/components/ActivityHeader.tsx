import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Animated,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { themedHeader, themedExitPopup, nativeThemeAttr } from '../theme/themedControls';
import { useLang, pick } from './LangContext';

interface Props {
  /** 0-100 사이 진행 퍼센트 */
  percentage: number;
  /** 팝업에서 "종료하기" 확인 후 호출 */
  onClose: () => void;
  /** X 버튼 왼쪽에 추가할 요소 (예: step badge) — absolute 포지셔닝 권장 */
  children?: ReactNode;
}

// ── Animated ProgressBar (Source A 동일 동작: 500ms timing) ──
function ProgressBar({ percentage, themed }: { percentage: number; themed: ReturnType<typeof themedHeader> | null }) {
  const anim = useRef(new Animated.Value(percentage)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage, anim]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[pb.track, themed && themed.track]}>
      <Animated.View style={[pb.fill, { width }, themed && themed.fill]}>
        {!themed && <View style={pb.sheen} />}
      </Animated.View>
    </View>
  );
}

const pb = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: '#E0E4E8',
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%' as const,
    minWidth: 10,
    backgroundColor: colors.teal,
    borderRadius: 999,
  },
  sheen: {
    position: 'absolute',
    top: 2, left: 5, right: 5, height: 2.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

// ── 종료 확인 팝업 (Source A LearningExitConfirmPopup 동일 동작) ──
function ExitConfirmPopup({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLang();
  const { theme, enabled: themeOn } = useTheme();
  const tp = themeOn ? themedExitPopup(theme) : null;
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={popup.backdrop}>
        <View style={[popup.card, tp && tp.card]} {...(tp ? nativeThemeAttr : null)}>
          <Text style={[popup.message, tp && tp.message]}>
            {pick(
              lang,
              'K-Chao 학습을 종료 하시겠습니까?\n종료한 학습 이어할 수 있습니다.',
              'Bạn có muốn kết thúc buổi học K-Chao không?\nBạn có thể tiếp tục buổi học đã dừng sau này.',
            )}
          </Text>
          <View style={popup.btnRow}>
            <TouchableOpacity style={[popup.btn, popup.btnSecondary, tp && tp.btnSecondary]} onPress={onCancel} activeOpacity={0.8}>
              <Text style={[popup.btnText, popup.btnTextSecondary, tp && tp.btnTextSecondary]}>
                {pick(lang, '학습하기', 'Tiếp tục học')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[popup.btn, popup.btnPrimary, tp && tp.btnPrimary]} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={[popup.btnText, popup.btnTextPrimary, tp && tp.btnTextPrimary]}>
                {pick(lang, '종료하기', 'Thoát')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const popup = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    width: 300, backgroundColor: '#fff', borderRadius: 20,
    paddingTop: 28, paddingBottom: 20, paddingHorizontal: 20,
    alignItems: 'center', gap: 20,
  },
  message: {
    fontSize: 16, color: '#1A2B3C', textAlign: 'center', lineHeight: 24,
  },
  btnRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  btn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnSecondary: { backgroundColor: '#F0F4F8', borderWidth: 1, borderColor: '#D0D8E0' },
  btnPrimary: { backgroundColor: colors.teal },
  btnText: { fontSize: 15, fontWeight: '700' },
  btnTextSecondary: { color: '#3D4B57' },
  btnTextPrimary: { color: '#fff' },
});

// ── ActivityHeader (공유 컴포넌트) ──
export function ActivityHeader({ percentage, onClose, children }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const { theme, enabled: themeOn } = useTheme();
  const th = themeOn ? themedHeader(theme) : null;

  return (
    <View style={[s.header, th && th.header]}>
      {/* native-theme 는 헤더가 직접 소유한 부분에만 — children(화면이 준 배지 등)은
          DOM 오버라이드가 계속 색을 입혀야 하므로 루트에 걸면 안 된다 */}
      <View style={s.progressCenter} {...(th ? nativeThemeAttr : null)}>
        <ProgressBar percentage={percentage} themed={th} />
      </View>
      {children}
      <TouchableOpacity
        style={s.closeBtn}
        onPress={() => setShowPopup(true)}
        activeOpacity={0.7}
        {...(th ? nativeThemeAttr : null)}
      >
        <Text style={[s.closeBtnText, th && th.closeText]}>✕</Text>
      </TouchableOpacity>
      <ExitConfirmPopup
        visible={showPopup}
        onCancel={() => setShowPopup(false)}
        onConfirm={() => { setShowPopup(false); onClose(); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    height: 52, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  progressCenter: {
    flex: 1, paddingHorizontal: 52, justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute', right: 12,
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 18, color: '#3D4B57', fontWeight: '600' },
});
