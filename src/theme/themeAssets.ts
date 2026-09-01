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
  /** 하단 내비 아이콘 — 탭 키별 활성/비활성 이미지 */
  navIcons?: Record<string, { on: any; off: any }>;
  /** 홈 코스 카드의 삽화(기본 🏫 이모지 대체) */
  crest?: any;
  /** 이모지 아이콘 대체 글리프 (ThemedGlyph 가 조회) */
  glyphs?: Record<string, any>;
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
    // 말해보카 하단 내비 글리프(어휘·리스닝·리그·프리미엄)를 우리 탭에 대응
    navIcons: {
      home: { on: require('../../assets/themes/malhaeboka/nav-vocab-on.png'), off: require('../../assets/themes/malhaeboka/nav-vocab-off.png') },
      report: { on: require('../../assets/themes/malhaeboka/nav-league-on.png'), off: require('../../assets/themes/malhaeboka/nav-league-off.png') },
      'ai-talk': { on: require('../../assets/themes/malhaeboka/nav-listen-on.png'), off: require('../../assets/themes/malhaeboka/nav-listen-off.png') },
      'my-info': { on: require('../../assets/themes/malhaeboka/nav-crown-on.png'), off: require('../../assets/themes/malhaeboka/nav-crown-off.png') },
    },
    crest: require('../../assets/themes/malhaeboka/char-fish.png'),
    glyphs: {
      speakerOn: require('../../assets/themes/malhaeboka/nav-listen-on.png'),
      speakerOff: require('../../assets/themes/malhaeboka/nav-listen-off.png'),
      mic: require('../../assets/themes/malhaeboka/glyph-mic.png'),
      hint: require('../../assets/themes/malhaeboka/glyph-hint.png'),
      book: require('../../assets/themes/malhaeboka/nav-vocab-on.png'),
      play: require('../../assets/themes/malhaeboka/glyph-play.png'),
      school: require('../../assets/themes/malhaeboka/char-fish.png'),
      write: require('../../assets/themes/malhaeboka/glyph-keyboard.png'),
      quest: require('../../assets/themes/malhaeboka/icon-quest.png'),
      dict: require('../../assets/themes/malhaeboka/icon-dict.png'),
    },
  },
};

export function themeAssets(themeId: string): ThemeAssets | null {
  return THEME_ASSETS[themeId] ?? null;
}
