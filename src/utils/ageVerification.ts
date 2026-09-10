/**
 * 만 나이 계산 및 날짜 유효성 검증 유틸리티
 * source-a-app 프로덕션 환경으로 100% 동일하게 이식 가능한 순수 함수
 */

export interface AgeCheckResult {
  isValidFormat: boolean;
  isComplete: boolean;
  isUnder14: boolean;
  internationalAge: number;
  errorMessage?: string;
}

/**
 * 8자리 생년월일 문자열(YYYYMMDD 또는 YYYY.MM.DD)의 유효성을 검증하고 만 나이를 계산합니다.
 * @param birthDateStr 입력된 생년월일 문자열
 * @param referenceDate 기준일자 (기본값: 오늘)
 */
export function checkAgeRestriction(
  birthDateStr: string,
  referenceDate: Date = new Date(),
): AgeCheckResult {
  const cleaned = birthDateStr.replace(/[^0-9]/g, '');

  if (cleaned.length < 8) {
    return {
      isValidFormat: false,
      isComplete: false,
      isUnder14: false,
      internationalAge: 0,
    };
  }

  const birthYear = parseInt(cleaned.substring(0, 4), 10);
  const birthMonth = parseInt(cleaned.substring(4, 6), 10);
  const birthDay = parseInt(cleaned.substring(6, 8), 10);

  const currentYear = referenceDate.getFullYear();

  // 기본 연도 범위 검증 (1900년 ~ 현재 연도)
  if (birthYear < 1900 || birthYear > currentYear) {
    return {
      isValidFormat: false,
      isComplete: true,
      isUnder14: false,
      internationalAge: 0,
      errorMessage: '올바른 연도를 입력해 주세요.',
    };
  }

  // 월 범위 검증 (1 ~ 12)
  if (birthMonth < 1 || birthMonth > 12) {
    return {
      isValidFormat: false,
      isComplete: true,
      isUnder14: false,
      internationalAge: 0,
      errorMessage: '올바른 월(01~12)을 입력해 주세요.',
    };
  }

  // 윤년 및 해당 월의 실제 마지막 날짜 계산
  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
  if (birthDay < 1 || birthDay > daysInMonth) {
    return {
      isValidFormat: false,
      isComplete: true,
      isUnder14: false,
      internationalAge: 0,
      errorMessage: `${birthMonth}월은 ${daysInMonth}일까지 있습니다.`,
    };
  }

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  if (isNaN(birthDate.getTime()) || birthDate > referenceDate) {
    return {
      isValidFormat: false,
      isComplete: true,
      isUnder14: false,
      internationalAge: 0,
      errorMessage: '미래 날짜는 입력할 수 없습니다.',
    };
  }

  // 만 나이 계산
  const currentMonth = referenceDate.getMonth() + 1;
  const currentDay = referenceDate.getDate();

  let age = currentYear - birthYear;
  // 올해 생일이 아직 지나지 않은 경우 만 나이 1살 차감
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return {
    isValidFormat: true,
    isComplete: true,
    isUnder14: age < 14,
    internationalAge: age,
  };
}

/**
 * 숫자 입력을 YYYY.MM.DD 형식으로 자동 마스킹 포맷팅합니다.
 * @param text 원본 텍스트
 */
export function formatBirthDateInput(text: string): string {
  const digits = text.replace(/[^0-9]/g, '').slice(0, 8);
  if (digits.length <= 4) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  }
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}
