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

import { icon } from './graphics';

export interface ThemeAssets {
  /** 완료(축하) 화면의 얼굴 — 메인 마스코트 */
  character: any;
  /** 세트 완료 화면용 대체 캐릭터 (없으면 character) */
  characterAlt?: any;
  /** 화면 가장자리에서 빼꼼 내다보는 캐릭터 (우하단 기준으로 자른 이미지) */
  peek?: any;
  peekBlink?: any;
  /** 말풍선(토스트) 옆에 붙는 작은 캐릭터 */
  bubble?: any;
  /** 목록 행 선두에 붙는 아이콘들 (행마다 순환) */
  rowIcons?: any[];
  /** 하단 내비 아이콘 — 탭 키별 활성/비활성 이미지 */
  navIcons?: Record<string, { on: any; off: any }>;
  /** 홈 코스 카드의 삽화(기본 🏫 이모지 대체) */
  crest?: any;
  /** 완료 화면 캐릭터의 감은 눈 프레임 — 깜빡임 연출용 */
  characterBlink?: any;
  /** 이모지 아이콘 대체 글리프 (ThemedGlyph 가 조회) */
  glyphs?: Record<string, any>;
  /** 화면 구석에 얹는 캐릭터 이모티콘(투명 배경). edge=원본이 한쪽이 잘린 빼꼼 포즈 → 화면 가장자리에 밀착 */
  stickers?: Array<{ img: any; w: number; h: number; edge?: boolean; blink?: any }>;
}

export const THEME_ASSETS: Record<string, ThemeAssets> = {
  malhaeboka: {
    character: require('../../assets/themes/malhaeboka/char-cat.png'),
    characterBlink: require('../../assets/themes/malhaeboka/char-cat-blink.png'),
    characterAlt: require('../../assets/themes/malhaeboka/char-owl.png'),
    peek: require('../../assets/themes/malhaeboka/char-rabbit.png'),
    peekBlink: require('../../assets/themes/malhaeboka/blink-char-rabbit.png'),
    bubble: require('../../assets/themes/malhaeboka/char-fish.png'),
    rowIcons: [
      require('../../assets/themes/malhaeboka/icon-shop.png'),
      require('../../assets/themes/malhaeboka/icon-quest.png'),
      require('../../assets/themes/malhaeboka/icon-dict.png'),
      require('../../assets/themes/malhaeboka/icon-boost.png'),
    ],
    // 말해보카 하단 내비 글리프(어휘·리스닝·리그·프리미엄)를 우리 탭에 대응
    // 하단 내비 — 상용 수준 선명도를 위해 벡터 스트로크로 (활성 보라 / 비활성 회색)
    navIcons: {
      home: { on: require('../../assets/themes/malhaeboka/nav-home-on.png'), off: require('../../assets/themes/malhaeboka/nav-home-off.png') },
      report: { on: require('../../assets/themes/malhaeboka/nav-report-on.png'), off: require('../../assets/themes/malhaeboka/nav-report-off.png') },
      'ai-talk': { on: require('../../assets/themes/malhaeboka/nav-chat-on.png'), off: require('../../assets/themes/malhaeboka/nav-chat-off.png') },
      'my-info': { on: require('../../assets/themes/malhaeboka/nav-people-on.png'), off: require('../../assets/themes/malhaeboka/nav-people-off.png') },
    },
    crest: require('../../assets/themes/malhaeboka/char-fish.png'),
    glyphs: {
      // 재생중=검은 해드셋(잘 보이게) / 대기=회색 해드셋 — 2026 벡터 스트로크
      speakerOn: require('../../assets/themes/malhaeboka/icon-headset-on.png'),
      speakerOff: require('../../assets/themes/malhaeboka/icon-headset-off.png'),
      mic: require('../../assets/themes/malhaeboka/icon-mic-egg.png'),
      hint: require('../../assets/themes/malhaeboka/icon-hint-egg.png'),
      book: { uri: icon('bookopen', '#4C34C2', 24, 2) },
      play: { uri: icon('play', '#7150F0', 24, 2) },
      school: require('../../assets/themes/malhaeboka/char-fish.png'),
      write: require('../../assets/themes/malhaeboka/glyph-keyboard.png'),
      kbd: require('../../assets/themes/malhaeboka/icon-keyboard-egg.png'),
      cards: { uri: icon('grid', '#4C34C2', 24, 2) },
      pause: { uri: icon('pause', '#26223A', 24, 2) },
      quest: require('../../assets/themes/malhaeboka/icon-quest.png'),
      dict: require('../../assets/themes/malhaeboka/icon-dict.png'),
    },
    stickers: [
      { img: require('../../assets/themes/malhaeboka/char-rabbit.png'), blink: require('../../assets/themes/malhaeboka/blink-char-rabbit.png'), w: 79, h: 90, edge: true },
      { img: require('../../assets/themes/malhaeboka/sticker-cat.png'), w: 76, h: 90 },
      { img: require('../../assets/themes/malhaeboka/char-fish.png'), w: 58, h: 77 },
      { img: require('../../assets/themes/malhaeboka/sticker-mouse.png'), w: 78, h: 67 },
      { img: require('../../assets/themes/malhaeboka/sticker-crowncat.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-crowncat.png'), w: 75, h: 96 },
      { img: require('../../assets/themes/malhaeboka/sticker-owl.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-owl.png'), w: 78, h: 72 },
      { img: require('../../assets/themes/malhaeboka/sticker-chu.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-chu.png'), w: 88, h: 72 },
      { img: require('../../assets/themes/malhaeboka/sticker-monster.png'), w: 66, h: 74 },
      { img: require('../../assets/themes/malhaeboka/sticker-nana.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-nana.png'), w: 58, h: 79 },
      { img: require('../../assets/themes/malhaeboka/sticker-goldfish.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-goldfish.png'), w: 72, h: 76 },
      { img: require('../../assets/themes/malhaeboka/sticker-fish2.png'), w: 68, h: 69 },
      { img: require('../../assets/themes/malhaeboka/sticker-fish3.png'), blink: require('../../assets/themes/malhaeboka/blink-sticker-fish3.png'), w: 72, h: 60 },
    ],
  },
};

export function themeAssets(themeId: string): ThemeAssets | null {
  return THEME_ASSETS[themeId] ?? null;
}
