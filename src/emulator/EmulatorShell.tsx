/**
 * 에뮬레이터 쉘 — 웹 전용 (Platform.OS === 'web')
 * 구성: 좌측 컨트롤 패널 | 중앙 디바이스 프레임 | 우측 정보 패널
 */
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Animated } from 'react-native';
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import { colors } from '../theme/colors';
import { LangProvider } from '../components/LangContext';
import { SCREEN_REGISTRY, getScreen } from './screenRegistry';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { ThemeGalleryScreen } from '../screens/ThemeGalleryScreen';
import { applyThemeToDom } from '../theme/applyThemeToDom';
import { svgDataUri } from '../theme/graphics';
import { BlinkSprite } from '../theme/BlinkSprite';
import { themeAssets } from '../theme/themeAssets';
import { MB_SCREENS } from '../theme/mb/registry';
import { FlowProgressContext } from '../theme/mb/FlowContext';
import type { Theme } from '../theme/themeTypes';

// 화면 컴포넌트 임포트
import { HomeScreen } from '../screens/HomeScreen';
import { MissionTutorStage } from '../screens/MissionTutorStage';
import { IntroTutorStage } from '../screens/IntroTutorStage';
import { IntroEvalStage } from '../screens/IntroEvalStage';
import { WordBuildStage } from '../screens/WordBuildStage';
import { SentenceBuildStage } from '../screens/SentenceBuildStage';
import { SentenceBuildStage2 } from '../screens/SentenceBuildStage2';
import { VocabWordbookVoiceStage } from '../screens/VocabWordbookVoiceStage';
import { SetWordbookEvalStage } from '../screens/SetWordbookEvalStage';
import { GrammarDetailStage } from '../screens/GrammarDetailStage';
import { QuickReviewStage } from '../screens/QuickReviewStage';
import { CultureStage } from '../screens/CultureStage';
import { WordDetailStage } from '../screens/WordDetailStage';
import { VideoBridgeStage } from '../screens/VideoBridgeStage';
import { SlideExplainStage } from '../screens/SlideExplainStage';
import { ListenSelect1 } from '../screens/ListenSelect1';
import { WordVnKoSelect2 } from '../screens/WordVnKoSelect2';
import { WordSound1 } from '../screens/WordSound1';
import { WordLetterBlank } from '../screens/WordLetterBlank';
import { SetCompleteStage } from '../screens/SetCompleteStage';
import { SentenceBlank1 } from '../screens/SentenceBlank1';
import { WordBlank1 } from '../screens/WordBlank1';
import { ListenTyping1 } from '../screens/ListenTyping1';
import { SentenceSelect1 } from '../screens/SentenceSelect1';
import { SpeakingEvalStage } from '../screens/SpeakingEvalStage';
import { LearningReportStage } from '../screens/LearningReportStage';
import { PracticalSpeakingStage } from '../screens/PracticalSpeakingStage';
import { CompletionCelebrationVocabStage } from '../screens/CompletionCelebrationVocabStage';
import { CompletionCelebrationGrammarStage } from '../screens/CompletionCelebrationGrammarStage';
import { CompletionCelebrationClassStage } from '../screens/CompletionCelebrationClassStage';
import { GrammarCompleteStage } from '../screens/GrammarCompleteStage';
import { WordIntroSlidesStage } from '../screens/WordIntroSlidesStage';
import { VideoAITutorStage } from '../screens/VideoAITutorStage';
import { AITutorDescStage } from '../screens/AITutorDescStage';
import { ConversationPreviewStage } from '../screens/ConversationPreviewStage';
import { ConversationShadowingStage } from '../screens/ConversationShadowingStage';
import DialogueListenWriteStage from '../screens/DialogueListenWriteStage';
import PracticeCheckStage from '../screens/PracticeCheckStage';
import { defaultSessionState, LEARNING_FLOW } from '../data/lessonData';
import { useLang, pick, type Lang } from '../components/LangContext';

// ─── 디바이스 프리셋 ───────────────────────────────────────────────
const DEVICES = [
  { id: 'iphone15', label: 'iPhone 15', os: 'iOS', w: 390, h: 844 },
  { id: 'iphone-se', label: 'iPhone SE', os: 'iOS', w: 375, h: 667 },
  { id: 'android-std', label: 'Android 표준', os: 'AOS', w: 360, h: 800 },
  { id: 'android-budget', label: '보급형 Android', os: 'AOS', w: 360, h: 640 },
  { id: 'android-lg', label: 'Android 대형', os: 'AOS', w: 412, h: 917 },
];

// ─── 화면 → 컴포넌트 렌더러 ────────────────────────────────────────
// 브랜드 자산 테마: 화면마다 다른 캐릭터가 응원 말풍선과 함께 우하단에서 빼꼼 (터치 통과).
// 자체 캐릭터가 있는 화면(홈·5-2·세트완료·축하)과 튜터 아바타·화자 썸네일이 있는 화면은 제외 —
// 캐릭터가 아바타를 가리면 안 된다.
const STICKER_EXCLUDE = new Set([
  'home', 'mission-tutor', 'intro-word', 'intro-tutor', 'intro-tutor-2', 'intro-eval',
  'video-ai-tutor', 'ai-tutor-desc', 'conversation-preview', 'conversation-shadowing',
  'dialogue-listen-write', 'practice-check', 'word-intro-slides', 'grammar-detail',
  'vocab-wordbook-voice',
]);
const CHEERS: Array<[string, string]> = [
  ['잘하고 있어요!', 'Bạn đang làm rất tốt!'],
  ['조금만 더 힘내요!', 'Cố lên chút nữa nhé!'],
  ['오늘도 화이팅!', 'Hôm nay cũng cố lên!'],
  ['멋져요, 바로 그거예요!', 'Tuyệt lắm, chính là như vậy!'],
  ['천천히 해도 괜찮아요', 'Từ từ cũng không sao đâu'],
  ['거의 다 왔어요!', 'Sắp xong rồi!'],
  ['대단해요, 계속 가요!', 'Giỏi lắm, tiếp tục nào!'],
  ['한 걸음씩 성장 중!', 'Từng bước tiến bộ!'],
  ['집중력 최고예요!', 'Tập trung tuyệt vời!'],
  ['해낼 줄 알았어요!', 'Biết ngay bạn làm được mà!'],
  ['실수해도 괜찮아요', 'Sai cũng không sao nhé'],
  ['같이 하니까 재밌죠?', 'Học cùng nhau vui nhỉ?'],
  ['벌써 이만큼 왔어요!', 'Đã đi được chừng này rồi!'],
  ['내일의 나가 고마워할 거예요', 'Ngày mai bạn sẽ cảm ơn hôm nay'],
  ['이 단어, 곧 내 거예요!', 'Từ này sắp là của bạn rồi!'],
  ['소리 내어 말해 봐요!', 'Thử nói to lên nào!'],
  ['어제보다 늘었어요!', 'Giỏi hơn hôm qua rồi!'],
  ['포기하지 않는 게 실력!', 'Không bỏ cuộc chính là thực lực!'],
  ['좋은 흐름이에요!', 'Đang vào guồng tốt lắm!'],
  ['쉬어가도 괜찮아요', 'Nghỉ một chút cũng được mà'],
  ['발음이 점점 좋아져요!', 'Phát âm ngày càng hay!'],
  ['귀가 트이고 있어요!', 'Tai bạn đang mở ra đó!'],
  ['단어가 머리에 쏙쏙!', 'Từ vựng vào đầu vèo vèo!'],
  ['오늘의 나, 칭찬해요!', 'Hôm nay bạn thật đáng khen!'],
  ['한 문장이 큰 한 걸음!', 'Một câu là một bước lớn!'],
  ['틀려도 배우는 중!', 'Sai cũng là đang học!'],
  ['목소리가 자신감 있어요!', 'Giọng bạn thật tự tin!'],
  ['꾸준함이 이겨요!', 'Kiên trì sẽ thắng!'],
  ['뇌가 좋아하고 있어요!', 'Não bạn đang thích lắm!'],
  ['오, 감각 있는데요?', 'Ồ, có năng khiếu đấy!'],
  ['이 페이스 최고예요!', 'Nhịp độ này tuyệt vời!'],
  ['복습이 실력을 만들어요', 'Ôn tập tạo nên thực lực'],
  ['조금씩, 매일매일!', 'Từng chút một, mỗi ngày!'],
  ['벌써 습관이 됐어요!', 'Đã thành thói quen rồi!'],
  ['다음 문제도 문제없죠!', 'Câu sau cũng không thành vấn đề!'],
  ['집중 모드 발동!', 'Chế độ tập trung bật!'],
  ['어휘 부자 되는 중!', 'Đang thành phú ông từ vựng!'],
  ['들리는 만큼 말해져요!', 'Nghe được bao nhiêu, nói được bấy nhiêu!'],
  ['시작이 반, 이미 반!', 'Bắt đầu là một nửa rồi!'],
  ['멋진 도전이에요!', 'Thử thách tuyệt vời!'],
  ['배움에 늦음은 없어요', 'Học không bao giờ là muộn'],
  ['내 페이스대로 가요', 'Đi theo nhịp của mình'],
  ['오늘도 한 뼘 성장!', 'Hôm nay lại lớn thêm một chút!'],
  ['그 발음 아주 좋아요!', 'Phát âm đó hay lắm!'],
  ['기억력이 반짝반짝!', 'Trí nhớ sáng lấp lánh!'],
  ['꼼꼼하게 잘 보고 있네요!', 'Bạn quan sát kỹ thật đấy!'],
  ['지금 페이스 딱 좋아요', 'Nhịp này chuẩn luôn'],
  ['한국어가 가까워지고 있어요', 'Tiếng Hàn đang gần bạn hơn'],
  ['어려운 걸 해내는 중!', 'Bạn đang làm điều khó đấy!'],
  ['오늘 배운 건 내일의 무기!', 'Hôm nay học, mai là vũ khí!'],
  ['듣는 귀가 예리해요!', 'Đôi tai thật tinh!'],
  ['정확도가 올라가요!', 'Độ chính xác đang tăng!'],
  ['스스로 해내서 멋져요', 'Tự làm được, thật tuyệt'],
  ['모르면 배우면 돼요!', 'Chưa biết thì học thôi!'],
  ['좋은 습관이 자라요', 'Thói quen tốt đang lớn lên'],
  ['한 문제씩 차근차근', 'Từng câu một, chậm mà chắc'],
  ['오늘의 미션 클리어 중!', 'Đang phá đảo nhiệm vụ hôm nay!'],
  ['베트남에서 한국까지 파이팅!', 'Từ Việt Nam đến Hàn Quốc, cố lên!'],
  ['당신의 노력이 보여요', 'Thấy rõ nỗ lực của bạn'],
];
// 반복 방지용 셔플 백 — 풀 전체를 다 쓰기 전에는 같은 것이 다시 나오지 않는다
function makeBag(size: number) {
  let bag: number[] = [];
  return () => {
    if (!bag.length) {
      bag = Array.from({ length: size }, (_, i) => i);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop()!;
  };
}
// 캐릭터는 원본 12종 × 좌/우 빼꼼 = 24변형 (+틸트 미세 변주)
const drawSticker = makeBag(24);
const drawCheer = makeBag(60);

// 화면별 고정 캐릭터: s=스티커 인덱스(4=왕관 고양이 — 진한 색이라 어디서든 또렷), cheer=전용 멘트
const STICKER_PIN: Record<string, { s: number; cheer: [string, string] }> = {
  'word-vn-ko-select-2': { s: 4, cheer: ['뜻을 떠올리며 골라봐요!', 'Nhớ nghĩa rồi chọn nhé!'] },
};

// 말해보카: 화면 전환 시 페이드+라이즈 — 상용 앱의 화면 진입 이펙트
function MbScreenTransition({ enabled, screenKey, children }: { enabled: boolean; screenKey: string; children: React.ReactNode }) {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!enabled) { a.setValue(1); return; }
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  }, [screenKey, enabled, a]);
  if (!enabled) return <View style={{ flex: 1 }}>{children}</View>;
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: a,
        // 세로 이동 없이 페이드만 — 전환 때 레이아웃이 밀려 보이는 느낌을 없앤다
      }}
    >
      {children}
    </Animated.View>
  );
}

// 화면 진입 시 학습자가 집중할 본문 핵심 블록(가장 큰 카드/보기 묶음)을 잠깐 키웠다 되돌린다.
// 시선 유도용 원샷 — 상용 학습앱의 진입 어포던스.
function MbFocusPulse({ enabled, screenId }: { enabled: boolean; screenId: string }) {
  useEffect(() => {
    if (!enabled || Platform.OS !== 'web') return;
    const t = setTimeout(() => {
      try {
        const frame = document.querySelector('[data-device-screen]') as HTMLElement | null;
        if (!frame) return;
        const fr = frame.getBoundingClientRect();
        let bestEl: HTMLElement | null = null;
        let bestArea = 0;
        frame.querySelectorAll('div').forEach((n) => {
          const e = n as HTMLElement;
          const r = e.getBoundingClientRect();
          if (r.top < fr.top + 70 || r.bottom > fr.bottom - 54) return; // 헤더/푸터 제외
          if (r.width < fr.width * 0.55 || r.height < 90 || r.height > fr.height * 0.72) return;
          const cs = getComputedStyle(e);
          if (cs.borderRadius === '0px' && cs.backgroundColor === 'rgba(0, 0, 0, 0)') return;
          const area = r.width * r.height;
          if (area > bestArea) { bestArea = area; bestEl = e; }
        });
        const target = bestEl as HTMLElement | null;
        if (target && typeof target.animate === 'function') {
          target.animate(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(1.045)', offset: 0.45 },
              { transform: 'scale(1)' },
            ],
            { duration: 640, easing: 'cubic-bezier(.34,1.3,.5,1)' },
          );
        }
      } catch {}
    }, 430);
    return () => clearTimeout(t);
  }, [enabled, screenId]);
  return null;
}

function ScreenSticker({ theme, enabled, screenId }: { theme: Theme; enabled: boolean; screenId: string }) {
  const { lang } = useLang();
  // 눈 깜빡임 — 감은 눈 프레임이 있으면 표시 중 1~2회 깜빡인다
  const [blinkOn, setBlinkOn] = useState(false);
  useEffect(() => {
    let alive = true;
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    [700, 1500].forEach((at) => {
      timers.push(setTimeout(() => { if (alive) setBlinkOn(true); }, at));
      timers.push(setTimeout(() => { if (alive) setBlinkOn(false); }, at + 130));
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [screenId]);
  // 등장(빠르게) → 응원 멘트 → 멘트와 캐릭터가 함께 퇴장. 화면을 오래 가리지 않는다.
  const charY = useRef(new Animated.Value(60)).current;
  const charOp = useRef(new Animated.Value(1)).current;
  const bubble = useRef(new Animated.Value(0)).current;
  // 생동감: 살랑이는 플로팅 + 이따금 깜빡(스쿼시)
  const bob = useRef(new Animated.Value(0)).current;
  const squash = useRef(new Animated.Value(1)).current;
  // 방문할 때마다 셔플 백에서 뽑는다 — 풀을 다 돌기 전엔 반복 없음
  // 일부 화면은 배경과 대비가 또렷한 캐릭터를 고정한다 (밝은 사진 카드 위에서 흐린 캐릭터가 묻히는 화면)
  const pinned = STICKER_PIN[screenId];
  const picked = useMemo(
    () => pinned
      ? { s: pinned.s, c: 0, cheer: pinned.cheer, tilt: 0, size: 1.08 }
      : { s: drawSticker(), c: drawCheer(), cheer: undefined as [string, string] | undefined, tilt: [-6, 0, 6][Math.floor(Math.random() * 3)], size: [0.9, 1, 1.12][Math.floor(Math.random() * 3)] },
    [screenId],
  );
  useEffect(() => {
    charY.setValue(60);
    charOp.setValue(1);
    bubble.setValue(0);
    if (!enabled) return;
    bob.setValue(0);
    squash.setValue(1);
    const seq = Animated.sequence([
      // 통통 튀며 등장 (스프링)
      Animated.spring(charY, { toValue: 0, friction: 5, tension: 130, useNativeDriver: false }),
      Animated.timing(bubble, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.delay(1500),
      Animated.parallel([
        Animated.timing(bubble, { toValue: 0, duration: 220, useNativeDriver: false }),
        Animated.timing(charY, { toValue: 110, duration: 260, useNativeDriver: false }),
        Animated.timing(charOp, { toValue: 0, duration: 260, useNativeDriver: false }),
      ]),
    ]);
    // 살아있는 느낌 — 잔잔한 플로팅 + 깜빡 스쿼시 (표시되는 동안만)
    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -4, duration: 700, useNativeDriver: false }),
        Animated.timing(bob, { toValue: 0, duration: 700, useNativeDriver: false }),
      ]),
    );
    const blink = Animated.loop(
      Animated.sequence([
        Animated.delay(1100),
        Animated.timing(squash, { toValue: 0.9, duration: 80, useNativeDriver: false }),
        Animated.timing(squash, { toValue: 1, duration: 130, useNativeDriver: false }),
      ]),
    );
    seq.start();
    idle.start();
    blink.start();
    return () => { seq.stop(); idle.stop(); blink.stop(); };
  }, [screenId, enabled, theme.id, charY, charOp, bubble]);

  // 콘텐츠를 안 가리는 자리 찾기 — 화면의 텍스트 리프 실측과 겹침 0 인 후보를 고른다.
  // 텍스트 겹침은 절대 금지(가중 1000), 그 외에는 기본 위치(하단 구석)를 선호한다.
  const wrapRef = useRef<any>(null);
  const [pos, setPos] = useState<{ side: 'l' | 'r'; bottom: number; noBubble?: boolean; hidden?: boolean } | null>(null);
  useEffect(() => {
    setPos(null);
    if (!enabled || Platform.OS !== 'web') return;
    if (STICKER_EXCLUDE.has(screenId) || screenId.startsWith('set-wordbook') || screenId.startsWith('completion-')) return;
    const all = themeAssets(theme.id)?.stickers;
    if (!all || !all.length) return;
    const stk = all[picked.s % all.length];
    const flipped = picked.s >= all.length;
    const fallback = { side: (flipped ? 'l' : 'r') as 'l' | 'r', bottom: 88 };
    const t = setTimeout(() => {
      try {
        const node = wrapRef.current as unknown as HTMLElement | null;
        const frame = node && node.closest ? (node.closest('[data-device-screen]') as HTMLElement | null) : null;
        if (!frame) { setPos(fallback); return; }
        const fr = frame.getBoundingClientRect();
        // 실루엣은 실측 — 자리만 옮기므로 크기는 위치와 무관하게 유효하다 (숨긴 채 렌더돼 있음)
        const selfR = node!.getBoundingClientRect();
        const foot = selfR.width > 40 && selfR.height > 40
          ? { w: selfR.width, h: selfR.height }
          : { w: Math.max(stk.w * picked.size, 170), h: stk.h * picked.size + 58 };
        const texts: Array<{ left: number; right: number; top: number; bottom: number }> = [];
        frame.querySelectorAll('div,span,p').forEach((n) => {
          const e = n as HTMLElement;
          if (e.children.length) return;
          if (!(e.textContent || '').trim()) return;
          const r = e.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          texts.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
        });
        // 이미지·캔버스(차트/사진)는 약한 가중치로 회피 — 텍스트만큼 절대적이진 않지만 되도록 안 가린다
        const media: Array<{ left: number; right: number; top: number; bottom: number }> = [];
        frame.querySelectorAll('img,canvas,[tabindex]').forEach((n) => {
          const r = (n as HTMLElement).getBoundingClientRect();
          if (r.width < 24 || r.height < 24) return;
          if (r.width > fr.width * 0.96 && r.height > 200) return; // 화면급 래퍼는 제외
          media.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
        });
        const sides: Array<'l' | 'r'> = flipped ? ['l', 'r'] : ['r', 'l'];
        const evaluate = (fw: number, fh: number) => {
          let best: { side: 'l' | 'r'; bottom: number; ov: number; ord: number } | null = null;
          let idx = 0;
          for (const side of sides) {
            for (const bottom of [88, 124, 160, 196, 232, 268, 304, 340, 376, 412]) {
              const x = side === 'l' ? fr.left : fr.right - fw;
              const y = fr.bottom - bottom - fh;
              idx++;
              if (y < fr.top + 70) continue; // 헤더/진행바는 피한다
              let textOv = 0;
              for (const r of texts) {
                const ix = Math.max(0, Math.min(x + fw, r.right) - Math.max(x, r.left));
                const iy = Math.max(0, Math.min(y + fh, r.bottom) - Math.max(y, r.top));
                textOv += ix * iy;
              }
              let mediaOv = 0;
              for (const r of media) {
                const ix = Math.max(0, Math.min(x + fw, r.right) - Math.max(x, r.left));
                const iy = Math.max(0, Math.min(y + fh, r.bottom) - Math.max(y, r.top));
                mediaOv += ix * iy;
              }
              const ov = textOv + mediaOv / 40; // 텍스트 1px² = 이미지 40px² 비중 — 차트/사진 덮개도 사실상 차단
              if (!best || ov < best.ov - 0.5 || (Math.abs(ov - best.ov) <= 0.5 && idx < best.ord)) {
                best = { side, bottom, ov, ord: idx };
              }
            }
          }
          return best;
        };
        const full = evaluate(foot.w, foot.h);
        if (full && full.ov < 40) { setPos({ side: full.side, bottom: full.bottom }); return; } // 텍스트 0 + 이미지 소량까지 허용
        // 캐릭터는 항상 멘트와 함께 — 깨끗한 자리가 없으면 이 화면은 접는다 (텍스트는 절대 가리지 않는다)
        setPos({ ...fallback, hidden: true });
      } catch {
        setPos(fallback);
      }
    }, 260);
    return () => clearTimeout(t);
  }, [screenId, enabled, theme.id, picked]);

  const stickers = enabled ? themeAssets(theme.id)?.stickers : undefined;
  if (!stickers || !stickers.length) return null;
  // 아바타 화면·자체 캐릭터 화면(홈·5-2·축하) 제외. 세트 완료(step 9·15…)에는 나온다.
  if (STICKER_EXCLUDE.has(screenId) || screenId.startsWith('set-wordbook') || screenId.startsWith('completion-')) return null;
  const st = stickers[picked.s % stickers.length];
  const flip = picked.s >= stickers.length; // 후반 10변형은 좌측에서 빼꼼 (좌우 반전)
  const cheer = picked.cheer ?? CHEERS[picked.c % CHEERS.length];
  const c = theme.colors;
  if (pos && pos.hidden) return null;
  const sideL = pos ? pos.side === 'l' : flip;
  return (
    <View
      ref={wrapRef}
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: pos ? pos.bottom : 88,
        opacity: Platform.OS === 'web' && !pos ? 0 : 1,
        // 원본이 잘린 빼꼼 포즈(edge)는 가장자리 밀착, 완전한 스프라이트는 8px 띄운다
        ...(sideL
          ? { left: st.edge ? 0 : 8, alignItems: 'flex-start' as const }
          : { right: st.edge ? 0 : 8, alignItems: 'flex-end' as const }),
      }}
    >
      {/* 응원 말풍선 — 깨끗한 자리가 없으면 접고 캐릭터만 나온다 */}
      {pos && pos.noBubble ? null : <Animated.View
        style={{
          maxWidth: 190,
          ...(sideL ? { marginLeft: st.w - 14 } : { marginRight: st.w - 14 }),
          marginBottom: -6,
          opacity: bubble,
          transform: [{ translateY: bubble.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
        }}
      >
        <View
          style={{
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.line,
            borderRadius: 14,
            paddingHorizontal: 11,
            paddingVertical: 7,
            maxWidth: 168,
            shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ fontSize: 12, color: c.ink, fontWeight: '600' }}>{pick(lang, cheer[0], cheer[1])}</Text>
        </View>
        <View
          style={{
            ...(sideL ? { alignSelf: 'flex-start', marginLeft: 10 } : { alignSelf: 'flex-end', marginRight: 10 }),
            marginTop: -1,
            width: 10, height: 10, backgroundColor: c.surface,
            borderRightWidth: 1, borderBottomWidth: 1, borderColor: c.line,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </Animated.View>}
      <Animated.View
        style={{
          width: st.w, height: st.h, opacity: charOp,
          transform: [
            { translateY: Animated.add(charY, bob) as any },
            { scaleX: sideL ? -1 : 1 },
            { scaleY: squash },
            { rotate: `${picked.tilt}deg` },
            { scale: picked.size },
          ],
        }}
      >
        <BlinkSprite img={st.img} blink={st.blink} on={blinkOn} w={st.w} h={st.h} />
      </Animated.View>
    </View>
  );
}

function ScreenRenderer({ screenId, onNavigate, flowStep, flowTotal }: { screenId: string; onNavigate: (id: string) => void; flowStep?: number; flowTotal?: number }) {
  const [sessions] = useState({ 1: defaultSessionState() });
  const { theme: mbTheme, enabled: mbEnabled } = useTheme();

  // 말해보카 테마 전용 화면 — 등록된 화면은 완전히 다른 소스로 렌더 (타 테마 무영향)
  if (mbEnabled && mbTheme.id === 'malhaeboka' && MB_SCREENS[screenId]) {
    return MB_SCREENS[screenId]({ onNavigate, flowStep, flowTotal });
  }

  // LEARNING_FLOW에서 현재 화면의 setNumber 추출
  const flowScreenInfo = LEARNING_FLOW.find(s => s.screenId === screenId);
  const currentSetNumber = flowScreenInfo?.setNumber || 1;
  const totalSets = 3;

  // ──── Mock 데이터 ────────────────────────────────────────────
  const listenSelectQuestions = [
    { no: 1, desc: '다음 음성을 듣고 맞는 단어를 선택하세요', viText: 'Nghe âm thanh và chọn từ đúng', words: ['베트남', '한국', '일본'], answer: '베트남', audioUrl: require('../../assets/sounds/1_vietnam.mp3') as string },
    { no: 2, desc: '다음 음성을 듣고 맞는 단어를 선택하세요', viText: 'Nghe âm thanh và chọn từ đúng', words: ['인도네시아', '러시아', '태국'], answer: '인도네시아', audioUrl: '' },
  ];

  const wordSoundQuestions = [
    {
      no: 1,
      desc: '음성을 듣고 맞는 단어를 선택하세요',
      viText: 'Nghe âm thanh và chọn từ đúng',
      items: [
        { value: 1, audioSrc: '' },
        { value: 2, audioSrc: '' },
        { value: 3, audioSrc: '' },
        { value: 4, audioSrc: '' },
      ],
      answer: 1,
    },
    {
      no: 2,
      desc: '음성을 듣고 맞는 단어를 선택하세요',
      viText: 'Nghe âm thanh và chọn từ đúng',
      items: [
        { value: 1, audioSrc: '' },
        { value: 2, audioSrc: '' },
        { value: 3, audioSrc: '' },
        { value: 4, audioSrc: '' },
      ],
      answer: 2,
    },
  ];

  const wordLetterBlankQuestions = [
    {
      no: 1,
      desc: '음성을 듣고 빈칸을 채우세요',
      viText: 'Điền vào chỗ trống',
      audioUrl: '',
      answer: '베트남',
      slots: ['_', '_', '_'],
      tiles: ['베', '트', '남', '한', '국', '일'],
      displayFormat: '___',
    },
    {
      no: 2,
      desc: '음성을 듣고 빈칸을 채우세요',
      viText: 'Điền vào chỗ trống',
      audioUrl: '',
      answer: '한국',
      slots: ['_', '_'],
      tiles: ['한', '국', '베', '트', '남', '일'],
      displayFormat: '__',
    },
  ];

  const wordVnKoSelectQuestions = [
    {
      no: 1,
      desc: '다음 베트남어 단어에 맞는 한국어를 선택하세요',
      viText: 'người',
      answer: '사람',
      words: [
        { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
        { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
        { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
        { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
      ],
    },
    {
      no: 2,
      desc: '다음 베트남어 단어에 맞는 한국어를 선택하세요',
      viText: 'học sinh',
      answer: '학생',
      words: [
        { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
        { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
        { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
        { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
      ],
    },
  ];

  const sentenceBlankQuestions = [
    {
      no: 1,
      koText: '저는 베트남 사람 ___.',
      blankWord: '이에요',
      choices: ['이에요', '에요', '이예요', '예요'],
    },
  ];

  const sentenceSelectQuestions = [
    {
      no: 1,
      viSentence: 'Tôi là học sinh.',
      koCorrectSentence: '나는 학생입니다.',
      choices: ['나는 학생입니다.', '나는 선생님입니다.', '나는 의사입니다.'],
    },
    {
      no: 2,
      viSentence: 'Tôi đến từ Việt Nam.',
      koCorrectSentence: '나는 베트남에서 왔어요.',
      choices: ['나는 베트남에서 왔어요.', '나는 한국에서 왔어요.', '나는 일본에서 왔어요.'],
    },
  ];

  const speakingEvalQuestions = [
    {
      step: 1,
      totalSteps: 4,
      sentence: '저는 ___이에요. 저는 ___에서 왔어요.',
      sentenceVi: 'Tôi là ___. Tôi đến từ ___.',
      blanks: [
        { placeholder: '이름', placeholderVi: 'tên' },
        { placeholder: '나라', placeholderVi: 'quốc gia' },
      ],
    },
    {
      step: 2,
      totalSteps: 4,
      sentence: '나는 ___을/를 좋아해요.',
      sentenceVi: 'Tôi thích ___.',
      blanks: [
        { placeholder: '취미', placeholderVi: 'sở thích' },
      ],
    },
  ];

  const reportData = {
    sessionNumber: 1,
    sessionTitle: '저는 흐엉이에요',
    sessionTitleVi: 'Tôi là Hương',
    description: '나라와 국적 표현을 배웠습니다.',
    descriptionVi: 'Bạn đã học về cách diễn đạt quốc gia và quốc tịch.',
    vocabCount: 12,
    speakingScore: 3,
    speakingTotal: 4,
    testScore: 5,
    testTotal: 6,
    aiFeedback: '좋은 발음으로 완성했습니다!',
    aiFeedbackVi: 'Bạn đã hoàn thành với phát âm tốt!',
  };

  // 기본 프로토타입 화면 분기
  switch (screenId) {
    case 'set-wordbook-eval':
      return (
        <SetWordbookEvalStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-wordbook-eval-2':
      return (
        <SetWordbookEvalStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-wordbook-eval-3':
      return (
        <SetWordbookEvalStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'home':
      return (
        <HomeScreen
          sessions={sessions}
          setView={(v: any) => onNavigate(v)}
          onStartSession={(id) => id === 2 ? onNavigate('quick-review') : onNavigate('mission')}
        />
      );
    case 'mission-tutor':
      return (
        <MissionTutorStage
          sessionId={1}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'vocab-wordbook-voice':
      return (
        <VocabWordbookVoiceStage
          onNext={() => onNavigate('intro')}
          onBack={() => onNavigate('mission')}
        />
      );
    case 'intro-word':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('word-intro-slides')}
          onBack={() => onNavigate('mission-tutor')}
          introData={{
            badge: '오늘의 단어',
            badgeVi: 'Từ vựng hôm nay',
            icon: '📖',
            title: '나라와 국적 단어를 살펴봐요.',
            titleVi: 'Cùng xem qua từ vựng về quốc gia và quốc tịch nhé.',
            subtitle: '단어를 하나씩 눈으로 확인하고 소리 내어 읽어봐요.',
            subtitleVi: 'Hãy xem và đọc to từng từ một nhé.',
            achievement: {
              label: '학습성과',
              labelVi: 'Kết quả học tập',
              desc: '나라와 국적 단어 15개를 알아볼 수 있어요.',
              descVi: 'Bạn có thể nhận biết 15 từ về quốc gia và quốc tịch.',
            },
          }}
        />
      );
    case 'intro-tutor':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('vocab-wordbook')}
          onBack={() => onNavigate('quick-review')}
          introData={{
            badge: '문법과 표현 1',
            badgeVi: 'Ngữ pháp & Biểu đạt 1',
            icon: '📝',
            title: '저는 N이에요/예요 표현을 배워요',
            titleVi: 'Tôi học cách dùng N이에요/예요',
            subtitle: '받침 확인 > 뜻 고르기 > 문장 만들기 순서로 연습해요',
            subtitleVi: 'Luyện tập: kiểm tra phụ âm cuối > chọn nghĩa > tạo câu',
            achievement: {
              label: '학습 성과',
              labelVi: 'Kết quả học tập',
              desc: "'이에요/예요'를 구분해 이름과 국적을 말할 수 있어요",
              descVi: "Bạn có thể phân biệt '이에요/예요' và nói tên, quốc tịch của mình",
            },
          }}
        />
      );
    case 'intro-tutor-2':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('grammar-detail')}
          onBack={() => onNavigate('quick-review')}
          introData={{
            badge: '문법과 표현 1',
            badgeVi: 'Ngữ pháp & Biểu đạt 1',
            icon: '📝',
            title: '문법 내용을 잘 이해했는지 문제를 풀면서 확인해요.',
            titleVi: 'Hãy kiểm tra xem bạn đã hiểu nội dung ngữ pháp chưa bằng cách làm bài tập.',
            subtitle: '',
            subtitleVi: '',
            achievement: {
              label: '학습 성과',
              labelVi: 'Kết quả học tập',
              desc: "'이에요/예요'를 구분하여 사용할 수 있어요.",
              descVi: "Bạn có thể phân biệt và sử dụng đúng '이에요/예요'.",
            },
          }}
        />
      );
    case 'intro-eval':
      return (
        <IntroEvalStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('quick-review')}
        />
      );
    case 'word-build':
      return (
        <WordBuildStage
          onComplete={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-vnko-select':
      return (
        <WordVnKoSelect2
          questions={wordVnKoSelectQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('listen-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'listen-select':
      return (
        <ListenSelect1
          questions={listenSelectQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('word-sound')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-sound':
      return (
        <WordSound1
          questions={wordSoundQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('word-letter-blank')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-letter-blank':
      return (
        <WordLetterBlank
          questions={wordLetterBlankQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => {
            if (currentSetNumber === 1) return onNavigate('set-complete');
            if (currentSetNumber === 2) return onNavigate('set-complete-2');
            if (currentSetNumber === 3) return onNavigate('set-complete-3');
            return onNavigate('set-complete');
          }}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete':
      return (
        <SetCompleteStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('set-wordbook-eval-2')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-2':
      return (
        <SetCompleteStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('set-wordbook-eval-3')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-3':
      return (
        <SetCompleteStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('intro-tutor')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'intro-tutor-2':
      return (
        <IntroTutorStage
          sessionId={1}
          onNext={() => onNavigate('sentence-blank-1')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-blank-1':
      return (
        <SentenceBlank1
          questions={sentenceBlankQuestions}
          onNext={() => onNavigate('sentence-select-1')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-select-1':
      return (
        <SentenceSelect1
          questions={sentenceSelectQuestions}
          onNext={() => onNavigate('sentence-build-2')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'intro-eval':
      return (
        <IntroEvalStage
          onNext={() => onNavigate('speaking-eval')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'speaking-eval':
      return (
        <SpeakingEvalStage
          questions={speakingEvalQuestions}
          onNext={() => onNavigate('learning-report')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'learning-report':
      return (
        <LearningReportStage
          data={reportData}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'practical-speaking':
      return (
        <PracticalSpeakingStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-vocab':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description={"오늘의 단어를 모두 학습했어요.\n이제 문법을 배워볼까요?"}
          descriptionVi={"Bạn đã học xong tất cả các từ vựng hôm nay.\nBây giờ, chúng ta cùng học ngữ pháp nhé!"}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-grammar':
      return (
        <CompletionCelebrationGrammarStage
          title="훌륭해요!"
          titleVi="Tuyệt lắm!"
          description={"오늘의 문법을 모두 학습했어요.\n이제 오늘 배운 내용을 실전에서 직접 말해봐요."}
          descriptionVi={"Bạn đã học xong toàn bộ ngữ pháp hôm nay.\nBây giờ, hãy trực tiếp sử dụng những nội dung đã học hôm nay trong tình huống thực tế nhé."}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-class':
      return (
        <CompletionCelebrationClassStage
          title="수고했어요!"
          titleVi="Bạn đã làm rất tốt!"
          description={"오늘 수업을 모두 완료했어요.\n나의 학습 리포트를 확인해 보세요."}
          descriptionVi={"Bạn đã hoàn thành toàn bộ bài học hôm nay.\nHãy xem báo cáo học tập của bạn nhé."}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-listen':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 듣기를 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần nghe thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-read':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description={"실전 읽기 및 발음평가를\n완료했어요!"}
          descriptionVi="Thực hành đọc và đánh giá phát âm đã hoàn thành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-write':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 쓰기를 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần viết thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-check':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 확인을 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần kiểm tra thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-build':
      return (
        <SentenceBuildStage
          onComplete={() => onNavigate('sentence-build-2')}
          onBack={() => onNavigate('grammar-act-start')}
        />
      );
    case 'sentence-build-2':
      return (
        <SentenceBuildStage2
          onComplete={() => onNavigate('eval-start')}
          onBack={() => onNavigate('sentence-build')}
        />
      );
    case 'video-bridge':
      return (
        <VideoBridgeStage
          onPressConfirm={() => onNavigate('slide-explain')}
          onClose={() => onNavigate('grammar-start')}
        />
      );
    case 'slide-explain':
      return (
        <SlideExplainStage
          onNext={() => onNavigate('grammar-act-start')}
          onBack={() => onNavigate('video-bridge')}
        />
      );
    case 'quick-review':
      return (
        <QuickReviewStage
          onPressConfirm={() => onNavigate('intro-tutor')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'culture':
      return (
        <CultureStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'grammar-detail':
      return (
        <GrammarDetailStage
          onNext={() => onNavigate('sentence-build')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-detail':
      return (
        <WordDetailStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'slide-explain':
      return (
        <SlideExplainStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'video-bridge':
      return (
        <VideoBridgeStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'listen-select-1':
      return (
        <ListenSelect1
          questions={[
            { no: 1, desc: '소리를 듣고 단어를 고르세요', words: ['베트남', '한국', '인도네시아', '러시아'], answer: '베트남', viText: 'Hãy nghe đoạn âm thanh rồi chọn từ tương ứng nhé.', audioUrl: require('../../assets/sounds/1_vietnam.mp3') as string },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-vn-ko-select-2':
      return (
        <WordVnKoSelect2
          questions={[
            {
              no: 1, desc: '', viText: 'người', answer: '사람',
              words: [
                { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
                { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
                { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
                { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
              ],
            },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-sound-1':
      return (
        <WordSound1
          questions={[
            { no: 1, desc: '미국', viText: 'Hoa Kỳ', answer: 1, items: [{ value: 1, audioSrc: require('../../assets/sounds/5_usa.mp3') as string }, { value: 2, audioSrc: require('../../assets/sounds/8_france.mp3') as string }, { value: 3, audioSrc: require('../../assets/sounds/9_china.mp3') as string }, { value: 4, audioSrc: require('../../assets/sounds/12_germany.mp3') as string }] },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-letter-blank':
      return (
        <WordLetterBlank
          questions={[
            { no: 1, desc: '단어를 완성하세요', viText: 'Hoàn thành từ', audioUrl: 'https://via.placeholder.com/audio?text=word', answer: '미국', slots: ['미', '국'], tiles: ['미', '국', '일', '본'], displayFormat: '___ ___' },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete':
      return (
        <SetCompleteStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-2':
      return (
        <SetCompleteStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-3':
      return (
        <SetCompleteStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-blank-1':
      return (
        <SentenceBlank1
          questions={[
            { no: 1, koText: '저는 베트남 사람 ___.', blankWord: '이에요', choices: ['이에요', '에요', '이예요', '예요'] },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={1}
        />
      );
    case 'word-blank-1':
      return (
        <WordBlank1
          questions={[
            { no: 1, viWord: 'Việt Nam', koWord: '베___', answer: '트남', choices: ['트남', '한국', '일본', '중국'] },
            { no: 2, viWord: 'người', koWord: '사___', answer: '람', choices: ['람', '원', '님', '자'] },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'listen-typing-1':
      return (
        <ListenTyping1
          questions={[
            { no: 1, audioUrl: require('../../assets/sounds/word_set_1.mp3'), answer: 'Việt Nam', answerVi: '베트남', hint: '국가 이름' },
            { no: 2, audioUrl: require('../../assets/sounds/word_set_1.mp3'), answer: 'người', answerVi: '사람', hint: '사람을 뜻하는 단어' },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'sentence-select-1':
      return (
        <SentenceSelect1
          questions={[
            {
              no: 1,
              viSentence: 'Tôi không phải là nhân viên công ty.',
              koCorrectSentence: '저는 회사원이 아니에요.',
              choices: ['저는 회사원이 아니에요.', '저는 회사원이에요.', '저는 학생이에요.', '저는 의사에요.']
            },
            {
              no: 2,
              viSentence: 'Tôi là người Việt Nam.',
              koCorrectSentence: '저는 베트남 사람이에요.',
              choices: ['저는 한국 사람이에요.', '저는 베트남 사람이에요.', '저는 일본 사람이에요.', '저는 중국 사람이에요.']
            },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'speaking-eval':
      return (
        <SpeakingEvalStage
          questions={[
            {
              step: 1,
              totalSteps: 4,
              sentence: '안녕하세요? 저는 _____ 사람이에요.',
              sentenceVi: 'Xin chào? Tôi là người _____.',
              blanks: [
                { placeholder: '이름', placeholderVi: 'tên' },
                { placeholder: '국적', placeholderVi: 'quốc tịch' }
              ]
            },
            {
              step: 2,
              totalSteps: 4,
              sentence: '저는 _____ 이에요.',
              sentenceVi: 'Tôi là _____.',
              blanks: [
                { placeholder: '직업', placeholderVi: 'nghề nghiệp' }
              ]
            },
            {
              step: 3,
              totalSteps: 4,
              sentence: '만나서 _____ 해요.',
              sentenceVi: 'Rất _____ gặp bạn.',
              blanks: [
                { placeholder: '감정', placeholderVi: 'cảm xúc' }
              ]
            },
            {
              step: 4,
              totalSteps: 4,
              sentence: '저는 _____ 을/를 좋아해요.',
              sentenceVi: 'Tôi thích _____.',
              blanks: [
                { placeholder: '취미', placeholderVi: 'sở thích' }
              ]
            }
          ]}
          onNext={() => onNavigate('learning-report')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'learning-report':
      return (
        <LearningReportStage
          data={{
            sessionNumber: 1,
            sessionTitle: '나라와 국적 소개',
            sessionTitleVi: 'Giới thiệu quốc gia và quốc tịch',
            description: '오늘 학습한 단어, 문법, 발음기 결정해 확인해 보세요.',
            descriptionVi: 'Hãy xem lại từ vựng, ngữ pháp, phát âm mà bạn học hôm nay.',
            vocabCount: 15,
            speakingScore: 4,
            speakingTotal: 4,
            testScore: 6,
            testTotal: 6,
            aiFeedback: '오늘의 자기소개 발음을 완성했어요. 다음에는 받침 있는 단어를 정확하게 구분해 말해봅시다.',
            aiFeedbackVi: 'Bạn đã hoàn thành bài tự giới thiệu hôm nay. Lần sau, hãy phân biệt chính xác các từ có phụ âm cuối.'
          }}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-intro-slides':
      return (
        <WordIntroSlidesStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'video-ai-tutor':
      return (
        <VideoAITutorStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'ai-tutor-desc':
      return (
        <AITutorDescStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'conversation-preview':
      return (
        <ConversationPreviewStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'conversation-shadowing':
      return (
        <ConversationShadowingStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'dialogue-listen-write':
      return (
        <DialogueListenWriteStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'practice-check':
      return (
        <PracticeCheckStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'grammar-complete':
      return (
        <GrammarCompleteStage
          percentage={40}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    default:
      return (
        <View style={placeholder.wrap}>
          <Text style={placeholder.emoji}>🚧</Text>
          <Text style={placeholder.title}>준비 중</Text>
          <Text style={placeholder.sub}>이 화면은 현재 구현 중입니다.</Text>
        </View>
      );
  }
}

const placeholder = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.canvas },
  emoji: { fontSize: 40 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted },
});

// ─── 에뮬레이터 쉘 ────────────────────────────────────────────────
function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <View style={ls.row}>
      {(['ko', 'vi'] as Lang[]).map((l) => (
        <TouchableOpacity
          key={l}
          style={[ls.btn, lang === l && ls.btnActive]}
          onPress={() => setLang(l)}
          activeOpacity={0.7}
        >
          <Text style={[ls.label, lang === l && ls.labelActive]}>
            {l === 'ko' ? '🇰🇷 한국어' : '🇻🇳 Tiếng Việt'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ls = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  btn: {
    flex: 1, paddingVertical: 8, borderRadius: 11,
    borderWidth: 1, borderColor: '#E7E6EE', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnActive: { borderColor: '#6B4EF6', backgroundColor: '#F4F1FF', borderWidth: 1.5 },
  label: { fontSize: 11.5, fontWeight: '700', color: '#8A8799' },
  labelActive: { color: '#4C34C2' },
});

// ─── 화면 선택 콤보박스 ──────────────────────────────────────────
function ScreenComboBox({
  currentScreenId,
  onSelectScreen,
}: {
  currentScreenId: string;
  onSelectScreen: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentScreen = getScreen(currentScreenId) ?? SCREEN_REGISTRY[0];

  const sortedRegistry = [...SCREEN_REGISTRY].sort((a, b) => {
    const numA = parseFloat(a.label.match(/^[\d.]+/)?.[0] ?? '9999');
    const numB = parseFloat(b.label.match(/^[\d.]+/)?.[0] ?? '9999');
    if (numA !== numB) return numA - numB;
    return a.label.localeCompare(b.label, 'ko');
  });

  return (
    <View style={combo.container}>
      {/* 콤보박스 선택 헤더 */}
      <TouchableOpacity
        style={[combo.trigger, isOpen && combo.triggerOpen]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={combo.triggerContent}>
          <Text style={combo.triggerLabel} numberOfLines={1}>
            {currentScreen.label}
          </Text>
          <View style={[shell.categoryBadge, currentScreen.category === '신규' && shell.badgeNew, currentScreen.category === '수정' && shell.badgeMod]}>
            <Text style={shell.categoryBadgeText}>{currentScreen.category}</Text>
          </View>
        </View>
        <Text style={combo.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <View style={combo.dropdown}>
          <ScrollView
            style={combo.listScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            {sortedRegistry.map((s) => {
              const isSelected = s.id === currentScreenId;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[combo.optionItem, isSelected && combo.optionItemActive]}
                  onPress={() => {
                    onSelectScreen(s.id);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[combo.optionLabel, isSelected && combo.optionLabelActive]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                  <View
                    style={[
                      shell.categoryBadge,
                      s.category === '신규' && shell.badgeNew,
                      s.category === '수정' && shell.badgeMod,
                    ]}
                  >
                    <Text style={shell.categoryBadgeText}>{s.category}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const combo = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: colors.line,
  },
  triggerOpen: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 6,
    gap: 4,
  },
  triggerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
  },
  arrowIcon: {
    fontSize: 10,
    color: colors.muted,
    marginLeft: 2,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    maxHeight: 320,
    overflow: 'hidden',
  },
  listScroll: {
    maxHeight: 320,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 6,
  },
  optionItemActive: {
    backgroundColor: colors.tealSoft,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.ink,
    flex: 1,
  },
  optionLabelActive: {
    fontWeight: '700',
    color: colors.teal,
  },
});

// ─── 헤더 테마 셀렉트 박스 ─────────────────────────────────────────
function ThemeSelect() {
  const { themes, themeId, setThemeId, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={ts.wrap}>
      <TouchableOpacity style={[ts.trigger, open && ts.triggerOpen]} onPress={() => setOpen(!open)} activeOpacity={0.75}>
        <View style={[ts.dot, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryDark }]} />
        <Text style={ts.triggerText} numberOfLines={1}>{theme.name}</Text>
        <Text style={ts.arrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={ts.dropdown}>
          <ScrollView style={{ maxHeight: 420 }} nestedScrollEnabled showsVerticalScrollIndicator>
            {themes.map((t, i) => {
              const sel = t.id === themeId;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[ts.option, sel && ts.optionOn]}
                  onPress={() => { setThemeId(t.id); setOpen(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={ts.optionNo}>{String(i + 1).padStart(2, '0')}</Text>
                  <View style={ts.swatchRow}>
                    <View style={[ts.swatch, { backgroundColor: t.colors.canvas }]} />
                    <View style={[ts.swatch, { backgroundColor: t.colors.primary }]} />
                    <View style={[ts.swatch, { backgroundColor: t.colors.ink }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ts.optionLabel, sel && ts.optionLabelOn]} numberOfLines={1}>{t.name}</Text>
                    <Text style={ts.optionSub} numberOfLines={1}>{t.type.display} · {t.layout.header}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const ts = StyleSheet.create({
  wrap: { position: 'relative', zIndex: 50, width: 190 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9,
    borderWidth: 1, borderColor: colors.line, backgroundColor: '#f9fafb',
  },
  triggerOpen: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  triggerText: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.ink },
  arrow: { fontSize: 9, color: colors.muted },
  dropdown: {
    position: 'absolute', top: 38, right: 0, width: 262,
    backgroundColor: colors.surface, borderRadius: 10,
    borderWidth: 1, borderColor: colors.line,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 18, elevation: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 10, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  optionOn: { backgroundColor: colors.tealSoft },
  optionNo: { fontSize: 10, fontWeight: '700', color: colors.muted, width: 16 },
  swatchRow: { flexDirection: 'row', gap: 2 },
  swatch: { width: 9, height: 16, borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  optionLabel: { fontSize: 12, fontWeight: '600', color: colors.ink },
  optionLabelOn: { fontWeight: '800', color: colors.teal },
  optionSub: { fontSize: 9.5, color: colors.muted, marginTop: 1 },
});

function EmulatorShellInner() {
  const [deviceId, setDeviceId] = useState('iphone15');
  const [screenId, setScreenId] = useState('set-wordbook-eval');
  const [infoTab, setInfoTab] = useState<'desc' | 'dev' | 'design'>('desc');
  const [flowMode, setFlowMode] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  // 헤더에서 고른 테마를 가운데 폰 화면에도 실제로 입힌다.
  // 아직 테마 버전이 있는 화면(단어장 5-2)에만 적용되고, 나머지는 원본 그대로 나온다.
  const { theme: activeTheme, enabled: applyTheme, setEnabled: setApplyTheme } = useTheme();


  // Flow 모드일 때 현재 screenId 결정
  const activeScreenId = flowMode ? LEARNING_FLOW[currentFlowStep]?.screenId : screenId;
  // 고른 테마를 실제 화면들에 입힌다. 화면 컴포넌트는 건드리지 않으므로 기능은 그대로 동작한다.
  // 페인트 전에 입혀야 전환 직후 푸터/여백이 눈앞에서 움직이지 않는다 (틀어짐 최소화)
  useLayoutEffect(() => {
    const t = applyTheme ? activeTheme : null;
    applyThemeToDom(t);
    // 늦게 마운트되는 DOM 은 전환 페이드가 끝나기 전(80ms)과 안전망(350ms)에서 한 번씩 더
    const early = setTimeout(() => applyThemeToDom(t), 80);
    const again = setTimeout(() => applyThemeToDom(t), 350);
    return () => { clearTimeout(early); clearTimeout(again); };
  }, [applyTheme, activeTheme, activeScreenId, screenId]);

  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0];
  const screen = getScreen(activeScreenId || screenId);

  // 프레임 스케일 — 최대 높이 제약에 맞춤
  const maxH = 780;
  const scale = Math.min(1, maxH / device.h);
  const frameW = device.w * scale;
  const frameH = device.h * scale;

  // onNavigate 콜백 - flow 모드에 따라 다르게 처리
  // 말해보카 테마: 검은 베젤 대신 흰 프레임 — 화면이 가득 차 보이게
  const lightFrame = applyTheme && activeTheme.id === 'malhaeboka';

  // 모바일 목업 안에서는 스크롤이 동작하되 스크롤바는 보이지 않는다
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // 빠른 클릭은 :active 가 한 프레임도 안 보인다 — 탭 순간 스프링 팝을 원샷 재생
    const w = window as unknown as { __kchaoTapPop?: boolean };
    if (!w.__kchaoTapPop) {
      w.__kchaoTapPop = true;
      document.addEventListener(
        'pointerdown',
        (ev) => {
          const t = ev.target as HTMLElement | null;
          const el = t && t.closest ? (t.closest('[data-mb="1"] [tabindex]') as HTMLElement | null) : null;
          if (!el || typeof el.animate !== 'function') return;
          el.animate(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(0.93)', offset: 0.35 },
              { transform: 'scale(1.03)', offset: 0.75 },
              { transform: 'scale(1)' },
            ],
            { duration: 300, easing: 'cubic-bezier(.34,1.6,.5,1)' },
          );
        },
        { capture: true, passive: true },
      );
    }
    if (document.getElementById('kchao-hide-scrollbar')) return;
    const tag = document.createElement('style');
    tag.id = 'kchao-hide-scrollbar';
    tag.textContent =
      '[data-device-screen] *::-webkit-scrollbar{width:0!important;height:0!important;display:none!important} ' +
      '[data-device-screen] *{scrollbar-width:none;-ms-overflow-style:none} ' +
      // 말해보카: 모든 버튼·문항 탭 팝 — 누르면 눌렸다가 스프링으로 복귀 (transform 이라 레이아웃 불변)
      '[data-mb="1"] [tabindex]{transition:transform 200ms cubic-bezier(.34,1.8,.5,1)!important} ' +
      '[data-mb="1"] [tabindex]:active{transform:scale(.93)!important}';
    document.head.appendChild(tag);
  }, []);

  const handleNavigate = (nextScreenId: string) => {
    if (flowMode) {
      // flow 모드: 다음 단계로 이동
      if (currentFlowStep < LEARNING_FLOW.length - 1) {
        setCurrentFlowStep(currentFlowStep + 1);
      } else {
        // flow 끝 - 일반 모드로 복귀
        setFlowMode(false);
        setCurrentFlowStep(0);
        setScreenId('home');
      }
    } else {
      // 일반 모드: 단순히 screenId 변경
      setScreenId(nextScreenId);
    }
  };

  if (Platform.OS !== 'web') return null;

  return (
    <LangProvider>
    <View style={shell.root}>
      {/* ── 상단 타이틀 바 ── */}
      <View style={shell.topBar}>
        <View style={shell.topBarBrand}>
          <Image source={{ uri: STUDIO_LOGO }} style={{ width: 28, height: 28, borderRadius: 8 }} />
          <Text style={shell.topBarLogo}>K-Chao</Text>
          <View style={shell.topBarSubChip}>
            <Text style={shell.topBarSub}>리뉴얼 프로토타입 뷰어</Text>
          </View>
        </View>
        <View style={shell.topBarRight}>
          <Text style={shell.topBarFieldLabel}>테마</Text>
          <ThemeSelect />
          <TouchableOpacity
            style={[shell.applyBtn, applyTheme && shell.applyBtnOn]}
            onPress={() => setApplyTheme(!applyTheme)}
            activeOpacity={0.8}
          >
            <Text style={[shell.applyBtnText, applyTheme && shell.applyBtnTextOn]}>
              {applyTheme ? '테마 적용 ON' : '테마 적용 OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[shell.galleryBtn, showGallery && shell.galleryBtnOn]}
            onPress={() => setShowGallery(!showGallery)}
            activeOpacity={0.8}
          >
            <Text style={[shell.galleryBtnText, showGallery && shell.galleryBtnTextOn]}>
              {showGallery ? '× 갤러리 닫기' : '🎨 테마 갤러리'}
            </Text>
          </TouchableOpacity>
          <View style={shell.versionChip}>
            <Text style={shell.topBarVersion}>v0.1 · Expo Web</Text>
          </View>
        </View>
      </View>

      {showGallery ? (
        <ThemeGalleryScreen onClose={() => setShowGallery(false)} />
      ) : (
      <View style={shell.body}>
        {/* ── 좌측 컨트롤 패널 ── */}
        <View style={shell.leftPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={shell.panelTitle}>언어</Text>
            <LangSwitcher />
            <View style={shell.divider} />
            <Text style={shell.panelTitle}>디바이스</Text>
            {DEVICES.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[shell.selectItem, deviceId === d.id && shell.selectItemActive]}
                onPress={() => setDeviceId(d.id)}
                activeOpacity={0.7}
              >
                <Text style={[shell.selectItemOs, deviceId === d.id && shell.selectItemOsActive]}>
                  {d.os}
                </Text>
                <Text style={[shell.selectItemLabel, deviceId === d.id && shell.selectItemLabelActive]}>
                  {d.label}
                </Text>
                <Text style={shell.selectItemSize}>{d.w}×{d.h}</Text>
              </TouchableOpacity>
            ))}

            <View style={shell.divider} />
            <Text style={shell.panelTitle}>화면 선택</Text>
            <ScreenComboBox currentScreenId={screenId} onSelectScreen={setScreenId} />

            <View style={shell.divider} />
            <Text style={shell.panelTitle}>학습 Flow</Text>
            {!flowMode ? (
              <TouchableOpacity
                style={[shell.selectItem, { backgroundColor: '#6B4EF6', alignItems: 'center', paddingVertical: 11 }]}
                onPress={() => {
                  setFlowMode(true);
                  setCurrentFlowStep(0);
                }}
                activeOpacity={0.85}
              >
                <Text style={[shell.selectItemLabel, { color: '#FFFFFF', fontWeight: '800' }]}>
                  ▶  Flow 시작
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View style={[shell.selectItem, { backgroundColor: '#17151F', alignItems: 'center', paddingVertical: 11 }]}>
                  <Text style={[shell.selectItemLabel, { color: '#FFFFFF', fontWeight: '800' }]}>
                    Step {currentFlowStep + 1} / {LEARNING_FLOW.length}
                  </Text>
                </View>
                <Text style={[shell.panelTitle, { marginTop: 8, fontSize: 12 }]}>
                  {LEARNING_FLOW[currentFlowStep]?.label || '완료'}
                </Text>
                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E6EE', alignItems: 'center', marginTop: 8 }]}
                  onPress={() => {
                    setFlowMode(false);
                    setCurrentFlowStep(0);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: '#6E6C7A', fontWeight: '700' }]}>
                    ✕  Flow 종료
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: currentFlowStep <= 0 ? '#F0EFF6' : '#D8D0F8', alignItems: 'center', marginTop: 8 }]}
                  onPress={() => {
                    if (currentFlowStep > 0) {
                      setCurrentFlowStep(currentFlowStep - 1);
                    }
                  }}
                  disabled={currentFlowStep <= 0}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: currentFlowStep <= 0 ? '#C4C2CE' : '#5B3DF5', fontWeight: '700' }]}>
                    ‹  이전 Step
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: '#F4F1FF', borderWidth: 1, borderColor: '#D8D0F8', alignItems: 'center', marginTop: 8 }]}
                  onPress={() => {
                    if (currentFlowStep < LEARNING_FLOW.length - 1) {
                      setCurrentFlowStep(currentFlowStep + 1);
                    }
                  }}
                  disabled={currentFlowStep >= LEARNING_FLOW.length - 1}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: '#4C34C2', fontWeight: '800' }]}>
                    다음 Step  ›
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ── 중앙 디바이스 프레임 ── */}
        {/* 말해보카: 실물 목업처럼 폰 뒤는 연회색 지면 */}
        <View style={[shell.centerPanel, lightFrame && { backgroundColor: '#E9EBF0' }]}>
          <View
            style={[
              shell.deviceOuter,
              { width: frameW + 24, height: frameH + 48 },
              lightFrame && { backgroundColor: '#FFFFFF', shadowOpacity: 0.12, shadowRadius: 36 },
            ]}
          >
            {/* OS 상단 노치/Dynamic Island 표시 */}
            <View style={[shell.statusBar, { width: frameW }, lightFrame && { backgroundColor: '#FFFFFF' }]}>
              <Text style={[shell.statusBarText, lightFrame && { color: '#1A1A20' }]}>9:41</Text>
              <View style={[shell.notch, lightFrame && { backgroundColor: '#FFFFFF' }]} />
              <Text style={[shell.statusBarText, lightFrame && { color: '#1A1A20' }]}>● ● ●</Text>
            </View>
            {/* 화면 렌더링 영역 */}
            <View style={[shell.deviceScreen, { width: frameW, height: frameH - 24 }]} {...({ dataSet: { 'device-screen': '1' } } as any)}>
              <MbScreenTransition enabled={lightFrame} screenKey={activeScreenId || screenId}>
              <View style={{ flex: 1 }} {...({ dataSet: applyTheme ? { themed: 'on', ...(lightFrame ? { mb: '1' } : null) } : undefined } as any)}>
                <FlowProgressContext.Provider
                  value={flowMode ? { step: currentFlowStep + 1, total: LEARNING_FLOW.length } : null}
                >
                <ScreenRenderer
                  key={flowMode ? `flow-${currentFlowStep}` : screenId}
                  screenId={activeScreenId || screenId}
                  onNavigate={handleNavigate}
                  flowStep={flowMode ? currentFlowStep + 1 : undefined}
                  flowTotal={flowMode ? LEARNING_FLOW.length : undefined}
                />
                <MbFocusPulse enabled={applyTheme && activeTheme.id === 'malhaeboka'} screenId={activeScreenId || screenId} />
                <ScreenSticker theme={activeTheme} enabled={applyTheme} screenId={activeScreenId || screenId} />
                </FlowProgressContext.Provider>
              </View>
              </MbScreenTransition>
            </View>
          </View>

          {/* 디바이스 정보 */}
          <View style={shell.deviceInfo}>
            <Text style={shell.deviceInfoText}>
              {device.label} · {device.w}×{device.h}px · {device.os}
              {scale < 1 ? ` · ${Math.round(scale * 100)}% 스케일` : ''}
            </Text>
          </View>
        </View>

        {/* ── 우측 정보 패널 ── */}
        <View style={shell.rightPanel}>
          {screen ? (
            <>
              <View style={shell.screenHeader}>
                <Text style={shell.screenName}>{screen.label}</Text>
                <View style={[shell.categoryBadge, screen.category === '신규' && shell.badgeNew, screen.category === '수정' && shell.badgeMod]}>
                  <Text style={shell.categoryBadgeText}>{screen.category}</Text>
                </View>
              </View>

              {/* 탭 */}
              <View style={shell.tabs}>
                {([['desc', '화면 설명'], ['dev', '개발 참고'], ['design', '디자인 참고']] as const).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[shell.tab, infoTab === key && shell.tabActive]}
                    onPress={() => setInfoTab(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[shell.tabText, infoTab === key && shell.tabTextActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView style={shell.tabContent} showsVerticalScrollIndicator={false}>
                {infoTab === 'desc' && (
                  <View style={shell.infoBlock}>
                    <Text style={shell.infoText}>{screen.description}</Text>
                  </View>
                )}
                {infoTab === 'dev' && (
                  <View style={shell.infoBlock}>
                    {screen.sourceAFile && (
                      <View style={shell.codeChip}>
                        <Text style={shell.codeChipLabel}>Source A</Text>
                        <Text style={shell.codeChipValue}>{screen.sourceAFile}</Text>
                      </View>
                    )}
                    {screen.sourceBRef && (
                      <View style={[shell.codeChip, shell.codeChipB]}>
                        <Text style={shell.codeChipLabel}>Source B</Text>
                        <Text style={shell.codeChipValue}>{screen.sourceBRef}</Text>
                      </View>
                    )}
                    <Text style={shell.infoText}>{screen.devNotes}</Text>
                  </View>
                )}
                {infoTab === 'design' && (
                  <View style={shell.infoBlock}>
                    <Text style={shell.infoText}>{screen.designNotes}</Text>
                  </View>
                )}
              </ScrollView>
            </>
          ) : (
            <View style={{ padding: 20 }}>
              <Text style={shell.infoText}>화면을 선택하세요.</Text>
            </View>
          )}
        </View>
      </View>
      )}
    </View>
    </LangProvider>
  );
}

// 스튜디오 로고 마크 — 그라디언트 라운드 사각 + K
const STUDIO_LOGO = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">' +
  '<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B2FF2"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient></defs>' +
  '<rect width="56" height="56" rx="14" fill="url(#lg)"/>' +
  '<path d="M20 14v28M20 28l14-14M22 26l14 16" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
  '</svg>',
);

const shell = StyleSheet.create({
  root: { flex: 1, flexDirection: 'column', backgroundColor: '#F2F2F7' },
  topBar: {
    height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#ECEAF4',
  },
  topBarBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topBarLogo: { fontSize: 16.5, fontWeight: '800', color: '#17151F', letterSpacing: -0.3 },
  topBarSubChip: { backgroundColor: '#F4F3FA', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  topBarSub: { fontSize: 11.5, fontWeight: '600', color: '#8A8799' },
  versionChip: { backgroundColor: '#F4F3FA', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  topBarVersion: { fontSize: 11, fontWeight: '700', color: '#8A8799' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 50 },
  topBarFieldLabel: { fontSize: 11, fontWeight: '800', color: '#8A8799', letterSpacing: 0.8 },
  galleryBtn: {
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: '#D8D0F8', backgroundColor: '#F4F1FF',
  },
  galleryBtnOn: { backgroundColor: '#17151F', borderColor: '#17151F' },
  galleryBtnText: { fontSize: 12, fontWeight: '800', color: '#5B3DF5' },
  galleryBtnTextOn: { color: '#ffffff' },
  applyBtn: {
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: '#E7E6EE', backgroundColor: '#FFFFFF',
  },
  applyBtnOn: { backgroundColor: '#6B4EF6', borderColor: '#6B4EF6' },
  applyBtnText: { fontSize: 12, fontWeight: '800', color: '#8A8799' },
  applyBtnTextOn: { color: '#ffffff' },
  body: { flex: 1, flexDirection: 'row' },

  // Left panel — 카드형 컨트롤
  leftPanel: {
    width: 236, backgroundColor: '#FBFBFE',
    borderRightWidth: 1, borderRightColor: '#ECEAF4',
    padding: 16,
  },
  panelTitle: { fontSize: 11, fontWeight: '800', color: '#8A8799', letterSpacing: 1, marginBottom: 10, marginTop: 4, textTransform: 'uppercase' as const },
  selectItem: {
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginBottom: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EFEDF6',
  },
  selectItemActive: { backgroundColor: '#F4F1FF', borderColor: '#6B4EF6', borderWidth: 1.5 },
  selectItemOs: {
    fontSize: 9.5, fontWeight: '800', color: '#8A8799', letterSpacing: 0.6,
    backgroundColor: '#F1F0F7', alignSelf: 'flex-start' as const,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' as const, marginBottom: 4,
  },
  selectItemOsActive: { color: '#4C34C2', backgroundColor: '#EFEBFF' },
  selectItemLabel: { fontSize: 13, fontWeight: '600', color: '#17151F' },
  selectItemLabelActive: { fontWeight: '800', color: '#4C34C2' },
  selectItemSize: { fontSize: 11, fontWeight: '600', color: '#A5A3B2', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#ECEAF4', marginVertical: 16 },
  screenItemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },

  // Center
  centerPanel: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16,
  },
  deviceOuter: {
    borderRadius: 32, backgroundColor: '#1a1a2e',
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.25, shadowRadius: 48, elevation: 24,
    overflow: 'hidden',
  },
  statusBar: {
    height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, backgroundColor: '#1a1a2e',
  },
  statusBarText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  notch: { width: 80, height: 16, backgroundColor: '#1a1a2e', borderRadius: 12 },
  deviceScreen: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface },
  deviceInfo: {
    alignSelf: 'center' as const, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#ECEAF4',
    paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999,
  },
  deviceInfoText: { fontSize: 11, fontWeight: '600', color: '#8A8799' },

  // Right panel — 정보 스튜디오
  rightPanel: {
    width: 420, backgroundColor: '#FFFFFF',
    borderLeftWidth: 1, borderLeftColor: '#ECEAF4',
    flexDirection: 'column',
  },
  screenHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#F0EFF6',
  },
  screenName: { fontSize: 15, fontWeight: '800', color: '#17151F', flex: 1, marginRight: 8, letterSpacing: -0.2 },
  tabs: {
    flexDirection: 'row', margin: 14, marginBottom: 4,
    backgroundColor: '#F1F0F7', borderRadius: 11, padding: 3,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9 },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#17151F', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  tabText: { fontSize: 12.5, color: '#6E6C7A', fontWeight: '600' },
  tabTextActive: { color: '#17151F', fontWeight: '800' },
  tabContent: { flex: 1, padding: 18 },
  infoBlock: { gap: 12 },
  infoText: { fontSize: 13.5, color: '#3A384A', lineHeight: 22 },
  codeChip: {
    borderRadius: 12, padding: 12,
    backgroundColor: '#FAFAFD', borderWidth: 1, borderColor: '#EFEDF6',
  },
  codeChipB: { borderColor: '#D8D0F8', backgroundColor: '#F4F1FF' },
  codeChipLabel: { fontSize: 10, fontWeight: '800', color: '#8A8799', letterSpacing: 0.6 },
  codeChipValue: { fontSize: 12.5, fontWeight: '700', color: '#5B3DF5', marginTop: 2 },

  // Badges
  categoryBadge: {
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
    backgroundColor: '#F1F0F7',
  },
  badgeNew: { backgroundColor: '#EFEBFF' },
  badgeMod: { backgroundColor: '#FFF1E4' },
  categoryBadgeText: { fontSize: 10.5, fontWeight: '800', color: '#4B4960' },
});

// 테마 컨텍스트로 감싼 최종 export
export function EmulatorShell() {
  return (
    <ThemeProvider>
      <EmulatorShellInner />
    </ThemeProvider>
  );
}
