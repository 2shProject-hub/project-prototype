/**
 * 정답률 구간별 고정 총평 매핑 헬퍼
 * - 90% ~ 100%: 우수 표현 및 긴 문장 확장 추천
 * - 80% ~ 89%: 실생활 활용 수준 및 뉘앙스 구분 추천
 * - 70% ~ 79%: 핵심 단어 기억 칭찬 및 회화 문형 훈련 추천
 * - 60% ~ 69%: 한-베 언어 구조 차이 격려 및 섀도잉 추천
 * - 60% 미만: 자모음/기초 단어 작은 성취 격려
 * - 소수점(Math.round) 처리, 음수/초과/null/NaN 안전 Fallback 처리
 */

export interface FeedbackMessage {
  ko: string;
  vi: string;
}

export const ACCURACY_FEEDBACK_MAP: Array<{
  minScore: number;
  maxScore: number;
  message: FeedbackMessage;
}> = [
  {
    minScore: 90,
    maxScore: 100,
    message: {
      ko: '다양한 표현을 상황에 맞게 매끄럽게 연결해내는 뛰어난 실력을 보여주었습니다. 이제는 단문 중심을 넘어 긴 문장으로 자신의 생각과 느낌을 구체적으로 표현하는 연습을 적극 추천합니다.',
      vi: 'Bạn đã thể hiện kỹ năng xuất sắc khi kết nối mượt mà các biểu đạt phù hợp với từng tình huống. Giờ đây, bạn nên tích cực luyện tập diễn đạt suy nghĩ và cảm xúc của mình bằng các câu dài hơn là chỉ dừng lại ở câu đơn.',
    },
  },
  {
    minScore: 80,
    maxScore: 89,
    message: {
      ko: '전반적인 학습 성취도가 우수하여 실생활 대화에서도 자신감 있게 활용할 수 있는 수준입니다. 비슷한 의미를 가진 단어들의 뉘앙스 차이를 구분해 보는 연습을 더하면 상위 단계로 빠르게 도약할 것입니다.',
      vi: 'Mức độ hoàn thành học tập nhìn chung rất xuất sắc, bạn có thể tự tin áp dụng vào giao tiếp thực tế. Hãy luyện tập thêm việc phân biệt sắc thái các từ đồng nghĩa để nhanh chóng nâng cao trình độ.',
    },
  },
  {
    minScore: 70,
    maxScore: 79,
    message: {
      ko: '핵심 단어와 기본 표현을 잘 기억하고 있으며 학습에 대한 흥미가 잘 드러납니다. 다만 단어를 문장으로 길게 엮어 말할 때 어순이 헷갈릴 수 있으니, 자주 쓰는 기본 회화 문형을 통째로 소리 내어 익히는 훈련이 도움이 됩니다.',
      vi: 'Bạn ghi nhớ tốt các từ vựng cốt lõi và biểu đạt cơ bản, thể hiện sự hứng thú cao trong học tập. Tuy nhiên, khi ghép từ thành câu dài có thể dễ nhầm lẫn trật tự từ, hãy luyện đọc to cả mẫu câu giao tiếp cơ bản thường dùng.',
    },
  },
  {
    minScore: 60,
    maxScore: 69,
    message: {
      ko: '한국어와 베트남어의 언어 구조 차이로 인해 문법 적용에 다소 어려움을 겪을 수 있는 시기입니다. 배운 표현을 원어민 음성으로 집중해서 듣고 그대로 섀도잉(따라 말하기)하는 과정을 통해 귀와 입을 먼저 트이게 만들어 보세요.',
      vi: 'Do sự khác biệt về cấu trúc ngôn ngữ giữa tiếng Hàn và tiếng Việt, đây là giai đoạn bạn có thể gặp chút khó khăn khi áp dụng ngữ pháp. Hãy tập trung nghe phát âm của người bản xứ và luyện nói đuổi (shadowing) để tai và miệng quen dần nhé.',
    },
  },
  {
    minScore: 0,
    maxScore: 59,
    message: {
      ko: '새로운 언어를 배우는 첫 단계에서는 누구나 헷갈리고 실수할 수 있습니다. 점수에 연연하기보다 한글 자모음과 필수 기초 단어를 하루에 조금씩 꾸준히 눈으로 보고 소리로 익히는 작은 성취부터 차근차근 만들어가요.',
      vi: 'Ở giai đoạn đầu học một ngôn ngữ mới, ai cũng có thể bỡ ngỡ và mắc lỗi. Đừng quá bận tâm về điểm số, hãy từng bước tích lũy những thành tựu nhỏ bằng cách kiên trì nhìn và nghe bảng chữ cái cùng từ vựng cơ bản mỗi ngày.',
    },
  },
];

/**
 * 정답률(0~100)을 기반으로 해당 구간의 총평 객체 반환
 * @param accuracy 정답률 숫자 (예: 82, 79.5, null, undefined 등)
 * @returns { ko: string, vi: string }
 */
export function getFeedbackByAccuracy(accuracy: number | null | undefined): FeedbackMessage {
  // 1. null, undefined, NaN 가드 처리 (기본값 0점 구간)
  if (accuracy === null || accuracy === undefined || Number.isNaN(Number(accuracy))) {
    return ACCURACY_FEEDBACK_MAP[ACCURACY_FEEDBACK_MAP.length - 1].message;
  }

  // 2. 소수점 반올림(Math.round) 및 0 ~ 100 범위 클램핑(Clamping)
  const numericScore = Number(accuracy);
  const normalized = Math.max(0, Math.min(100, Math.round(numericScore)));

  // 3. 점수 구간 매핑
  const matched = ACCURACY_FEEDBACK_MAP.find(
    (item) => normalized >= item.minScore && normalized <= item.maxScore,
  );

  return (
    matched?.message ??
    ACCURACY_FEEDBACK_MAP[ACCURACY_FEEDBACK_MAP.length - 1].message
  );
}
