// 완료 화면 — 세트 학습을 마쳤을 때.
//
// 구조(structure)마다 화면 구성 자체가 다르다. 밴드 색만 바꾸면 20종이 같은 화면으로 보인다.
//   focus-list  중앙에 큰 축하 아트 + 가로 통계 3칸
//   plain-list  좌측 정렬 헤드라인 + 작은 아트 + 구분선 통계 목록
//   grid        밴드 없이 흰 지면 + 2×2 통계 격자
//   tabs-list   좌우 분할 밴드(제목 | 아트) + 가로 막대 통계
//   hero-list   전면 실사 사진 + 사진 위 반투명 통계 바
//   stat-list   큰 점수 링 + 표 형식 통계
//
// 축하의 얼굴(art)도 테마마다 다르다 — 캐릭터 일러스트 / 실사 사진 / 벡터 마크 8종 / 큰 점수.
import { View, Text, Image, StyleSheet, type ViewStyle } from 'react-native';
import {
  type Theme,
  coverPhoto,
  shadowFor,
  spacing,
  buttonRadius,
  displayFont,
  bodyFont,
  readableOn,
  luminance,
} from '../../theme/themeTypes';
import { icon, scrimUri, markUri, ringUri, type MarkKind } from '../../theme/graphics';
import { THEMES } from '../../theme/themes';
import { CanvasFireworks } from './CanvasFireworks';
import { themeAssets } from '../../theme/themeAssets';

const CHARACTER = require('../../../assets/character-kchao.png');

// 완료 화면은 테마의 히어로 사진(도시·거리·풍경)을 쓰면 안 된다.
// 방금 공부를 끝낸 화면에 기차나 산이 나오면 맥락이 어긋난다.
// 학습 장면만 모아 테마마다 다른 조합을 쓴다.
export type PhotoPick = { t: string; l: number };

// 완료 화면은 테마의 히어로 사진(도시·거리·풍경)을 쓰면 안 된다.
// 방금 공부를 끝낸 화면에 기차나 산이 나오면 맥락이 어긋난다.
//
// ⚠️ lock 은 절대값으로 고정한다 — loremflickr 는 같은 lock 이라도 요청 픽셀 크기가
//    다르면 다른 사진을 주고, 사진 풀도 시간이 지나면 바뀐다. 그래서 (태그, lock, 요청치수)
//    세 개를 함께 고정하고, 전수 내려받아 눈으로 재검증했다(2026-09-01, 55장+후보 51장).
//    요청 치수: 스트립 200×66 → 400×198 / 밴드 390×구조높이 → 780×(3×높이).
export const LEARN_PICKS: Record<string, PhotoPick[]> = {
  duolingo: [{ t: 'student,desk,writing', l: 51 }, { t: 'study,desk', l: 795 }, { t: 'writing,notebook,pen', l: 374 }],
  'khan-academy': [{ t: 'notebook,pencil,desk', l: 63 }, { t: 'books,stack', l: 74 }, { t: 'bookshelf,study', l: 85 }],
  quizlet: [{ t: 'library,study', l: 77 }, { t: 'notebook,writing', l: 88 }, { t: 'pencil,paper,write', l: 99 }],
  coursera: [{ t: 'student,desk,writing', l: 81 }, { t: 'books,stack', l: 92 }, { t: 'university,study', l: 103 }],
  udemy: [{ t: 'notebook,pencil,desk', l: 93 }, { t: 'books,stack', l: 104 }, { t: 'writing,notebook,pen', l: 115 }],
  babbel: [{ t: 'student,desk,writing', l: 107 }, { t: 'library,study', l: 635 }, { t: 'study,desk', l: 129 }],
  memrise: [{ t: 'student,desk,writing', l: 119 }, { t: 'chalkboard,school', l: 130 }, { t: 'books,colorful', l: 141 }],
  busuu: [{ t: 'library,study', l: 123 }, { t: 'notebook,pencil,desk', l: 435 }, { t: 'flashcards,vocabulary', l: 145 }],
  photomath: [{ t: 'math,notebook,pencil', l: 137 }, { t: 'math,notebook,pencil', l: 665 }, { t: 'pencil,paper,write', l: 676 }],
  brilliant: [{ t: 'student,desk,writing', l: 141 }, { t: 'books,stack', l: 453 }, { t: 'notes,desk', l: 163 }],
  'elsa-speak': [{ t: 'student,desk,writing', l: 153 }, { t: 'library,study', l: 164 }, { t: 'handwriting,notebook', l: 175 }],
  hellotalk: [{ t: 'student,desk,writing', l: 167 }, { t: 'writing,notebook,pen', l: 911 }, { t: 'flashcards,vocabulary', l: 189 }],
  drops: [{ t: 'handwriting,notebook', l: 171 }, { t: 'handwriting,notebook', l: 699 }, { t: 'notebook,pencil,desk', l: 710 }],
  lingodeer: [{ t: 'grammar,book', l: 490 }, { t: 'writing,notebook,pen', l: 200 }, { t: 'desk,stationery,pencil', l: 211 }],
  rosetta: [{ t: 'student,desk,writing', l: 191 }, { t: 'reading,study', l: 202 }, { t: 'books,stack', l: 514 }],
  italki: [{ t: 'tutor,study', l: 203 }, { t: 'vocabulary,notebook', l: 214 }, { t: 'books,desk', l: 225 }],
  anki: [{ t: 'vocabulary,notebook', l: 207 }, { t: 'notebook,plain', l: 218 }, { t: 'pencil,paper,write', l: 530 }],
  cake: [{ t: 'study,notes,yellow', l: 213 }, { t: 'notebook,highlighter', l: 224 }, { t: 'books,desk', l: 235 }],
  speak: [{ t: 'books,stack', l: 219 }, { t: 'pen,minimal', l: 531 }, { t: 'handwriting,notebook', l: 241 }],
  santa: [{ t: 'exam,paper', l: 532 }, { t: 'books,stack', l: 242 }, { t: 'notebook,pencil,desk', l: 253 }],
  malhaeboka: [{ t: 'classroom,students', l: 21 }, { t: 'books,study', l: 34 }, { t: 'notebook,writing', l: 851 }],
  'malhaeboka-blue': [{ t: 'classroom,students', l: 21 }, { t: 'books,study', l: 34 }, { t: 'notebook,writing', l: 851 }],
};
export const LEARN_FALLBACK: PhotoPick[] = [
  { t: 'notebook,pencil,desk', l: 63 }, { t: 'books,stack', l: 74 }, { t: 'study,desk', l: 795 },
];

/** 사진 밴드(실사 배경) 테마의 밴드 사진 — 역시 절대 lock 으로 고정 */
export const BAND_PICKS: Record<string, PhotoPick> = {
  udemy: { t: 'notebook,pencil,desk', l: 56 },
  hellotalk: { t: 'student,desk,writing', l: 130 },
  drops: { t: 'student,desk,writing', l: 651 },
  rosetta: { t: 'student,desk,writing', l: 455 },
};

/** 갤러리 목업(390×844)의 밴드 높이 — 사진 lock 검증이 이 치수 기준이다 */
export function mockBandH(st: string): number {
  return st === 'hero-list' ? Math.round(844 * 0.52)
    : st === 'stat-list' ? Math.round(844 * 0.34)
    : st === 'plain-list' ? Math.round(844 * 0.28)
    : st === 'tabs-list' ? Math.round(844 * 0.32)
    : Math.round(844 * 0.44);
}

const STATS = [
  { label: '정확도', value: '87%' },
  { label: '걸린 시간', value: '6분 12초' },
  { label: '외운 단어', value: '4' },
];

export type Art = { kind: 'character' | 'photo' | 'mark' | 'score'; mark?: MarkKind };

export function artOf(t: Theme): Art {
  const byId: Record<string, Art> = {
    duolingo: { kind: 'character' },
    malhaeboka: { kind: 'character' }, // 마스코트 중심 앱
    'malhaeboka-blue': { kind: 'character' }, // 마스코트 중심 앱,
    memrise: { kind: 'character' },
    lingokids: { kind: 'character' },
    hellotalk: { kind: 'photo' },
    udemy: { kind: 'photo' },
    rosetta: { kind: 'photo' },
    drops: { kind: 'photo' },
    italki: { kind: 'photo' },
    santa: { kind: 'score' },
    brilliant: { kind: 'score' },
    photomath: { kind: 'score' },
    quizlet: { kind: 'score' },
    'khan-academy': { kind: 'mark', mark: 'seed' },
    coursera: { kind: 'mark', mark: 'medal' },
    babbel: { kind: 'mark', mark: 'rosette' },
    busuu: { kind: 'mark', mark: 'arc-rings' },
    lingodeer: { kind: 'mark', mark: 'star-burst' },
    anki: { kind: 'mark', mark: 'grid-tick' },
    cake: { kind: 'mark', mark: 'trophy' },
    speak: { kind: 'mark', mark: 'check-circle' },
  };
  return byId[t.id] ?? { kind: 'mark', mark: 'check-circle' };
}

/** 축하 연출의 세기 — 미니멀한 테마에 요란한 폭죽을 쏘면 그 순간 시안이 죽는다 */
export function festivity(t: Theme): 'quiet' | 'warm' | 'loud' {
  if (t.layout.button === 'block' || t.layout.radius >= 18) return 'loud';
  if (t.layout.list === 'rule' || t.layout.radius <= 4 || t.layout.shadow === 'none') return 'quiet';
  return 'warm';
}

export function ThemedCelebrationMock({
  theme,
  width = 390,
  height = 844,
  live = true,
}: {
  theme: Theme;
  width?: number;
  height?: number;
  /** 큰 미리보기에서만 캔버스 폭죽을 돌린다 (썸네일 20장 동시 RAF 는 무겁다) */
  live?: boolean;
}) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const st = L.structure;
  const art = artOf(theme);
  const mood = festivity(theme);
  const photoTop = art.kind === 'photo' || st === 'hero-list';
  const variant = Math.max(0, THEMES.findIndex((x) => x.id === theme.id));
  const learnPicks = LEARN_PICKS[theme.id] ?? LEARN_FALLBACK;
  const bandPick = BAND_PICKS[theme.id] ?? { t: learnPicks[0].t, l: theme.photo.lock + 3 };

  // 구조마다 상단 영역의 성격이 다르다
  const bandH =
    st === 'hero-list' ? Math.round(height * 0.52) :
    st === 'grid' ? 0 :
    st === 'stat-list' ? Math.round(height * 0.34) :
    st === 'plain-list' ? Math.round(height * 0.28) :
    st === 'tabs-list' ? Math.round(height * 0.32) :
    Math.round(height * 0.44);

  const bandBg = photoTop ? 'transparent' : mood === 'quiet' ? c.canvas : c.primary;
  const onBand = photoTop ? '#ffffff' : mood === 'quiet' ? c.ink : c.onPrimary;
  const subOnBand = photoTop ? 'rgba(255,255,255,0.86)' : mood === 'quiet' ? c.muted : readableOn(c.primary, [c.onPrimary, '#ffffff']);
  const bright = !photoTop && luminance(bandBg) > 0.4;

  const Fireworks = ({ h }: { h: number }) =>
    live ? (
      <CanvasFireworks
        width={width}
        height={h}
        variant={variant}
        power={mood === 'loud' ? 1 : mood === 'warm' ? 0.82 : 0.6}
        blend={bright ? 'normal' : 'add'}
        colors={bright ? [c.accent, c.primaryDark, c.ink] : ['#ffffff', c.accent, c.primarySoft]}
      />
    ) : null;

  return (
    <View style={{ width, height, backgroundColor: c.canvas, overflow: 'hidden' }}>
      {/* ── 상단 ── */}
      {st === 'grid' ? (
        // 밴드를 아예 두지 않는다. 흰 지면 위에 아트만.
        <View style={{ paddingTop: 34, paddingHorizontal: L.edge, alignItems: 'center', flexShrink: 0 }}>
          <Fireworks h={Math.round(height * 0.4)} />
          <ArtPiece theme={theme} art={art} size={104} />
          <View style={{ height: s.row }} />
          <Title theme={theme} color={c.ink} />
          <Sub theme={theme} color={c.muted} />
        </View>
      ) : (
        <View
          style={{
            height: bandH,
            backgroundColor: bandBg,
            overflow: 'hidden',
            borderBottomWidth: mood === 'quiet' && !photoTop ? L.hairline : 0,
            borderBottomColor: c.line,
            borderBottomLeftRadius: st === 'tabs-list' ? L.radius * 1.6 : 0,
            borderBottomRightRadius: st === 'tabs-list' ? L.radius * 1.6 : 0,
          }}
        >
          {photoTop && (
            <>
              <Image source={{ uri: coverPhoto(bandPick.t, width, bandH, bandPick.l) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <Image source={{ uri: scrimUri(c.ink, 0.16, 0.86) }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
            </>
          )}
          <Fireworks h={bandH} />

          <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 18 }}>
            <Image source={{ uri: icon('close', onBand, 15, 1.8) }} style={{ width: 15, height: 15 }} />
          </View>

          {st === 'plain-list' ? (
            <View style={{ flex: 1, paddingHorizontal: L.edge, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.row }}>
                <ArtPiece theme={theme} art={art} size={58} />
                <View style={{ flex: 1 }}>
                  <Title theme={theme} color={onBand} size={0.82} align="left" />
                  <Sub theme={theme} color={subOnBand} align="left" />
                </View>
              </View>
            </View>
          ) : st === 'tabs-list' ? (
            // 좌우 분할 — 왼쪽 제목, 오른쪽 아트
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: L.edge, gap: s.row }}>
              <View style={{ flex: 1 }}>
                <Text style={[{ fontSize: 11, color: subOnBand, letterSpacing: theme.type.labelTracking, marginBottom: 6 }, bodyFont(theme, 700)]}>
                  1과 2차시
                </Text>
                <Title theme={theme} color={onBand} size={0.86} align="left" />
              </View>
              <ArtPiece theme={theme} art={art} size={82} />
            </View>
          ) : st === 'hero-list' ? (
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: L.edge, paddingBottom: s.row }}>
              <Text style={[{ fontSize: 11, color: 'rgba(255,255,255,0.86)', letterSpacing: theme.type.labelTracking, marginBottom: 6 }, bodyFont(theme, 700)]}>
                1과 2차시 · 나라 이름
              </Text>
              <Title theme={theme} color="#ffffff" align="left" />
              <Sub theme={theme} color="rgba(255,255,255,0.86)" align="left" />
            </View>
          ) : st === 'stat-list' ? (
            // 큰 점수 링이 주인공
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ScoreRing theme={theme} onBand={onBand} />
              <View style={{ height: s.gap }} />
              <Title theme={theme} color={onBand} size={0.74} />
            </View>
          ) : (
            // focus-list — 중앙에 크게
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: L.edge }}>
              <ArtPiece theme={theme} art={art} size={106} />
              <View style={{ height: s.row }} />
              <Title theme={theme} color={onBand} />
              <Sub theme={theme} color={subOnBand} />
            </View>
          )}
        </View>
      )}

      {/* ── 기록 ── */}
      <View style={{ flex: 1, paddingHorizontal: L.edge, paddingTop: s.block, justifyContent: 'space-between', overflow: 'hidden' }}>
        {st === 'grid' ? (
          <StatGrid theme={theme} />
        ) : st === 'plain-list' ? (
          <StatRows theme={theme} />
        ) : st === 'tabs-list' ? (
          <StatBars theme={theme} />
        ) : st === 'stat-list' ? (
          <StatTable theme={theme} />
        ) : st === 'hero-list' ? (
          <StatStrip theme={theme} />
        ) : (
          <StatRow theme={theme} />
        )}

        {st !== 'grid' && <LearnStrip theme={theme} picks={learnPicks} />}

        <NextCard theme={theme} />

        <View style={{ paddingBottom: 20 }}>
          <Cta theme={theme} />
        </View>
      </View>
    </View>
  );
}

// ─── 축하의 얼굴 ──────────────────────────────────────────────────
function ArtPiece({ theme, art, size }: { theme: Theme; art: Art; size: number }) {
  const c = theme.colors;
  const L = theme.layout;

  if (art.kind === 'character') {
    return (
      <View
        style={[
          { borderRadius: L.radius === 0 ? 0 : Math.max(L.radius, 20), overflow: 'hidden', borderWidth: L.list === 'block' ? 2 : 0, borderColor: c.ink },
          shadowFor(L.shadow, c.ink) as ViewStyle,
        ]}
      >
        <Image source={themeAssets(theme.id)?.character ?? CHARACTER} style={{ width: size, height: size }} resizeMode="cover" />
      </View>
    );
  }
  if (art.kind === 'photo') {
    // 사진형 테마는 배경이 이미 실사라 얼굴을 따로 두지 않는다
    return null;
  }
  if (art.kind === 'score') {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={[{ fontSize: Math.round(size * 0.8), color: c.ink, letterSpacing: -2, lineHeight: Math.round(size * 0.9) }, displayFont(theme)]}>87</Text>
        <Text style={[{ fontSize: 11, color: c.muted, letterSpacing: theme.type.labelTracking }, bodyFont(theme, 700)]}>점</Text>
      </View>
    );
  }
  return <Image source={{ uri: markUri(art.mark ?? 'check-circle', c.primary, c.accent, size) }} style={{ width: size, height: size }} />;
}

function ScoreRing({ theme, onBand }: { theme: Theme; onBand: string }) {
  const c = theme.colors;
  const track = onBand === c.ink ? c.line : 'rgba(255,255,255,0.32)';
  const fill = onBand === c.ink ? c.primary : '#ffffff';
  return (
    <View style={{ width: 116, height: 116, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: ringUri(track, fill, 0.87, 2.6) }} style={{ width: 116, height: 116, position: 'absolute' }} />
      <Text style={[{ fontSize: 38, color: onBand, letterSpacing: -1.5 }, displayFont(theme)]}>87</Text>
      <Text style={[{ fontSize: 10.5, color: onBand, opacity: 0.75, letterSpacing: theme.type.labelTracking }, bodyFont(theme, 700)]}>정확도</Text>
    </View>
  );
}

function Title({ theme, color, size = 1, align = 'center' }: { theme: Theme; color: string; size?: number; align?: 'left' | 'center' }) {
  const fz = Math.round(theme.type.displaySize * 1.02 * size);
  return (
    <Text
      style={[
        { fontSize: fz, color, letterSpacing: theme.type.displayTracking, lineHeight: Math.round(fz * theme.type.displayLine), textAlign: align },
        displayFont(theme),
      ]}
    >
      4단어 다 외웠어요
    </Text>
  );
}

function Sub({ theme, color, align = 'center' }: { theme: Theme; color: string; align?: 'left' | 'center' }) {
  return (
    <Text style={[{ fontSize: theme.type.bodySize, color, marginTop: 5, textAlign: align, lineHeight: Math.round(theme.type.bodySize * theme.type.bodyLine) }, bodyFont(theme)]}>
      Bạn đã học xong 4 từ vựng
    </Text>
  );
}

// ─── 기록 표시 6종 ────────────────────────────────────────────────
export function boxStyle(theme: Theme): ViewStyle {
  const c = theme.colors;
  const L = theme.layout;
  switch (L.list) {
    case 'card':
      return { backgroundColor: c.surface, borderRadius: L.radius, ...(shadowFor(L.shadow === 'none' ? 'hair' : L.shadow, c.ink) as ViewStyle) };
    case 'outline':
      return { backgroundColor: c.surface, borderRadius: L.radius, borderWidth: L.hairline, borderColor: c.line };
    case 'inset':
      return { backgroundColor: c.backdrop, borderRadius: L.radius };
    case 'block':
      return { backgroundColor: c.surface, borderRadius: L.radius, borderWidth: Math.max(1.5, L.hairline * 2), borderColor: c.ink };
    default:
      return {};
  }
}

function StatRow({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const s = spacing(theme.layout.density);
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {STATS.map((x) => (
        <View key={x.label} style={[{ flex: 1, paddingVertical: s.row, paddingHorizontal: 8, alignItems: 'center' }, boxStyle(theme)]}>
          <Text numberOfLines={1} style={[{ fontSize: theme.type.bodySize + 4, color: c.ink, letterSpacing: -0.4 }, bodyFont(theme, 700)]}>{x.value}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 2 }, bodyFont(theme)]}>{x.label}</Text>
        </View>
      ))}
    </View>
  );
}

function StatRows({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  return (
    <View>
      {STATS.map((x, i) => (
        <View
          key={x.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: s.row,
            borderBottomWidth: i === STATS.length - 1 ? 0 : L.hairline,
            borderBottomColor: c.line,
          }}
        >
          <Text style={[{ fontSize: theme.type.bodySize, color: c.textSecondary }, bodyFont(theme)]}>{x.label}</Text>
          <Text style={[{ fontSize: theme.type.bodySize + 3, color: c.ink, letterSpacing: -0.2 }, bodyFont(theme, 700)]}>{x.value}</Text>
        </View>
      ))}
    </View>
  );
}

function StatGrid({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const s = spacing(theme.layout.density);
  const items = [...STATS, { label: '연속 학습', value: '4일' }];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s.gap }}>
      {items.map((x) => (
        <View key={x.label} style={[{ width: '47.5%', flexGrow: 1, paddingVertical: s.row + 2, paddingHorizontal: 12 }, boxStyle(theme)]}>
          <Text style={[{ fontSize: theme.type.bodySize + 7, color: c.ink, letterSpacing: -0.5 }, displayFont(theme)]}>{x.value}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 2.5, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>{x.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** 가로 막대 — 값이 비율로 읽힌다 */
function StatBars({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const rows = [
    { label: '정확도', value: '87%', pct: 0.87 },
    { label: '완료율', value: '100%', pct: 1 },
    { label: '목표 대비', value: '80%', pct: 0.8 },
  ];
  return (
    <View style={{ gap: s.row }}>
      {rows.map((r) => (
        <View key={r.label}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.textSecondary }, bodyFont(theme, 600)]}>{r.label}</Text>
            <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.ink }, bodyFont(theme, 700)]}>{r.value}</Text>
          </View>
          <View style={{ height: 8, backgroundColor: c.line, borderRadius: L.radius === 0 ? 0 : 999, overflow: 'hidden' }}>
            <View style={{ width: `${r.pct * 100}%`, height: 8, backgroundColor: c.primary, borderRadius: L.radius === 0 ? 0 : 999 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** 표 — 데이터가 주인공인 테마 */
function StatTable({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const rows = [...STATS, { label: '연속 학습', value: '4일' }];
  return (
    <View style={[{ overflow: 'hidden' }, boxStyle(theme)]}>
      {rows.map((x, i) => (
        <View
          key={x.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderBottomWidth: i === rows.length - 1 ? 0 : L.hairline,
            borderBottomColor: c.line,
            backgroundColor: i % 2 === 1 ? c.backdrop : 'transparent',
          }}
        >
          <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.textSecondary }, bodyFont(theme)]}>{x.label}</Text>
          <Text style={[{ fontSize: theme.type.bodySize + 1, color: c.ink }, bodyFont(theme, 700)]}>{x.value}</Text>
        </View>
      ))}
    </View>
  );
}

/** 한 줄 띠 — 사진형 테마 */
function StatStrip({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: L.radius,
        backgroundColor: c.primarySoft,
        paddingVertical: 12,
      }}
    >
      {STATS.map((x, i) => (
        <View
          key={x.label}
          style={{
            flex: 1,
            alignItems: 'center',
            borderLeftWidth: i === 0 ? 0 : L.hairline,
            borderLeftColor: c.line,
          }}
        >
          <Text style={[{ fontSize: theme.type.bodySize + 3, color: c.ink, letterSpacing: -0.3 }, bodyFont(theme, 700)]}>{x.value}</Text>
          <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>{x.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** 오늘 공부한 흔적 — 학습 장면 실사 3장. 완료 화면을 채우되 맥락에서 벗어나지 않게 */
function LearnStrip({ theme, picks }: { theme: Theme; picks: PhotoPick[] }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const h = 66;
  return (
    <View>
      <Text style={[{ fontSize: 10.5, color: c.muted, letterSpacing: theme.type.labelTracking, marginBottom: s.gap }, bodyFont(theme, 700)]}>
        오늘의 학습
      </Text>
      <View style={{ flexDirection: 'row', gap: s.gap }}>
        {picks.map((p) => (
          <Image
            key={p.t + p.l}
            source={{ uri: coverPhoto(p.t, 200, h, p.l) }}
            style={{ flex: 1, height: h, borderRadius: L.radius === 0 ? 0 : Math.min(L.radius, 12) }}
            resizeMode="cover"
          />
        ))}
      </View>
    </View>
  );
}

function NextCard({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const bare = L.list === 'rule';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        paddingVertical: s.row,
        paddingHorizontal: bare ? 0 : Math.max(11, s.row),
        backgroundColor: bare ? 'transparent' : c.primarySoft,
        borderRadius: L.radius,
        borderTopWidth: bare ? L.hairline : 0,
        borderTopColor: c.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[{ fontSize: theme.type.bodySize + 0.5, color: c.ink }, bodyFont(theme, 700)]}>다음 · 직업 이름</Text>
        <Text style={[{ fontSize: theme.type.bodySize - 1.5, color: c.muted, marginTop: 2 }, bodyFont(theme)]}>단어 5개</Text>
      </View>
      <Image source={{ uri: icon('chevron', c.primaryDark, 15, 1.8) }} style={{ width: 15, height: 15 }} />
    </View>
  );
}

function Cta({ theme }: { theme: Theme }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const r = buttonRadius(L.button, L.radius);
  const h = L.density === 'open' ? 52 : 48;

  const deco: ViewStyle =
    L.button === 'outline'
      ? { borderWidth: Math.max(1.2, L.hairline), borderColor: c.primary }
      : L.button === 'text'
      ? {}
      : L.button === 'block'
      ? { backgroundColor: c.primary, borderBottomWidth: 4, borderBottomColor: c.primaryDark }
      : { backgroundColor: c.primary, ...(shadowFor(L.shadow, c.primary) as ViewStyle) };
  const fg = L.button === 'outline' || L.button === 'text' ? c.primaryDark : c.onPrimary;

  return (
    <>
      <View style={[{ height: h, borderRadius: r, alignItems: 'center', justifyContent: 'center' }, deco]}>
        <Text style={[{ fontSize: theme.type.bodySize + 1, color: fg }, bodyFont(theme, 700)]}>이어서 학습하기</Text>
      </View>
      <View style={{ alignItems: 'center', paddingTop: s.gap }}>
        <Text style={[{ fontSize: theme.type.bodySize - 1.5, color: c.muted }, bodyFont(theme, 500)]}>오늘은 여기까지</Text>
      </View>
    </>
  );
}
