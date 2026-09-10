/**
 * ============================================================================
 * [회원가입 및 연령 확인 진입 Flow]
 * 
 * (소셜 로그인) ──> [연령 확인 (생년월일)] ──> { 만 14세 판정 }
 *                                                  │
 *       ┌──────────────────────────────────────────┴─────────────────┐
 *       ▼ (Yes: 만 14세 이상)                                         ▼ (No: 만 14세 미만)
 * [통과 팝업] ──> [레벨 선택 (LevelSelectFlow)]               [차단 팝업] ──> [세션 정리]
 *                         │                                                 │
 *                         ▼                                                 ▼
 *                       (홈)                                        (소셜 로그인 복귀)
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import {
  checkAgeRestriction,
  formatBirthDateInput,
  AgeCheckResult,
} from '../../utils/ageVerification';

export interface AgeVerificationScreenProps {
  onNext?: (data: { birthDate: string; age: number }) => void;
  onBack?: () => void;
}

type ModalResultType = 'pass' | 'block' | null;

export function AgeVerificationScreen({
  onNext,
  onBack,
}: AgeVerificationScreenProps) {
  const [birthDate, setBirthDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [modalType, setModalType] = useState<ModalResultType>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const ageResult: AgeCheckResult = checkAgeRestriction(birthDate);

  const handleInputChange = (text: string) => {
    const formatted = formatBirthDateInput(text);
    setBirthDate(formatted);
  };

  const handlePresetSelect = (dateStr: string) => {
    const formatted = formatBirthDateInput(dateStr);
    setBirthDate(formatted);
  };

  // 하단 '확인' 버튼 클릭 시 만 나이 기준 판정 후 결과 팝업 노출
  const handleConfirmPress = () => {
    if (!ageResult.isValidFormat) return;

    if (ageResult.isUnder14) {
      setModalType('block');
    } else {
      setModalType('pass');
    }
  };

  // 팝업 내 '확인' 버튼 클릭 시 라우팅 분기 처리
  const handleModalConfirm = () => {
    const currentType = modalType;
    setModalType(null);

    if (currentType === 'pass') {
      // Case A: 만 14세 이상 통과 -> '레벨 선택' 화면으로 이동
      if (onNext) {
        onNext({
          birthDate: birthDate.replace(/\./g, '-'),
          age: ageResult.internationalAge,
        });
      }
    } else if (currentType === 'block') {
      // Case B: 만 14세 미만 차단 -> '소셜 로그인' 화면으로 이동
      if (onBack) {
        onBack();
      }
    }
  };

  // 우측 X (Close) 버튼 클릭 시 로그인 화면으로 복귀
  const handleClosePress = () => {
    if (onBack) {
      onBack();
    }
  };

  // 하단 확인 버튼 활성화 조건: 유효한 8자리 생년월일 입력 + 필수 약관 동의 체크
  const isButtonEnabled = ageResult.isValidFormat && termsAgreed;

  return (
    <View style={styles.container}>
      {/* ─── 1. 상단 네비게이션 바 (Header: 한/베 상하 병기) ─── */}
      <View style={styles.header}>
        <View style={styles.headerLeftPlaceholder} />
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitleKo}>연령 확인</Text>
          <Text style={styles.headerTitleVi}>Xác minh độ tuổi</Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClosePress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. 인트로 안내 영역 (Intro Section: 한/베 상하 병기) ─── */}
        <View style={styles.introSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🎂</Text>
          </View>
          <Text style={styles.titleKo}>생년월일을 입력해 주세요</Text>
          <Text style={styles.titleVi}>Vui lòng nhập ngày sinh của bạn</Text>
          <View style={styles.subtitleBox}>
            <Text style={styles.subtitleKo}>
              K-Chao는 만 14세 이상 회원을 대상으로 서비스를 제공합니다.
            </Text>
            <Text style={styles.subtitleVi}>
              K-Chao chỉ cung cấp dịch vụ cho thành viên từ 14 tuổi trở lên.
            </Text>
          </View>
        </View>

        {/* ─── 3. 생년월일 입력 영역 (Input Section: 한/베 상하 병기) ─── */}
        <View style={styles.inputSection}>
          <View style={styles.inputLabelBox}>
            <Text style={styles.inputLabelKo}>생년월일 (8자리)</Text>
            <Text style={styles.inputLabelVi}>Ngày sinh (8 chữ số)</Text>
          </View>
          <View
            style={[
              styles.inputBox,
              {
                borderColor: isFocused ? '#2563eb' : '#cbd5e1',
                backgroundColor: '#ffffff',
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={birthDate}
              onChangeText={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="YYYY.MM.DD"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              maxLength={10}
              autoFocus
            />
            {birthDate.length > 0 && (
              <TouchableOpacity
                onPress={() => setBirthDate('')}
                style={styles.clearButton}
                activeOpacity={0.6}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 기본 안내 문구 (한/베 상하 병기) */}
          <View style={styles.feedbackContainer}>
            <Text style={styles.guideTextKo}>
              예시: 20050412 (숫자 8자리 입력 시 자동 변환)
            </Text>
            <Text style={styles.guideTextVi}>
              Ví dụ: 20050412 (Tự động định dạng khi nhập 8 số)
            </Text>
          </View>
        </View>

        {/* ─── 4. 약관 동의 영역 (Terms Section: 한/베 상하 병기) ─── */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTermsAgreed(!termsAgreed)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              termsAgreed && styles.checkboxChecked,
            ]}
          >
            {termsAgreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.termsTextBox}>
            <Text style={styles.termsTextKo}>
              [필수] 만 14세 이상 확인 및 개인정보 수집·이용 동의
            </Text>
            <Text style={styles.termsTextVi}>
              [Bắt buộc] Xác nhận từ 14 tuổi trở lên và đồng ý điều khoản
            </Text>
          </View>
        </TouchableOpacity>

        {/* ─── 디버그 / 프로토타입 빠른 테스트 프리셋 ─── */}
        <View style={styles.presetSection}>
          <Text style={styles.presetTitle}>
            🧪 프로토타입 테스트 프리셋 (Preset kiểm tra)
          </Text>
          <View style={styles.presetButtonsRow}>
            <TouchableOpacity
              style={[styles.presetButton, styles.presetButtonRed]}
              onPress={() => handlePresetSelect('20140615')}
            >
              <Text style={styles.presetButtonTextRed}>만 12세 (차단)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetButton, styles.presetButtonRed]}
              onPress={() => handlePresetSelect('20130901')}
            >
              <Text style={styles.presetButtonTextRed}>만 13세 (차단)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetButton, styles.presetButtonGreen]}
              onPress={() => handlePresetSelect('20120101')}
            >
              <Text style={styles.presetButtonTextGreen}>만 14세 (통과)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetButton, styles.presetButtonGreen]}
              onPress={() => handlePresetSelect('20020315')}
            >
              <Text style={styles.presetButtonTextGreen}>성인 (통과)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetButton, styles.presetButtonOrange]}
              onPress={() => handlePresetSelect('20120229')}
            >
              <Text style={styles.presetButtonTextOrange}>윤년 (02.29)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ─── 5. 하단 액션 버튼 (Bottom Bar: 한/베 상하 병기) ─── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !isButtonEnabled && styles.confirmButtonDisabled,
          ]}
          disabled={!isButtonEnabled}
          onPress={handleConfirmPress}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.confirmButtonTextKo,
              !isButtonEnabled && styles.confirmButtonTextDisabled,
            ]}
          >
            확인
          </Text>
          <Text
            style={[
              styles.confirmButtonTextVi,
              !isButtonEnabled && styles.confirmButtonTextDisabled,
            ]}
          >
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── 6. 결과 안내 팝업 모달 (한국어 / 베트남어 상하 병기) ─── */}
      <Modal
        visible={modalType !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {modalType === 'pass' ? (
              // Case A: 만 14세 이상 통과 팝업
              <>
                <View style={[styles.modalIconBox, styles.modalIconBoxPass]}>
                  <Text style={styles.modalIconTextPass}>✓</Text>
                </View>
                <Text style={styles.modalTitle}>연령 확인 완료</Text>
                <View style={styles.modalContentBox}>
                  <Text style={styles.modalKoText}>
                    연령 확인이 완료되었습니다. 레벨 선택을 진행해 주세요.
                  </Text>
                  <Text style={styles.modalViText}>
                    Việc xác minh độ tuổi đã hoàn tất. Vui lòng chọn cấp độ.
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.modalActionButtonPass]}
                  onPress={handleModalConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalActionTextKo}>확인</Text>
                  <Text style={styles.modalActionTextVi}>Xác nhận</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Case B: 만 14세 미만 차단 팝업
              <>
                <View style={[styles.modalIconBox, styles.modalIconBoxBlock]}>
                  <Text style={styles.modalIconTextBlock}>🚫</Text>
                </View>
                <Text style={styles.modalTitle}>서비스 가입 제한 안내</Text>
                <View style={styles.modalContentBox}>
                  <Text style={styles.modalKoText}>
                    만 14세 미만은 법령 및 운영 정책에 따라 가입이 제한됩니다.
                  </Text>
                  <Text style={styles.modalViText}>
                    Việc đăng ký bị hạn chế đối với cá nhân dưới 14 tuổi, tuân theo quy định pháp luật và các chính sách vận hành.
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.modalActionButtonBlock]}
                  onPress={handleModalConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalActionTextKo}>확인</Text>
                  <Text style={styles.modalActionTextVi}>Xác nhận</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── 스타일 정의: 테마 적용 OFF (기본/뉴트럴 스타일, 한/베 상하 병기) ───
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeftPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitleKo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerTitleVi: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  introSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
      default: { elevation: 2 },
    }),
  },
  iconText: {
    fontSize: 26,
  },
  titleKo: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
  },
  titleVi: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: '100%',
  },
  subtitleKo: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 2,
  },
  subtitleVi: {
    fontSize: 11.5,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  inputSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputLabelBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 6,
  },
  inputLabelKo: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  inputLabelVi: {
    fontSize: 11.5,
    color: '#64748b',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 2,
    ...Platform.select({
      web: { outlineStyle: 'none' },
    }),
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  feedbackContainer: {
    marginTop: 8,
  },
  guideTextKo: {
    fontSize: 11.5,
    color: '#94a3b8',
  },
  guideTextVi: {
    fontSize: 10.5,
    color: '#94a3b8',
    marginTop: 1,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  termsTextBox: {
    flex: 1,
  },
  termsTextKo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
  },
  termsTextVi: {
    fontSize: 11.5,
    color: '#64748b',
    lineHeight: 16,
    marginTop: 2,
  },
  presetSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetButtonRed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  presetButtonTextRed: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#dc2626',
  },
  presetButtonGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  presetButtonTextGreen: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#16a34a',
  },
  presetButtonOrange: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  presetButtonTextOrange: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#ea580c',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  confirmButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)' },
      default: { elevation: 3 },
    }),
  },
  confirmButtonDisabled: {
    backgroundColor: '#cbd5e1',
    ...Platform.select({
      web: { boxShadow: 'none' },
      default: { elevation: 0 },
    }),
  },
  confirmButtonTextKo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  confirmButtonTextVi: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dbeafe',
    marginTop: 1,
  },
  confirmButtonTextDisabled: {
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
      default: { elevation: 6 },
    }),
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconBoxPass: {
    backgroundColor: '#f0fdf4',
  },
  modalIconTextPass: {
    fontSize: 26,
    color: '#16a34a',
    fontWeight: '700',
  },
  modalIconBoxBlock: {
    backgroundColor: '#fef2f2',
  },
  modalIconTextBlock: {
    fontSize: 26,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalContentBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalKoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  modalViText: {
    fontSize: 12.5,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalActionButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionButtonPass: {
    backgroundColor: '#2563eb',
  },
  modalActionButtonBlock: {
    backgroundColor: '#dc2626',
  },
  modalActionTextKo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalActionTextVi: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dbeafe',
    marginTop: 1,
  },
});
