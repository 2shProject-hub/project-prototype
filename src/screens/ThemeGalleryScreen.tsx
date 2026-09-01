// 디자인 테마 갤러리 — 21종을 실제 학습화면 목업으로 비교하고 고른다.
// 좌: 썸네일 그리드 / 우: 선택 테마 상세(원본 크기 미리보기 + 레퍼런스 + 팔레트 + 서체 + 형태 토큰)
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useMemo, useState } from 'react';
import { ThemedMockScreen } from '../components/preview/ThemedMockScreen';
import { ThemedCelebrationMock } from '../components/preview/ThemedCelebrationMock';
import { ThemedWordbookScreen } from '../components/preview/ThemedWordbookScreen';
import { useTheme } from '../theme/ThemeContext';
import { contrast, displayFont, bodyFont, type Theme } from '../theme/themeTypes';
import { icon } from '../theme/graphics';
import { colors as base } from '../theme/colors';

const MOCK_W = 390;
const MOCK_H = 844;
const DOCK_W = 462;

/** 미리보기 화면 3종 — 실제 앱 화면 / 재해석 목업 / 완료 화면 */
type PreviewKind = 'real' | 'lesson' | 'done';
const PREVIEWS: [PreviewKind, string][] = [
  ['real', '5-2 단어장'],
  ['lesson', '단어장 재해석'],
  ['done', '완료'],
];

function a11yOf(theme: Theme) {
  const c = theme.colors;
  const checks = [
    { k: 'ink / surface', v: contrast(c.ink, c.surface), min: 7 },
    { k: 'muted / surface', v: contrast(c.muted, c.surface), min: 4.5 },
    { k: 'onPrimary / primary', v: contrast(c.onPrimary, c.primary), min: 4.5 },
    { k: 'line / surface', v: contrast(c.line, c.surface), min: 1.35 },
  ];
  return { pass: checks.every((x) => x.v >= x.min), fail: checks.filter((x) => x.v < x.min), checks };
}

function ScaledMock({ theme, scale, kind }: { theme: Theme; scale: number; kind: PreviewKind }) {
  const w = MOCK_W * scale;
  const h = MOCK_H * scale;
  return (
    <View style={{ width: w, height: h, overflow: 'hidden', borderRadius: Math.max(6, 18 * scale), backgroundColor: theme.colors.canvas }}>
      <View style={{ position: 'absolute', left: -(MOCK_W - w) / 2, top: -(MOCK_H - h) / 2, transform: [{ scale }] }}>
        {kind === 'real' ? (
          <ThemedWordbookScreen theme={theme} width={MOCK_W} height={MOCK_H} />
        ) : kind === 'lesson' ? (
          <ThemedMockScreen theme={theme} width={MOCK_W} height={MOCK_H} />
        ) : (
          <ThemedCelebrationMock theme={theme} width={MOCK_W} height={MOCK_H} live={false} />
        )}
      </View>
    </View>
  );
}

export function ThemeGalleryScreen(_props: { onClose?: () => void }) {
  const { themes, themeId, setThemeId, theme: active } = useTheme();
  const [scale, setScale] = useState(0.42);
  const [kind, setKind] = useState<PreviewKind>('real');

  const list = useMemo(() => themes.map((t, i) => ({ t, no: i + 1 })), [themes]);
  const a11y = a11yOf(active);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#eceff0' }}>
      {/* ── 좌: 그리드 ── */}
      <View style={{ flex: 1 }}>
        <View style={g.head}>
          <View style={{ flex: 1 }}>
            <Text style={g.title}>디자인 테마 {themes.length}종</Text>
            <Text style={g.sub}>
              실제 학습앱 21종(듀오링고·칸아카데미·퀴즐렛·코세라·유데미·바벨·멤라이즈·부수·포토매스·브릴리언트·엘사·헬로톡·드롭스·링고디어·로제타스톤·아이토키·앙키·케이크·스픽·산타·말해보카)을 하나씩 참조했습니다.
              색뿐 아니라 <Text style={{ fontWeight: '700', color: base.ink }}>화면 구조·서체·여백·형태</Text>가 함께 바뀝니다.
              구조는 6종(초점형·균일목록·격자·탭·히어로·통계)으로 갈립니다. 지면은 전부 밝고, 사진은 실사입니다.
            </Text>
          </View>
          <View style={{ gap: 6, alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {PREVIEWS.map(([k, label]) => (
                <TouchableOpacity key={k} style={[g.miniBtn, kind === k && g.miniBtnOn]} onPress={() => setKind(k)}>
                  <Text style={[g.miniBtnText, kind === k && g.miniBtnTextOn]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {[0.34, 0.42, 0.56].map((s) => (
                <TouchableOpacity key={s} style={[g.miniBtn, scale === s && g.miniBtnOn]} onPress={() => setScale(s)}>
                  <Text style={[g.miniBtnText, scale === s && g.miniBtnTextOn]}>{Math.round(s * 100)}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={g.grid}>
          {list.map(({ t, no }) => {
            const sel = t.id === themeId;
            return (
              <TouchableOpacity
                key={t.id}
                style={[g.card, { width: MOCK_W * scale + 22 }, sel && g.cardActive]}
                activeOpacity={0.85}
                onPress={() => setThemeId(t.id)}
              >
                <View style={g.cardHead}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={g.cardName} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={g.cardRef} numberOfLines={1}>
                      {String(no).padStart(2, '0')} · {t.nameEn}
                    </Text>
                  </View>
                  {sel && <View style={g.selDot} />}
                </View>

                <View style={{ marginTop: 7, alignItems: 'center' }}>
                  <ScaledMock theme={t} scale={scale} kind={kind} />
                </View>

                <View style={{ flexDirection: 'row', gap: 0, marginTop: 8, borderRadius: 3, overflow: 'hidden' }}>
                  {[t.colors.canvas, t.colors.surface, t.colors.line, t.colors.primary, t.colors.primaryDark, t.colors.accent, t.colors.ink].map(
                    (v, i) => (
                      <View key={i} style={{ flex: 1, height: 12, backgroundColor: v }} />
                    )
                  )}
                </View>
                <Text style={g.cardType} numberOfLines={1}>
                  {t.layout.structure} · {t.type.display}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 우: 상세 ── */}
      <View style={[g.dock, { width: DOCK_W }]}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={g.dockName}>{active.name}</Text>
          <Text style={g.dockNameEn}>{active.nameEn}</Text>
          <Text style={g.dockRef}>{active.reference}</Text>
          <Text style={g.dockIdea}>{active.idea}</Text>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: 13 }}>
            {PREVIEWS.map(([k, label]) => (
              <TouchableOpacity key={k} style={[g.segBtn, kind === k && g.segBtnOn]} onPress={() => setKind(k)}>
                <Text style={[g.segText, kind === k && g.segTextOn]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ alignItems: 'center', marginTop: 14 }}>
            <View style={g.phone}>
              {kind === 'real' ? (
                <ThemedWordbookScreen theme={active} width={MOCK_W} height={MOCK_H} />
              ) : kind === 'lesson' ? (
                <ThemedMockScreen theme={active} width={MOCK_W} height={MOCK_H} />
              ) : (
                <ThemedCelebrationMock theme={active} width={MOCK_W} height={MOCK_H} />
              )}
            </View>
          </View>

          {/* 서체 실제 렌더 샘플 */}
          <Text style={g.secTitle}>서체</Text>
          <View style={g.typeBox}>
            <Text style={[{ fontSize: 26, color: active.colors.ink, letterSpacing: active.type.displayTracking }, displayFont(active)]}>
              나라 이름
            </Text>
            <Text style={[{ fontSize: 13, color: active.colors.textSecondary, marginTop: 5 }, bodyFont(active)]}>
              저는 베트남 사람이에요. Tôi là người Việt Nam.
            </Text>
            <View style={{ height: 9 }} />
            <Text style={g.typeMeta}>
              제목 {active.type.display} {active.type.displayWeight} · {active.type.displaySize}px · 자간 {active.type.displayTracking}
            </Text>
            <Text style={g.typeMeta}>
              본문 {active.type.body} {active.type.bodyWeight} · {active.type.bodySize}px · 행간 {active.type.bodyLine}
            </Text>
            <Text style={g.typeMeta}>크기 대비 {(active.type.displaySize / active.type.bodySize).toFixed(1)}배</Text>
          </View>

          <Text style={g.secTitle}>팔레트</Text>
          <View style={g.paletteWrap}>
            {(
              [
                ['canvas', active.colors.canvas],
                ['surface', active.colors.surface],
                ['line', active.colors.line],
                ['ink', active.colors.ink],
                ['textSecondary', active.colors.textSecondary],
                ['muted', active.colors.muted],
                ['primary', active.colors.primary],
                ['primaryDark', active.colors.primaryDark],
                ['primarySoft', active.colors.primarySoft],
                ['onPrimary', active.colors.onPrimary],
                ['accent', active.colors.accent],
                ['success', active.colors.success],
                ['warning', active.colors.warning],
                ['danger', active.colors.danger],
              ] as [string, string][]
            ).map(([k, v]) => (
              <View key={k} style={g.swatchCell}>
                <View style={[g.swatchBox, { backgroundColor: v }]} />
                <Text style={g.swatchKey} numberOfLines={1}>
                  {k}
                </Text>
                <Text style={g.swatchHex}>{String(v).toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <Text style={g.secTitle}>형태</Text>
          <View style={g.tokenWrap}>
            {(
              [
                ['화면 구조', active.layout.structure],
                ['헤더', active.layout.header],
                ['목록', active.layout.list],
                ['버튼', active.layout.button],
                ['진행 표시', active.layout.progress],
                ['사진', active.layout.photo],
                ['밀도', active.layout.density],
                ['모서리', `${active.layout.radius}px`],
                ['선 두께', `${active.layout.hairline}px`],
                ['그림자', active.layout.shadow],
                ['좌우 여백', `${active.layout.edge}px`],
              ] as [string, string][]
            ).map(([k, v]) => (
              <View key={k} style={g.tokenRow}>
                <Text style={g.tokenKey}>{k}</Text>
                <Text style={g.tokenVal}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={g.secTitle}>명도 대비</Text>
          <View style={g.tokenWrap}>
            {a11y.checks.map((x) => (
              <View key={x.k} style={g.tokenRow}>
                <Text style={g.tokenKey}>{x.k}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[g.tokenVal, { color: x.v >= x.min ? '#1c7a4d' : '#c0392b' }]}>{x.v.toFixed(2)} : 1</Text>
                  <Image source={{ uri: icon('check', x.v >= x.min ? '#1c7a4d' : '#c0392b', 13, 2.4) }} style={{ width: 13, height: 13 }} />
                </View>
              </View>
            ))}
          </View>

          <Text style={g.secTitle}>하지 않는 것</Text>
          <Text style={g.avoid}>{active.avoid}</Text>

          <Text style={g.secTitle}>설계 근거</Text>
          <Text style={g.rationale}>{active.rationale}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: base.line,
  },
  title: { fontSize: 16.5, fontWeight: '800', color: base.ink, letterSpacing: -0.3 },
  sub: { fontSize: 11.5, color: base.muted, marginTop: 4, lineHeight: 17, maxWidth: 780 },
  miniBtn: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: base.line, backgroundColor: '#fafbfb' },
  miniBtnOn: { backgroundColor: base.ink, borderColor: base.ink },
  miniBtnText: { fontSize: 11, fontWeight: '700', color: base.muted },
  miniBtnTextOn: { color: '#ffffff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#e3e8e9' },
  cardActive: { borderColor: base.ink, borderWidth: 2, padding: 9 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardName: { fontSize: 13, fontWeight: '800', color: base.ink, letterSpacing: -0.2 },
  cardRef: { fontSize: 9.5, fontWeight: '600', color: base.muted, marginTop: 1 },
  cardType: { fontSize: 9.5, color: base.muted, marginTop: 6 },
  selDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: base.ink },

  dock: { backgroundColor: '#ffffff', borderLeftWidth: 1, borderLeftColor: base.line },
  dockName: { fontSize: 21, fontWeight: '900', color: base.ink, letterSpacing: -0.6 },
  dockNameEn: { fontSize: 12, fontWeight: '600', color: base.muted, marginTop: 1 },
  dockRef: { fontSize: 11.5, color: base.muted, marginTop: 9, lineHeight: 17 },
  dockIdea: { fontSize: 13, color: base.ink, marginTop: 8, lineHeight: 19, fontWeight: '600' },

  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 7, borderWidth: 1, borderColor: base.line, backgroundColor: '#fafbfb', alignItems: 'center' },
  segBtnOn: { backgroundColor: base.ink, borderColor: base.ink },
  segText: { fontSize: 12, fontWeight: '700', color: base.muted },
  segTextOn: { color: '#ffffff' },

  phone: {
    // RNW 는 border-box 라 테두리 두께를 더해야 목업이 잘리지 않는다
    width: MOCK_W + 12,
    height: MOCK_H + 12,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#1b2427',
    backgroundColor: '#1b2427',
    shadowColor: '#04303d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
  },

  secTitle: { fontSize: 10.5, fontWeight: '800', color: base.muted, letterSpacing: 1, marginTop: 22, marginBottom: 8 },
  typeBox: { borderWidth: 1, borderColor: base.line, borderRadius: 8, padding: 14 },
  typeMeta: { fontSize: 10, color: base.muted, marginTop: 2 },

  paletteWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  swatchCell: { width: 78 },
  swatchBox: { height: 28, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  swatchKey: { fontSize: 9, color: base.muted, marginTop: 3, fontWeight: '700' },
  swatchHex: { fontSize: 9, color: base.ink, fontWeight: '600' },

  tokenWrap: { borderWidth: 1, borderColor: base.line, borderRadius: 8, overflow: 'hidden' },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f5f5',
    gap: 10,
  },
  tokenKey: { fontSize: 11, color: base.muted, fontWeight: '700' },
  tokenVal: { fontSize: 11, color: base.ink, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  avoid: { fontSize: 12, color: '#a4472e', lineHeight: 18 },
  rationale: { fontSize: 12, color: base.textSecondary, lineHeight: 19 },
});
