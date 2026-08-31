// 실제 앱 화면 "5-2. 단어장과 발음평가"에 테마를 입힌 것.
//
// 내용은 원본과 같다 — 진행바+닫기, 단어장 배지, 타이틀+베트남어 서브, 안내 토스트,
// 보기 모드 탭 3개, 어휘 카드 4개, 하단 2단 버튼.
// 배치는 테마의 structure 를 따른다. 같은 내용이라도 앱마다 놓는 순서와 덩어리가 다르기 때문이다.
//   plain-list  원본 그대로의 세로 나열
//   focus-list  첫 단어를 크게 세우고 나머지는 목록으로
//   grid        어휘를 2열 격자로
//   tabs-list   보기 모드 탭을 상단 언더라인 탭으로 올림
//   hero-list   상단에 실사 사진을 깔고 제목을 그 위에
//   stat-list   진도 숫자 블록을 목록 위에
import { View, Text, Image, StyleSheet, type ViewStyle } from 'react-native';
import {
  type Theme,
  coverPhoto,
  heroPhoto,
  shadowFor,
  spacing,
  buttonRadius,
  photoRadius,
  displayFont,
  bodyFont,
  readableOn,
} from '../../theme/themeTypes';
import { icon, scrimUri } from '../../theme/graphics';

const WORDS = [
  { ko: '베트남', vi: 'Việt Nam', tag: 'vietnam,hanoi,daylight' },
  { ko: '한국', vi: 'Hàn Quốc', tag: 'korea,seoul,daylight' },
  { ko: '인도네시아', vi: 'Indonesia', tag: 'indonesia,jakarta,daylight' },
  { ko: '러시아', vi: 'Nga', tag: 'russia,moscow,daylight' },
];

const TABS = ['전체 보기', '한국어 보기', '베트남어 보기'];
const TOAST = 'Xem nghĩa và cách phát âm của từng từ. Bấm vào từ để tự luyện phát âm luôn nhé.';

export function ThemedWordbookScreen({
  theme,
  width = 390,
  height = 844,
  showStatusBar = true,
}: {
  theme: Theme;
  width?: number;
  height?: number;
  /** 에뮬레이터 프레임이 이미 상태바를 그리므로, 그 안에 넣을 때는 끈다 */
  showStatusBar?: boolean;
}) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const st = L.structure;
  const heroTop = st === 'hero-list';

  return (
    <View style={{ width, height, backgroundColor: c.canvas, overflow: 'hidden' }}>
      {showStatusBar && <StatusBar theme={theme} onPhoto={heroTop} />}
      <ActivityHeader theme={theme} onPhoto={heroTop} showStatusBar={showStatusBar} />

      {heroTop && <HeroTitle theme={theme} />}

      <View style={{ flex: 1, paddingHorizontal: L.edge, overflow: 'hidden' }}>
        {!heroTop && (
          <>
            <Badge theme={theme} />
            <Text style={[{ fontSize: theme.type.displaySize, color: c.ink, letterSpacing: theme.type.displayTracking, lineHeight: Math.round(theme.type.displaySize * theme.type.displayLine) }, displayFont(theme)]}>
              핵심 어휘를 확인해요.
            </Text>
            <Text style={[{ fontSize: theme.type.bodySize, color: c.muted, marginTop: 3, lineHeight: Math.round(theme.type.bodySize * theme.type.bodyLine) }, bodyFont(theme)]}>
              Đây là thông tin quan trọng.
            </Text>
          </>
        )}

        {st === 'stat-list' && <Stats theme={theme} />}
        {st !== 'grid' && st !== 'stat-list' && <Toast theme={theme} />}
        {(st === 'grid' || st === 'stat-list') && <ToastLine theme={theme} />}

        {st === 'focus-list' && <FocusWord theme={theme} />}

        <Tabs theme={theme} underline={st === 'tabs-list'} />

        {st === 'grid' ? (
          <Grid theme={theme} width={width} />
        ) : (
          <View style={{ flex: 1, marginTop: s.gap, overflow: 'hidden' }}>
            {(st === 'focus-list' ? WORDS.slice(1) : WORDS).map((w, i, arr) => (
              <Row key={w.ko} theme={theme} word={w} index={i} last={i === arr.length - 1} />
            ))}
          </View>
        )}
      </View>

      <BottomBar theme={theme} />
    </View>
  );
}

// ─── 조각 ─────────────────────────────────────────────────────────
function StatusBar({ theme, onPhoto }: { theme: Theme; onPhoto: boolean }) {
  const fg = onPhoto ? '#ffffff' : theme.colors.ink;
  return (
    <View
      style={[
        { height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, flexShrink: 0, zIndex: 4 },
        onPhoto ? { position: 'absolute', top: 0, left: 0, right: 0 } : null,
      ]}
    >
      <Text style={[{ fontSize: 11.5, color: fg }, bodyFont(theme, 600)]}>9:41</Text>
      <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
        {[3.5, 5.5, 7.5, 9.5].map((h) => (
          <View key={h} style={{ width: 2.5, height: h, borderRadius: 0.5, backgroundColor: fg, opacity: h === 9.5 ? 0.3 : 0.85 }} />
        ))}
        <View style={{ width: 16, height: 8.5, borderRadius: 2, borderWidth: 1, borderColor: fg, opacity: 0.85, marginLeft: 3, padding: 1 }}>
          <View style={{ flex: 1, backgroundColor: fg, borderRadius: 0.5 }} />
        </View>
      </View>
    </View>
  );
}

/** 원본의 ActivityHeader — 진행바 + 닫기 */
function ActivityHeader({ theme, onPhoto, showStatusBar = true }: { theme: Theme; onPhoto: boolean; showStatusBar?: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const track = onPhoto ? 'rgba(255,255,255,0.3)' : c.line;
  const fill = onPhoto ? '#ffffff' : c.primary;
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: L.edge, paddingTop: 4, paddingBottom: s.row, flexShrink: 0 },
        onPhoto ? { position: 'absolute', top: showStatusBar ? 30 : 4, left: 0, right: 0, zIndex: 4 } : null,
      ]}
    >
      <View style={{ flex: 1, height: 6, backgroundColor: track, borderRadius: L.radius === 0 ? 0 : 999, overflow: 'hidden' }}>
        <View style={{ width: '33%', height: 6, backgroundColor: fill, borderRadius: L.radius === 0 ? 0 : 999 }} />
      </View>
      <Image source={{ uri: icon('close', onPhoto ? '#ffffff' : c.muted, 17, 1.8) }} style={{ width: 17, height: 17 }} />
    </View>
  );
}

function Badge({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: c.primarySoft,
        borderRadius: L.radius === 0 ? 0 : 999,
        paddingHorizontal: 11,
        paddingVertical: 4,
        borderWidth: L.list === 'outline' || L.list === 'block' ? L.hairline : 0,
        borderColor: c.primary,
        marginBottom: s.gap,
      }}
    >
      <Text style={[{ fontSize: 11, color: readableOn(c.primarySoft, [c.primaryDark, c.ink]), letterSpacing: theme.type.labelTracking }, bodyFont(theme, 700)]}>
        단어장 1/3
      </Text>
    </View>
  );
}

/** hero-list — 상단 실사 사진 위에 배지와 제목 */
function HeroTitle({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  return (
    <View style={{ height: 216, flexShrink: 0, justifyContent: 'flex-end', overflow: 'hidden' }}>
      <Image source={{ uri: heroPhoto(theme, 800, 470) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Image source={{ uri: scrimUri(c.ink, 0, 0.88) }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
      <View style={{ paddingHorizontal: L.edge, paddingBottom: s.row }}>
        <Text style={[{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: theme.type.labelTracking, marginBottom: 6 }, bodyFont(theme, 700)]}>
          단어장 1/3
        </Text>
        <Text style={[{ fontSize: theme.type.displaySize, color: '#ffffff', letterSpacing: theme.type.displayTracking, lineHeight: Math.round(theme.type.displaySize * theme.type.displayLine) }, displayFont(theme)]}>
          핵심 어휘를 확인해요.
        </Text>
        <Text style={[{ fontSize: theme.type.bodySize - 0.5, color: 'rgba(255,255,255,0.82)', marginTop: 3 }, bodyFont(theme)]}>
          Đây là thông tin quan trọng.
        </Text>
      </View>
    </View>
  );
}

/** 원본의 안내 토스트 */
function Toast({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const fg = readableOn(c.primarySoft, [c.primaryDark, c.ink]);
  return (
    <View
      style={[
        {
          marginTop: s.block,
          borderRadius: L.radius,
          padding: s.row,
          backgroundColor: c.primarySoft,
          borderWidth: L.hairline,
          borderColor: c.primary,
        },
        shadowFor(L.shadow === 'soft' ? 'hair' : 'none', c.ink) as ViewStyle,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Text style={[{ flex: 1, fontSize: theme.type.bodySize - 0.5, color: fg, lineHeight: Math.round((theme.type.bodySize - 0.5) * theme.type.bodyLine) }, bodyFont(theme, 600)]}>
          {TOAST}
        </Text>
        <Image source={{ uri: icon('close', c.muted, 13, 1.8) }} style={{ width: 13, height: 13, marginTop: 2 }} />
      </View>
      <View style={{ alignItems: 'flex-end', marginTop: 5 }}>
        <Image source={{ uri: icon('volume', c.primaryDark, 15, 1.6) }} style={{ width: 15, height: 15 }} />
      </View>
    </View>
  );
}

/** 격자·통계 구조에서는 토스트를 한 줄로 줄인다 (자리를 통계·격자에 내준다) */
function ToastLine({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const s = spacing(theme.layout.density);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: s.row }}>
      <Image source={{ uri: icon('volume', c.primaryDark, 14, 1.6) }} style={{ width: 14, height: 14 }} />
      <Text numberOfLines={1} style={[{ flex: 1, fontSize: theme.type.bodySize - 2, color: c.textSecondary }, bodyFont(theme)]}>
        {TOAST}
      </Text>
    </View>
  );
}

/** stat-list — 진도 숫자 블록 */
function Stats({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const items = [
    { v: '4', k: '이번 세트' },
    { v: '1 / 3', k: '단어장' },
    { v: '82%', k: '정답률' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: s.block }}>
      {items.map((x) => (
        <View
          key={x.k}
          style={[
            { flex: 1, paddingVertical: s.row, paddingHorizontal: 9, borderRadius: L.radius },
            box(theme),
            L.list === 'rule' ? { borderLeftWidth: Math.max(2, L.hairline * 2), borderLeftColor: c.primary } : null,
          ]}
        >
          <Text style={[{ fontSize: theme.type.bodySize + 7, color: c.ink, letterSpacing: -0.5 }, displayFont(theme)]}>{x.v}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 1 }, bodyFont(theme, 600)]}>{x.k}</Text>
        </View>
      ))}
    </View>
  );
}

/** focus-list — 첫 단어를 크게 */
function FocusWord({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const w = WORDS[0];
  const size = L.density === 'open' ? 62 : 54;
  const isRule = L.list === 'rule';

  return (
    <View style={[{ marginTop: s.block, padding: isRule ? 0 : Math.max(11, s.row) }, box(theme, true)]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.row }}>
        <Image
          source={{ uri: coverPhoto(w.tag, size, size, theme.photo.lock + 1) }}
          style={{ width: size, height: size, borderRadius: photoRadius(L.photo === 'wide' ? 'rounded' : L.photo, size, L.radius) }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[{ fontSize: theme.type.displaySize * 0.72, color: c.ink, letterSpacing: theme.type.displayTracking }, displayFont(theme)]}>{w.ko}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 0.5, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>{w.vi}</Text>
        </View>
        <Speaker theme={theme} />
      </View>
      <View style={{ height: s.gap }} />
      <View style={{ height: L.hairline, backgroundColor: c.line }} />
      <View style={{ height: s.gap }} />
      <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize, color: c.ink }, bodyFont(theme, theme.type.bodyWeight + 200)]}>
        저는 베트남 사람이에요.
      </Text>
    </View>
  );
}

/** 보기 모드 탭 — tabs-list 구조에서는 언더라인 탭으로 올린다 */
function Tabs({ theme, underline }: { theme: Theme; underline: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);

  if (underline) {
    return (
      <View style={{ flexDirection: 'row', gap: 18, marginTop: s.block, borderBottomWidth: L.hairline, borderBottomColor: c.line }}>
        {TABS.map((label, i) => (
          <View key={label} style={{ paddingBottom: 8, borderBottomWidth: 2.5, borderBottomColor: i === 0 ? c.primary : 'transparent' }}>
            <Text style={[{ fontSize: theme.type.bodySize - 1, color: i === 0 ? c.primaryDark : c.muted }, bodyFont(theme, i === 0 ? 700 : 500)]}>
              {label.replace(' 보기', '')}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: 6, marginTop: s.block }}>
      {TABS.map((label, i) => {
        const on = i === 0;
        const filled = on && (L.list === 'card' || L.list === 'block' || L.button === 'block');
        return (
          <View
            key={label}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 7,
              borderRadius: L.button === 'pill' ? 999 : L.radius,
              backgroundColor: filled ? c.primary : on ? c.primarySoft : c.surface,
              borderWidth: Math.max(L.hairline, 1),
              borderColor: on ? c.primary : c.line,
            }}
          >
            <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 2.5, color: filled ? c.onPrimary : on ? c.primaryDark : c.muted }, bodyFont(theme, on ? 700 : 500)]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function box(theme: Theme, focus = false): ViewStyle {
  const c = theme.colors;
  const L = theme.layout;
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
}

function Speaker({ theme, small }: { theme: Theme; small?: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const size = small ? 32 : 38;
  const filled = L.list === 'rule' || L.list === 'inset';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: L.radius === 0 ? 0 : size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? c.primarySoft : 'transparent',
        borderWidth: filled ? 0 : L.hairline,
        borderColor: c.line,
      }}
    >
      <Image source={{ uri: icon('volume', c.primaryDark, small ? 15 : 17, 1.6) }} style={{ width: small ? 15 : 17, height: small ? 15 : 17 }} />
    </View>
  );
}

/** grid — 어휘를 2열 격자로 */
function Grid({ theme, width }: { theme: Theme; width: number }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const cellW = (width - L.edge * 2 - s.gap) / 2;
  const photoH = Math.round(cellW * 0.6);

  return (
    <View style={{ flex: 1, marginTop: s.gap, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s.gap }}>
        {WORDS.map((w) => (
          <View key={w.ko} style={[{ width: cellW, overflow: 'hidden' }, box(theme)]}>
            <Image source={{ uri: coverPhoto(w.tag, cellW, photoH, theme.photo.lock + w.ko.length * 5) }} style={{ width: '100%', height: photoH }} resizeMode="cover" />
            <View style={{ padding: L.density === 'tight' ? 9 : 11, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize + 1.5, color: c.ink }, bodyFont(theme, 700)]}>{w.ko}</Text>
                <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 2.5, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>{w.vi}</Text>
              </View>
              <Image source={{ uri: icon('volume', c.primaryDark, 14, 1.6) }} style={{ width: 14, height: 14 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Row({ theme, word, index, last }: { theme: Theme; word: { ko: string; vi: string; tag: string }; index: number; last: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const isRule = L.list === 'rule';
  const showPhoto = L.photo !== 'wide' && L.structure !== 'plain-list';
  const size = L.density === 'tight' ? 34 : 38;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: s.row,
          paddingVertical: isRule ? s.row + 2 : Math.max(9, s.row),
          paddingHorizontal: isRule ? 0 : Math.max(11, s.row),
          marginBottom: isRule ? 0 : s.gap,
          borderBottomWidth: isRule && !last ? L.hairline : 0,
          borderBottomColor: c.line,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 'auto',
          maxHeight: 108,
        },
        box(theme),
      ]}
    >
      {showPhoto && (
        <Image
          source={{ uri: coverPhoto(word.tag, size, size, theme.photo.lock + 7 * (index + 2)) }}
          style={{ width: size, height: size, borderRadius: photoRadius(L.photo, size, L.radius) }}
          resizeMode="cover"
        />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize + 3, color: c.ink, letterSpacing: -0.2 }, bodyFont(theme, 700)]}>{word.ko}</Text>
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 1, color: c.muted, marginTop: 2 }, bodyFont(theme)]}>{word.vi}</Text>
      </View>
      <Speaker theme={theme} small />
    </View>
  );
}

function BottomBar({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const r = buttonRadius(L.button, L.radius);
  const h = L.density === 'open' ? 52 : L.density === 'tight' ? 44 : 48;

  const primary: ViewStyle =
    L.button === 'outline'
      ? { borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary }
      : L.button === 'text'
      ? {}
      : L.button === 'block'
      ? { backgroundColor: c.primary, borderBottomWidth: 4, borderBottomColor: c.primaryDark }
      : { backgroundColor: c.primary, ...(shadowFor(L.shadow, c.primary) as ViewStyle) };
  const fg = L.button === 'outline' || L.button === 'text' ? c.primaryDark : c.onPrimary;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: L.edge,
        paddingTop: s.row,
        paddingBottom: 20,
        flexShrink: 0,
        borderTopWidth: L.shadow === 'none' ? L.hairline : 0,
        borderTopColor: c.line,
      }}
    >
      <View style={[{ flex: 1, height: h, borderRadius: r, alignItems: 'center', justifyContent: 'center' }, primary]}>
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize, color: fg }, bodyFont(theme, 700)]}>단어 발음하기</Text>
      </View>
      <View
        style={[
          {
            flex: 1,
            height: h,
            borderRadius: r,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: c.surface,
            borderWidth: Math.max(1, L.hairline),
            borderColor: L.button === 'block' ? c.ink : c.line,
          },
          L.button === 'block' ? { borderBottomWidth: 3 } : null,
        ]}
      >
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize, color: c.textSecondary }, bodyFont(theme, 700)]}>세트 문제 풀기</Text>
      </View>
    </View>
  );
}
