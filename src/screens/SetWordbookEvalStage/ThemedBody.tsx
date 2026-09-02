// 5-2 단어장 화면의 테마 네이티브 렌더.
//
// index.tsx(원본)가 상태·핸들러를 전부 소유하고, 이 컴포넌트는 그것을 받아
// 테마의 구조(structure)·색·서체·모서리로 다시 배치만 한다. 로직 중복이 없으므로
// 토스트 닫기·배속·TTS·발음 모달 등 기존 기능이 그대로 동작한다.
//
// 테마 확정 후 다른 화면들을 손볼 때 이 파일이 본보기 패턴이다:
//   원본 화면 = 상태/핸들러 + (enabled ? <ThemedBody/> : 원본 JSX)
//
// 루트의 data-native-theme 속성은 DOM 오버라이드(applyThemeToDom)가
// 이 서브트리를 건드리지 않게 하는 표시다 — 여기는 이미 테마 값으로 그려서
// 또 변환하면 이중 적용이 된다.
import { ThemedGlyph } from '../../components/ThemedGlyph';

// 나라 단어 → 해당 나라 국기 (flagcdn — 국가코드 고정이라 사진이 뒤바뀔 일이 없다)
const MB_FLAGS: Record<string, string> = {
  '베트남': 'vn', '한국': 'kr', '인도네시아': 'id', '러시아': 'ru',
  '미국': 'us', '프랑스': 'fr', '중국': 'cn', '독일': 'de', '일본': 'jp', '태국': 'th', '필리핀': 'ph', '영국': 'gb', '스페인': 'es', '이탈리아': 'it', '캐나다': 'ca', '호주': 'au', '브라질': 'br', '인도': 'in',
};

// 직업·명사 단어 → 상황 실사진 (프로젝트에 이미 있는 단어 사진 에셋)
const MB_PHOTOS: Record<string, any> = {
  '사람': require('../../../assets/SetWordbookEvalStage/preson.png'),
  '학생': require('../../../assets/SetWordbookEvalStage/1_student.png'),
  '선생님': require('../../../assets/SetWordbookEvalStage/2_teacher.png'),
  '회사원': require('../../../assets/SetWordbookEvalStage/6_employee.png'),
  '의사': require('../../../assets/SetWordbookEvalStage/4_doctor.png'),
  '가수': require('../../../assets/SetWordbookEvalStage/11_singer.png'),
  '요리사': require('../../../assets/SetWordbookEvalStage/8_chef.png'),
  '친구': require('../../../assets/SetWordbookEvalStage/friend.png'),
  '이름': require('../../../assets/SetWordbookEvalStage/name.png'),
  '나라': require('../../../assets/SetWordbookEvalStage/nara.png'),
};

import { BlinkSprite } from '../../theme/BlinkSprite';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Animated, type ViewStyle } from 'react-native';
import {
  type Theme,
  spacing,
  buttonRadius,
  displayFont,
  bodyFont,
  shadowFor,
  readableOn,
} from '../../theme/themeTypes';
import { pick, type Lang } from '../../components';
import { themeAssets } from '../../theme/themeAssets';
import { MbProgressRow } from '../../theme/mb/MbScaffold';
import { useFlowProgress } from '../../theme/mb/FlowContext';

export interface ThemedBodyProps {
  theme: Theme;
  lang: Lang;
  words: Array<{ id: number; ko: string; vi: string }>;
  setNumber: number;
  totalSets: number;
  progressPct: number;
  tab: 'all' | 'ko' | 'vi';
  onTab: (t: 'all' | 'ko' | 'vi') => void;
  speed: 0.5 | 1.0 | 1.5;
  setSpeed: (s: 0.5 | 1.0 | 1.5) => void;
  speakKo: (text: string) => void;
  onBack?: () => void;
  onPron: () => void;
  onNext: () => void;
}

export function ThemedBody(p: ThemedBodyProps) {
  const { theme } = p;
  const c = theme.colors;
  const L = theme.layout;
  const t = theme.type;
  const s = spacing(L.density);
  const st = L.structure;
  const pillR = L.radius === 0 ? 2 : 999;
  // 브랜드 자산 테마(말해보카 등): 캐릭터·아이콘을 실자산으로
  const assets = themeAssets(theme.id);
  const flow = useFlowProgress();
  // 빼꼼 캐릭터 생동감 — 잔잔한 플로팅
  const peekBob = useRef(new Animated.Value(0)).current;
  // 2.6초 주기로 130ms 감은 눈 프레임
  const [peekBlink, setPeekBlink] = useState(false);
  useEffect(() => {
    if (!assets?.peekBlink) return;
    let open: ReturnType<typeof setTimeout> | null = null;
    const iv = setInterval(() => {
      setPeekBlink(true);
      open = setTimeout(() => setPeekBlink(false), 130);
    }, 2600);
    return () => { clearInterval(iv); if (open) clearTimeout(open); };
  }, [assets]);
  useEffect(() => {
    if (!assets?.peek) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(peekBob, { toValue: -4, duration: 800, useNativeDriver: false }),
        Animated.timing(peekBob, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [assets, peekBob]);

  const boxOf = (focus = false): ViewStyle => {
    switch (L.list) {
      case 'card':
        return { backgroundColor: c.surface, borderRadius: L.radius, ...(shadowFor(L.shadow === 'none' ? 'hair' : L.shadow, c.ink) as ViewStyle) };
      case 'outline':
        return { backgroundColor: c.surface, borderRadius: L.radius, borderWidth: L.hairline, borderColor: c.line };
      case 'inset':
        return { backgroundColor: focus ? c.primarySoft : c.backdrop, borderRadius: L.radius };
      case 'block':
        return { backgroundColor: c.surface, borderRadius: L.radius, borderWidth: Math.max(1.5, L.hairline * 2), borderColor: c.ink };
      default:
        return {};
    }
  };
  const isRule = L.list === 'rule';

  // ── 조각들 ──────────────────────────────────────────────────────
  // 말해보카: 상단을 트로피 진행 알약으로 통일 (플로우면 STEP n/총)
  const Header = theme.id === 'malhaeboka' ? (
    <MbProgressRow
      percentage={flow ? (flow.step / flow.total) * 100 : p.progressPct}
      counter={flow ? `${flow.step}/${flow.total}` : `${Math.round(p.progressPct)}%`}
      onClose={p.onBack || (() => {})}
    />
  ) : (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: L.edge, paddingTop: 10, paddingBottom: s.row }}>
      <View style={{ flex: 1, height: 6, backgroundColor: c.line, borderRadius: pillR, overflow: 'hidden' }}>
        <View style={{ width: `${p.progressPct}%`, height: 6, backgroundColor: c.primary, borderRadius: pillR }} />
      </View>
      <TouchableOpacity onPress={p.onBack || (() => {})} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[{ fontSize: 17, color: c.muted }, bodyFont(theme, 600)]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const Badge = (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: c.primarySoft,
        borderRadius: pillR,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: s.gap,
      }}
    >
      <Text style={[{ fontSize: 12, color: readableOn(c.primarySoft, [c.primaryDark, c.ink]), letterSpacing: t.labelTracking }, bodyFont(theme, 700)]}>
        단어장 {p.setNumber}/{p.totalSets}
      </Text>
    </View>
  );

  const Title = (
    <>
      <Text style={[{ fontSize: t.displaySize, color: c.ink, letterSpacing: t.displayTracking, lineHeight: Math.round(t.displaySize * t.displayLine) }, displayFont(theme)]}>
        핵심 어휘를 확인해요.
      </Text>
      <Text style={[{ fontSize: t.bodySize, color: c.muted, marginTop: 4, lineHeight: Math.round(t.bodySize * t.bodyLine) }, bodyFont(theme)]}>
        Đây là thông tin quan trọng.
      </Text>
    </>
  );

  const SpeedBar = (
    <View
      style={[
        { marginTop: s.block, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: isRule ? 0 : s.row, paddingVertical: 8 },
        isRule ? { borderBottomWidth: L.hairline, borderBottomColor: c.line, paddingBottom: s.row } : boxOf(),
      ]}
    >
      <Text style={[{ fontSize: t.bodySize - 1, color: c.textSecondary }, bodyFont(theme, 600)]}>재생 속도</Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {([0.5, 1.0, 1.5] as const).map((spd) => {
          const on = p.speed === spd;
          return (
            <TouchableOpacity
              key={spd}
              onPress={() => p.setSpeed(spd)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: L.button === 'pill' ? pillR : L.radius,
                backgroundColor: on ? c.primary : 'transparent',
                borderWidth: Math.max(1, L.hairline),
                borderColor: on ? c.primary : c.line,
              }}
            >
              <Text style={[{ fontSize: t.bodySize - 2, color: on ? c.onPrimary : c.muted }, bodyFont(theme, on ? 700 : 500)]}>{spd}x</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const TabButton = ({ id, label }: { id: 'all' | 'ko' | 'vi'; label: string }) => {
    const on = p.tab === id;
    if (st === 'tabs-list') {
      return (
        <TouchableOpacity
          onPress={() => p.onTab(id)}
          activeOpacity={0.7}
          style={{ paddingBottom: 8, borderBottomWidth: 2.5, borderBottomColor: on ? c.primary : 'transparent' }}
        >
          <Text style={[{ fontSize: t.bodySize - 1, color: on ? c.primaryDark : c.muted }, bodyFont(theme, on ? 700 : 500)]}>{label}</Text>
        </TouchableOpacity>
      );
    }
    const filled = on && (L.list === 'card' || L.list === 'block' || L.button === 'block');
    return (
      <TouchableOpacity
        onPress={() => p.onTab(id)}
        activeOpacity={0.7}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          borderRadius: L.button === 'pill' ? pillR : L.radius,
          backgroundColor: filled ? c.primary : on ? c.primarySoft : c.surface,
          borderWidth: Math.max(L.hairline, 1),
          borderColor: on ? c.primary : c.line,
        }}
      >
        <Text
          numberOfLines={1}
          style={[{ fontSize: t.bodySize - 2, color: filled ? c.onPrimary : on ? c.primaryDark : c.muted }, bodyFont(theme, on ? 700 : 500)]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const Tabs = (
    <View
      style={
        st === 'tabs-list'
          ? { flexDirection: 'row', gap: 18, marginTop: s.block, borderBottomWidth: L.hairline, borderBottomColor: c.line }
          : { flexDirection: 'row', gap: 6, marginTop: s.block }
      }
    >
      <TabButton id="all" label={pick(p.lang, '전체 보기', 'Xem tất cả')} />
      <TabButton id="ko" label={pick(p.lang, '한국어 보기', 'Chỉ tiếng Hàn')} />
      <TabButton id="vi" label={pick(p.lang, '베트남어 보기', 'Chỉ tiếng Việt')} />
    </View>
  );

  const Speaker = ({ ko, small }: { ko: string; small?: boolean }) => (
    <TouchableOpacity
      onPress={() => p.speakKo(ko)}
      activeOpacity={0.7}
      style={{
        width: small ? 34 : 40,
        height: small ? 34 : 40,
        borderRadius: L.radius === 0 ? 2 : small ? 17 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.primarySoft,
        borderWidth: L.list === 'block' ? 1.5 : 0,
        borderColor: c.ink,
      }}
    >
      <ThemedGlyph style={{ fontSize: small ? 14 : 16 }} glyph="🔊" />
    </TouchableOpacity>
  );

  const WordTexts = ({ w, big }: { w: { ko: string; vi: string }; big?: boolean }) => (
    <View style={{ flex: 1, minWidth: 0 }}>
      {p.tab !== 'vi' &&
        (big ? (
          <Text style={[{ fontSize: Math.round(t.displaySize * 0.72), color: c.ink, letterSpacing: t.displayTracking }, displayFont(theme)]}>{w.ko}</Text>
        ) : (
          <Text numberOfLines={1} style={[{ fontSize: t.bodySize + 4, color: c.ink, letterSpacing: -0.3 }, bodyFont(theme, 700)]}>{w.ko}</Text>
        ))}
      {p.tab !== 'ko' && (
        <Text numberOfLines={1} style={[{ fontSize: t.bodySize - (big ? 0.5 : 1), color: c.muted, marginTop: 2 }, bodyFont(theme)]}>{w.vi}</Text>
      )}
    </View>
  );

  const Row = ({ w, last, idx = 0 }: { w: { id: number; ko: string; vi: string }; last: boolean; idx?: number }) => (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: s.row,
          paddingVertical: isRule ? s.row + 2 : Math.max(10, s.row),
          paddingHorizontal: isRule ? 0 : Math.max(12, s.row),
          marginBottom: isRule ? 0 : s.gap,
          borderBottomWidth: isRule && !last ? L.hairline : 0,
          borderBottomColor: c.line,
        },
        boxOf(),
      ]}
    >
      {assets?.rowIcons ? (
        MB_FLAGS[w.ko] ? (
          <Image
            source={{ uri: `https://flagcdn.com/w80/${MB_FLAGS[w.ko]}.png` }}
            style={{ width: 38, height: 27, borderRadius: 5, backgroundColor: '#EFEDF6', borderWidth: 1, borderColor: '#E7E4F0' }}
            resizeMode="cover"
          />
        ) : MB_PHOTOS[w.ko] ? (
          <Image
            source={MB_PHOTOS[w.ko]}
            style={{ width: 58, height: 58, borderRadius: 14, backgroundColor: '#EFEDF6', borderWidth: 1, borderColor: '#E7E4F0' }}
            resizeMode="cover"
          />
        ) : (
          <Image source={assets.rowIcons[idx % assets.rowIcons.length]} style={{ width: 30, height: 30, borderRadius: Math.min(10, L.radius) }} resizeMode="contain" />
        )
      ) : null}
      <WordTexts w={w} />
      <Speaker ko={w.ko} small />
    </View>
  );

  const WordList = () => {
    if (st === 'grid') {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s.gap, marginTop: s.block }}>
          {p.words.map((w) => (
            <View key={w.id} style={[{ width: '47.8%', flexGrow: 1, padding: Math.max(11, s.row) }, boxOf()]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <WordTexts w={w} />
                <Speaker ko={w.ko} small />
              </View>
            </View>
          ))}
        </View>
      );
    }
    if (st === 'focus-list' && p.words.length > 1) {
      const [first, ...rest] = p.words;
      return (
        <View style={{ marginTop: s.block }}>
          <View style={[{ padding: isRule ? 0 : Math.max(12, s.row), paddingBottom: isRule ? s.row : undefined, marginBottom: s.block, borderBottomWidth: isRule ? L.hairline : 0, borderBottomColor: c.line }, boxOf(true)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.row }}>
              <WordTexts w={first} big />
              <Speaker ko={first.ko} />
            </View>
          </View>
          <Text style={[{ fontSize: 10.5, color: c.muted, letterSpacing: t.labelTracking, marginBottom: s.gap }, bodyFont(theme, 700)]}>다음 단어</Text>
          {rest.map((w, i) => (
            <Row key={w.id} w={w} last={i === rest.length - 1} idx={i + 1} />
          ))}
        </View>
      );
    }
    return (
      <View style={{ marginTop: s.block }}>
        {p.words.map((w, i) => (
          <Row key={w.id} w={w} last={i === p.words.length - 1} idx={i} />
        ))}
      </View>
    );
  };

  const Stats = st === 'stat-list' ? (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: s.block }}>
      {[
        { v: String(p.words.length), k: '이번 세트' },
        { v: `${p.setNumber} / ${p.totalSets}`, k: '단어장' },
        { v: `${Math.round(p.progressPct)}%`, k: '진행' },
      ].map((x) => (
        <View key={x.k} style={[{ flex: 1, paddingVertical: s.row, paddingHorizontal: 10 }, boxOf(), isRule ? { borderLeftWidth: Math.max(2, L.hairline * 2), borderLeftColor: c.primary } : null]}>
          <Text style={[{ fontSize: t.bodySize + 7, color: c.ink, letterSpacing: -0.5 }, displayFont(theme)]}>{x.v}</Text>
          <Text style={[{ fontSize: t.bodySize - 3, color: c.muted, marginTop: 1 }, bodyFont(theme, 600)]}>{x.k}</Text>
        </View>
      ))}
    </View>
  ) : null;

  const heroBand = st === 'hero-list';

  const Cta = ({ label, primary, onPress }: { label: string; primary?: boolean; onPress: () => void }) => {
    const r = buttonRadius(L.button, L.radius);
    const deco: ViewStyle = primary
      ? L.button === 'outline'
        ? { borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary }
        : L.button === 'block'
        ? { backgroundColor: c.primary, borderBottomWidth: 4, borderBottomColor: c.primaryDark }
        : { backgroundColor: c.primary, ...(shadowFor(L.shadow, c.primary) as ViewStyle) }
      : {
          backgroundColor: c.surface,
          borderWidth: Math.max(1, L.hairline),
          borderColor: L.button === 'block' ? c.ink : c.line,
          ...(L.button === 'block' ? { borderBottomWidth: 3 } : null),
        };
    const fg = primary ? (L.button === 'outline' ? c.primaryDark : c.onPrimary) : c.textSecondary;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{ flex: 1, height: theme.id === 'malhaeboka' ? 40 : L.density === 'open' ? 52 : 48, borderRadius: r, alignItems: 'center', justifyContent: 'center' }, deco]}>
        <Text numberOfLines={1} style={[{ fontSize: t.bodySize, color: fg }, bodyFont(theme, 700)]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  // ── 배치 ────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }} {...({ dataSet: { 'native-theme': '1' } } as any)}>
      {Header}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: L.edge, paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
        {heroBand ? (
          // 상단을 브랜드 밴드로 — 사진 없는 실제 화면에서 hero 구조의 번안
          <View style={{ backgroundColor: c.primary, marginHorizontal: -L.edge, paddingHorizontal: L.edge, paddingTop: s.row, paddingBottom: s.row + 4, marginBottom: s.gap }}>
            <Text style={[{ fontSize: 12, color: c.onPrimary, opacity: 0.85, letterSpacing: t.labelTracking, marginBottom: 6 }, bodyFont(theme, 700)]}>
              단어장 {p.setNumber}/{p.totalSets}
            </Text>
            <Text style={[{ fontSize: t.displaySize, color: c.onPrimary, letterSpacing: t.displayTracking, lineHeight: Math.round(t.displaySize * t.displayLine) }, displayFont(theme)]}>
              핵심 어휘를 확인해요.
            </Text>
            <Text style={[{ fontSize: t.bodySize, color: c.onPrimary, opacity: 0.85, marginTop: 4 }, bodyFont(theme)]}>Đây là thông tin quan trọng.</Text>
          </View>
        ) : st === 'tabs-list' ? (
          <>
            {Tabs}
            <View style={{ marginTop: s.block }}>
              {Badge}
              {Title}
            </View>
          </>
        ) : (
          <View style={{ marginTop: 4 }}>
            {Badge}
            {Title}
          </View>
        )}

        {Stats}
        {SpeedBar}
        {st !== 'tabs-list' && Tabs}
        <WordList />
      </ScrollView>

      {assets?.peek ? (
        // 화면 우하단에서 빼꼼 — 말해보카 시그니처. 터치를 막지 않도록 pointerEvents 차단
        <View pointerEvents="none" style={{ position: 'absolute', right: 0, bottom: 84, alignItems: 'flex-end' }}>
          {/* 멘트 — 캐릭터는 항상 말과 함께 */}
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5DFF7', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 7, marginRight: 8, marginBottom: 5, maxWidth: 168, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: '#1B1926' }}>{pick(p.lang, '스피커로 발음을 들어봐요!', 'Nghe phát âm bằng loa nhé!')}</Text>
          </View>
          <Animated.View style={{ transform: [{ translateY: peekBob }] }}>
            <BlinkSprite img={assets.peek} blink={assets.peekBlink} on={peekBlink} w={86} h={100} />
          </Animated.View>
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: L.edge,
          paddingTop: 6,
          paddingBottom: 1,
          borderTopWidth: L.shadow === 'none' ? L.hairline : 0,
          borderTopColor: c.line,
          backgroundColor: c.canvas,
        }}
      >
        <Cta label={pick(p.lang, '단어 발음하기', 'Luyện phát âm')} primary onPress={p.onPron} />
        <Cta label={pick(p.lang, '세트 문제 풀기', 'Làm bài tập')} onPress={p.onNext} />
      </View>
    </View>
  );
}
