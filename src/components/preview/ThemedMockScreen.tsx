// 테마 미리보기 목업 — 단어장 화면.
//
// 이 파일의 핵심은 structure 다.
// 색과 모서리만 바꾸면 20종이 결국 같은 화면으로 보인다. 화면의 뼈대가 달라야 다른 앱처럼 보인다.
// 그래서 참조한 학습앱이 실제로 어떤 물건인지에 따라 구조를 여섯으로 나눴다.
//   focus-list  지금 학습 중인 단어 하나를 크게 세우고 나머지는 목록 (듀오링고·엘사·드롭스·스픽)
//   plain-list  초점 없이 균일한 목록 (칸·코세라·바벨·앙키)
//   grid        2열 격자 카드 (퀴즐렛·멤라이즈·아이토키)
//   tabs-list   상단 분류 탭 + 목록 (부수·링고디어·케이크)
//   hero-list   상단 큰 실사 사진 + 목록 (유데미·헬로톡·로제타)
//   stat-list   상단 숫자 통계 + 목록 (포토매스·브릴리언트·산타)
import { View, Text, Image, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import {
  type Theme,
  heroPhoto,
  coverPhoto,
  shadowFor,
  spacing,
  buttonRadius,
  photoRadius,
  displayFont,
  bodyFont,
  contrast,
} from '../../theme/themeTypes';
import { icon, scrimUri } from '../../theme/graphics';

const FOCUS = {
  ko: '베트남',
  vi: 'Việt Nam',
  tag: 'vietnam,hanoi,daylight',
  sentence: '저는 베트남 사람이에요.',
  sentenceVi: 'Tôi là người Việt Nam.',
};

const WORDS = [
  { ko: '한국', vi: 'Hàn Quốc', tag: 'korea,seoul,daylight' },
  { ko: '인도네시아', vi: 'Indonesia', tag: 'indonesia,jakarta,daylight' },
  { ko: '러시아', vi: 'Nga', tag: 'russia,moscow,daylight' },
  { ko: '필리핀', vi: 'Philippines', tag: 'philippines,manila,daylight' },
  { ko: '태국', vi: 'Thái Lan', tag: 'thailand,bangkok,daylight' },
  { ko: '일본', vi: 'Nhật Bản', tag: 'japan,tokyo,daylight' },
];

const ALL = [{ ...FOCUS }, ...WORDS];

export function ThemedMockScreen({ theme, width = 390, height = 844 }: { theme: Theme; width?: number; height?: number }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const st = L.structure;

  return (
    <View style={{ width, height, backgroundColor: c.canvas, overflow: 'hidden' }}>
      <StatusBar theme={theme} onPhoto={st === 'hero-list' || L.header === 'photo'} />

      {st === 'hero-list' ? <Hero theme={theme} /> : <Header theme={theme} />}

      <View style={{ flex: 1, paddingHorizontal: L.edge, paddingTop: s.block, overflow: 'hidden' }}>
        {st === 'focus-list' && <FocusCard theme={theme} />}
        {st === 'tabs-list' && <Tabs theme={theme} />}
        {st === 'stat-list' && <Stats theme={theme} />}

        <SectionLabel theme={theme} count={st === 'focus-list' ? WORDS.length : ALL.length} />

        {st === 'grid' ? (
          <Grid theme={theme} />
        ) : (
          <View style={{ flex: 1, overflow: 'hidden' }}>
            {(st === 'focus-list' ? WORDS : ALL).map((w, i, arr) => (
              <Row key={w.ko} theme={theme} word={w} index={i} last={i === arr.length - 1} />
            ))}
          </View>
        )}
      </View>

      <Actions theme={theme} />
    </View>
  );
}

// ─── 상태바 ───────────────────────────────────────────────────────
function StatusBar({ theme, onPhoto }: { theme: Theme; onPhoto: boolean }) {
  const fg = onPhoto ? '#ffffff' : theme.colors.ink;
  return (
    <View
      style={[
        { height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, flexShrink: 0, zIndex: 3 },
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

// ─── 텍스트 조각 ──────────────────────────────────────────────────
function Label({ theme, children, color }: { theme: Theme; children: string; color?: string }) {
  const t = theme.type;
  return (
    <Text
      style={[
        {
          fontSize: 10.5,
          color: color ?? theme.colors.muted,
          letterSpacing: t.labelTracking,
          textTransform: t.labelCase === 'upper' ? ('uppercase' as const) : ('none' as const),
        },
        bodyFont(theme, 700),
      ]}
    >
      {children}
    </Text>
  );
}

function Display({ theme, children, color, size, align }: { theme: Theme; children: string; color?: string; size?: number; align?: TextStyle['textAlign'] }) {
  const t = theme.type;
  const fz = size ?? t.displaySize;
  return (
    <Text
      style={[
        { fontSize: fz, color: color ?? theme.colors.ink, letterSpacing: t.displayTracking, lineHeight: Math.round(fz * t.displayLine), textAlign: align },
        displayFont(theme),
      ]}
    >
      {children}
    </Text>
  );
}

// ─── 상단 큰 사진 (hero-list) ─────────────────────────────────────
function Hero({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  return (
    <View style={{ height: 238, flexShrink: 0, justifyContent: 'flex-end', overflow: 'hidden' }}>
      <Image source={{ uri: heroPhoto(theme, 800, 480) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Image source={{ uri: scrimUri(c.ink, 0, 0.88) }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
      <View style={{ paddingHorizontal: L.edge, paddingBottom: s.row }}>
        <Label theme={theme} color="rgba(255,255,255,0.84)">1과 · 2차시</Label>
        <View style={{ height: 6 }} />
        <Display theme={theme} color="#ffffff">나라 이름</Display>
        <View style={{ height: s.gap }} />
        <Progress theme={theme} onPhoto />
      </View>
    </View>
  );
}

// ─── 헤더 ─────────────────────────────────────────────────────────
function Header({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const title = '나라 이름';
  const kicker = '1과 · 2차시';

  switch (L.header) {
    case 'photo':
      return (
        <View style={{ height: 206, flexShrink: 0, justifyContent: 'flex-end', overflow: 'hidden' }}>
          <Image source={{ uri: heroPhoto(theme, 800, 460) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <Image source={{ uri: scrimUri(c.ink, 0, 0.86) }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
          <View style={{ paddingHorizontal: L.edge, paddingBottom: s.row }}>
            <Label theme={theme} color="rgba(255,255,255,0.82)">{kicker}</Label>
            <View style={{ height: 6 }} />
            <Display theme={theme} color="#ffffff">{title}</Display>
            <View style={{ height: s.gap }} />
            <Progress theme={theme} onPhoto />
          </View>
        </View>
      );

    case 'band':
      return (
        <View style={{ flexShrink: 0, backgroundColor: c.primary, paddingHorizontal: L.edge, paddingTop: 4, paddingBottom: s.row + 2 }}>
          <Label theme={theme} color={c.onPrimary}>{kicker}</Label>
          <View style={{ height: 6 }} />
          <Display theme={theme} color={c.onPrimary}>{title}</Display>
          <View style={{ height: s.gap }} />
          <Progress theme={theme} onBand={c.onPrimary} />
        </View>
      );

    case 'rule':
      return (
        <View style={{ flexShrink: 0, paddingHorizontal: L.edge, paddingTop: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 }}>
            <Label theme={theme}>{kicker}</Label>
            <Progress theme={theme} inline />
          </View>
          <View style={{ height: L.hairline, backgroundColor: c.line }} />
          <View style={{ paddingTop: s.row, paddingBottom: 2 }}>
            <Display theme={theme}>{title}</Display>
          </View>
        </View>
      );

    case 'compact':
      return (
        <View style={{ flexShrink: 0, paddingHorizontal: L.edge, paddingTop: 2, paddingBottom: s.gap }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 9 }}>
            <Display theme={theme} size={Math.round(theme.type.displaySize * 0.66)}>{title}</Display>
            <Label theme={theme}>{kicker}</Label>
          </View>
          <View style={{ height: s.gap }} />
          <Progress theme={theme} />
        </View>
      );

    case 'stacked':
      return (
        <View style={{ flexShrink: 0, paddingHorizontal: L.edge, paddingTop: 4, paddingBottom: s.gap }}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: c.primarySoft,
              borderRadius: L.radius === 0 ? 0 : 999,
              paddingHorizontal: 11,
              paddingVertical: 4,
              marginBottom: s.gap,
            }}
          >
            <Label theme={theme} color={c.primaryDark}>{kicker}</Label>
          </View>
          <Display theme={theme}>{title}</Display>
          <View style={{ height: s.gap }} />
          <Progress theme={theme} />
        </View>
      );

    case 'editorial':
    default:
      return (
        <View style={{ flexShrink: 0, paddingHorizontal: L.edge, paddingTop: s.row }}>
          <Label theme={theme}>{kicker}</Label>
          <View style={{ height: s.gap }} />
          <Display theme={theme}>{title}</Display>
          <View style={{ height: s.row }} />
          <View style={{ height: L.hairline, backgroundColor: c.line }} />
          <View style={{ paddingTop: s.gap }}>
            <Progress theme={theme} />
          </View>
        </View>
      );
  }
}

// ─── 진행 표시 ────────────────────────────────────────────────────
function Progress({ theme, onPhoto, onBand, inline }: { theme: Theme; onPhoto?: boolean; onBand?: string; inline?: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  if (L.progress === 'none') return null;

  const fg = onPhoto ? '#ffffff' : onBand ?? c.primary;
  const track = onPhoto ? 'rgba(255,255,255,0.28)' : onBand ? 'rgba(255,255,255,0.32)' : c.line;
  const labelColor = onPhoto ? 'rgba(255,255,255,0.86)' : onBand ?? c.muted;

  if (L.progress === 'count') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
        <Text style={[{ fontSize: 15, color: fg, letterSpacing: -0.2 }, bodyFont(theme, 700)]}>1</Text>
        <Text style={[{ fontSize: 11, color: labelColor }, bodyFont(theme, 400)]}>/ 7 단어</Text>
      </View>
    );
  }
  if (L.progress === 'dots') {
    return (
      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? fg : track }} />
        ))}
      </View>
    );
  }
  if (L.progress === 'rule') {
    return (
      <View style={{ width: inline ? 96 : '100%' }}>
        <View style={{ height: L.hairline, backgroundColor: track }}>
          <View style={{ height: L.hairline, width: '14%', backgroundColor: fg }} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: inline ? 110 : '100%' }}>
      {!inline && (
        <View style={{ marginBottom: 5 }}>
          <Label theme={theme} color={labelColor}>7개 중 1번째</Label>
        </View>
      )}
      <View style={{ height: 5, backgroundColor: track, borderRadius: L.radius === 0 ? 0 : 999, overflow: 'hidden' }}>
        <View style={{ height: 5, width: '14%', backgroundColor: fg, borderRadius: L.radius === 0 ? 0 : 999 }} />
      </View>
    </View>
  );
}

// ─── 컨테이너 ─────────────────────────────────────────────────────
function containerStyle(theme: Theme, focus = false): ViewStyle {
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

// ─── 초점 카드 (focus-list) ───────────────────────────────────────
function FocusCard({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const isRule = L.list === 'rule';
  const pad = isRule ? 0 : L.density === 'tight' ? 12 : 15;
  const size = L.density === 'open' ? 66 : 58;

  return (
    <View style={[{ padding: pad, marginBottom: s.block }, containerStyle(theme, true)]}>
      {L.photo === 'wide' ? (
        <Image
          source={{ uri: coverPhoto(FOCUS.tag, 700, 300, theme.photo.lock + 1) }}
          style={{ width: '100%', height: 104, borderRadius: photoRadius('wide', 0, L.radius), marginBottom: s.gap }}
          resizeMode="cover"
        />
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.row }}>
        {L.photo !== 'wide' && (
          <Image
            source={{ uri: coverPhoto(FOCUS.tag, size, size, theme.photo.lock + 1) }}
            style={{ width: size, height: size, borderRadius: photoRadius(L.photo, size, L.radius) }}
            resizeMode="cover"
          />
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Display theme={theme} size={Math.round(theme.type.displaySize * 0.8)}>{FOCUS.ko}</Display>
          <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 0.5, color: c.muted }, bodyFont(theme)]}>{FOCUS.vi}</Text>
        </View>
        <PlayButton theme={theme} />
      </View>
      <View style={{ height: s.row }} />
      <View style={{ height: L.hairline, backgroundColor: c.line, opacity: isRule ? 1 : 0.7 }} />
      <View style={{ height: s.gap }} />
      <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize, color: c.ink }, bodyFont(theme, theme.type.bodyWeight + 200)]}>
        {FOCUS.sentence}
      </Text>
      <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 1.5, color: c.muted, marginTop: 2 }, bodyFont(theme)]}>
        {FOCUS.sentenceVi}
      </Text>
    </View>
  );
}

// ─── 분류 탭 (tabs-list) ──────────────────────────────────────────
function Tabs({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: s.block }}>
      {['전체', '한국어', 'Tiếng Việt'].map((label, i) => {
        const on = i === 0;
        const filled = on && (L.list === 'block' || L.button === 'block' || L.list === 'card');
        return (
          <View
            key={label}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              borderRadius: L.button === 'pill' ? 999 : L.radius,
              backgroundColor: filled ? c.primary : on ? c.primarySoft : c.surface,
              borderWidth: Math.max(L.hairline, 1),
              borderColor: on ? c.primary : c.line,
            }}
          >
            <Text
              numberOfLines={1}
              style={[{ fontSize: theme.type.bodySize - 2, color: filled ? c.onPrimary : on ? c.primaryDark : c.muted }, bodyFont(theme, on ? 700 : 500)]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── 숫자 통계 (stat-list) ────────────────────────────────────────
function Stats({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const stats = [
    { v: '7', k: '오늘 단어' },
    { v: '82%', k: '정답률' },
    { v: '4일', k: '연속 학습' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: s.block }}>
      {stats.map((x) => (
        <View
          key={x.k}
          style={[
            { flex: 1, paddingVertical: s.row, paddingHorizontal: 8, borderRadius: L.radius, alignItems: 'flex-start' },
            containerStyle(theme),
            L.list === 'rule' ? { borderLeftWidth: Math.max(2, L.hairline * 2), borderLeftColor: c.primary, paddingLeft: 9 } : null,
          ]}
        >
          <Text style={[{ fontSize: theme.type.bodySize + 8, color: c.ink, letterSpacing: -0.6 }, displayFont(theme)]}>{x.v}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 1 }, bodyFont(theme, 600)]}>{x.k}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── 2열 격자 (grid) ──────────────────────────────────────────────
function Grid({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const cellW = (390 - L.edge * 2 - s.gap) / 2;
  const photoH = Math.round(cellW * 0.62);

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s.gap }}>
        {ALL.map((w) => (
          <View key={w.ko} style={[{ width: cellW, overflow: 'hidden' }, containerStyle(theme)]}>
            <Image
              source={{ uri: coverPhoto(w.tag, cellW, photoH, theme.photo.lock + w.ko.length * 7) }}
              style={{ width: '100%', height: photoH }}
              resizeMode="cover"
            />
            <View style={{ padding: L.density === 'tight' ? 9 : 11 }}>
              <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize + 2, color: c.ink }, bodyFont(theme, 700)]}>{w.ko}</Text>
              <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 2, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>{w.vi}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── 섹션 라벨 ────────────────────────────────────────────────────
function SectionLabel({ theme, count }: { theme: Theme; count: number }) {
  const s = spacing(theme.layout.density);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: s.gap, flexShrink: 0 }}>
      <Label theme={theme}>{theme.layout.structure === 'focus-list' ? '다음 단어' : '이번 세트'}</Label>
      <Label theme={theme}>{String(count)}</Label>
    </View>
  );
}

// ─── 목록 행 ──────────────────────────────────────────────────────
function Row({ theme, word, index, last }: { theme: Theme; word: { ko: string; vi: string; tag: string }; index: number; last: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const isRule = L.list === 'rule';
  const size = L.density === 'tight' ? 34 : 38;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: s.row,
          paddingVertical: isRule ? s.row : Math.max(8, s.row - 2),
          paddingHorizontal: isRule ? 0 : Math.max(9, s.row),
          marginBottom: isRule ? 0 : s.gap,
          borderBottomWidth: isRule && !last ? L.hairline : 0,
          borderBottomColor: c.line,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 'auto',
          maxHeight: size + s.row * 2 + (L.density === 'open' ? 40 : L.density === 'tight' ? 16 : 26),
        },
        containerStyle(theme),
      ]}
    >
      {L.photo !== 'wide' && (
        <Image
          source={{ uri: coverPhoto(word.tag, size, size, theme.photo.lock + 7 * (index + 2)) }}
          style={{ width: size, height: size, borderRadius: photoRadius(L.photo, size, L.radius) }}
          resizeMode="cover"
        />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize + 1.5, color: c.ink }, bodyFont(theme, theme.type.bodyWeight + 200)]}>
          {word.ko}
        </Text>
        <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize - 2, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>
          {word.vi}
        </Text>
      </View>
      <PlayButton theme={theme} small />
    </View>
  );
}

function PlayButton({ theme, small }: { theme: Theme; small?: boolean }) {
  const c = theme.colors;
  const L = theme.layout;
  const size = small ? 30 : 40;
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
      <Image source={{ uri: icon('volume', c.primaryDark, small ? 15 : 18, 1.6) }} style={{ width: small ? 15 : 18, height: small ? 15 : 18 }} />
    </View>
  );
}

// ─── 하단 액션 ────────────────────────────────────────────────────
function Actions({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const r = buttonRadius(L.button, L.radius);
  const h = L.density === 'open' ? 52 : L.density === 'tight' ? 44 : 48;

  const primary: ViewStyle =
    L.button === 'outline'
      ? { backgroundColor: 'transparent', borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary }
      : L.button === 'text'
      ? { backgroundColor: 'transparent' }
      : L.button === 'block'
      ? { backgroundColor: c.primary, borderBottomWidth: 4, borderBottomColor: c.primaryDark }
      : { backgroundColor: c.primary, ...(shadowFor(L.shadow, c.primary) as ViewStyle) };

  const fg = L.button === 'outline' || L.button === 'text' ? c.primaryDark : c.onPrimary;

  return (
    <View
      style={{
        flexShrink: 0,
        paddingHorizontal: L.edge,
        paddingTop: s.row,
        paddingBottom: 20,
        borderTopWidth: L.list === 'rule' || L.shadow === 'none' ? L.hairline : 0,
        borderTopColor: c.line,
      }}
    >
      <View style={[{ height: h, borderRadius: r, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 }, primary]}>
        <Image source={{ uri: icon('mic', fg, 16, 1.7) }} style={{ width: 16, height: 16 }} />
        <Text style={[{ fontSize: theme.type.bodySize + 1, color: fg, letterSpacing: contrast(fg, c.primary) > 8 ? 0.2 : 0 }, bodyFont(theme, 700)]}>
          발음 연습
        </Text>
      </View>
      <View style={{ alignItems: 'center', paddingTop: s.gap }}>
        <Text style={[{ fontSize: theme.type.bodySize - 1.5, color: c.muted }, bodyFont(theme, 500)]}>나중에 할래요</Text>
      </View>
    </View>
  );
}
