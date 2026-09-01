// 테마별 브랜드 자산(캐릭터·아이콘) 레지스트리.
//
// 참조 앱의 실제 그래픽을 쓰는 테마만 여기 등록한다. 등록이 없는 테마는
// 기존 기본값(K-Chao 캐릭터, SVG 마크)을 그대로 쓴다 — 배선부는 전부 옵셔널.
//
// 말해보카: Google Play 공식 스크린샷·GDWEB 수상작 이미지에서 잘라낸 원본 자산.
//  - 현행 마스코트: 검은 고양이(메인)·분홍 토끼(빼꼼)
//  - 초기(2023) 캐릭터: 금붕어(학사모)·부엉이(모자)
//  - 퀵메뉴 아이콘 4종: 캐릭터 상점 · 도전 과제 · 영어 사전 · 기억력 부스터
// ⚠️ 디자인 시안 비교용 참조 자산이다 — 실서비스 출시물에 쓰면 안 된다(타사 저작물).

export interface ThemeAssets {
  /** 완료(축하) 화면의 얼굴 — 메인 마스코트 */
  character: any;
  /** 세트 완료 화면용 대체 캐릭터 (없으면 character) */
  characterAlt?: any;
  /** 화면 가장자리에서 빼꼼 내다보는 캐릭터 (우하단 기준으로 자른 이미지) */
  peek?: any;
  /** 말풍선(토스트) 옆에 붙는 작은 캐릭터 */
  bubble?: any;
  /** 목록 행 선두에 붙는 아이콘들 (행마다 순환) */
  rowIcons?: any[];
}

export const THEME_ASSETS: Record<string, ThemeAssets> = {
  malhaeboka: {
    character: require('../../assets/themes/malhaeboka/char-cat.png'),
    characterAlt: require('../../assets/themes/malhaeboka/char-owl.png'),
    peek: require('../../assets/themes/malhaeboka/char-rabbit.png'),
    bubble: require('../../assets/themes/malhaeboka/char-fish.png'),
    rowIcons: [
      require('../../assets/themes/malhaeboka/icon-shop.png'),
      require('../../assets/themes/malhaeboka/icon-quest.png'),
      require('../../assets/themes/malhaeboka/icon-dict.png'),
      require('../../assets/themes/malhaeboka/icon-boost.png'),
    ],
  },
};

export function themeAssets(themeId: string): ThemeAssets | null {
  return THEME_ASSETS[themeId] ?? null;
}
