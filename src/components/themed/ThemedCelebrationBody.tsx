// 완료(축하) 화면의 테마 구조 렌더 — 실화면 공용.
//
// SetCompleteStage · CompletionCelebration* 5개 화면이 테마 ON 일 때 이 바디로 그린다.
// 원본 화면이 상태·핸들러·음원을 계속 소유하고, 여기는 표시만 맡는다 (5-2 패턴).
//
// 구조(structure)마다 화면 구성이 다르고, 축하의 얼굴(캐릭터/실사/마크/점수)과
// 폭죽 연출 세기도 테마마다 다르다 — 규칙은 갤러리 목업과 같은 것을 쓴다.
// 튜터 아바타는 원본 화면이 원본 스타일 그대로 넘겨준다(tutor prop) — 여기서 변형하지 않는다.
import { useState, useEffect, useRef, type ReactNode } from 'react';

// 세트 완료 도트의 체크 — 사용자 지정 레드 브러시 체크박스
const CHECK_RED = require('../../../assets/themes/malhaeboka/icon-check-red.png');
import { BlinkSprite } from '../../theme/BlinkSprite';
import { View, Text, Image, StyleSheet, ScrollView, type ViewStyle, type LayoutChangeEvent } from 'react-native';
import {
  type Theme,
  coverPhoto,
  spacing,
  displayFont,
  bodyFont,
  readableOn,
  luminance,
} from '../../theme/themeTypes';
import { scrimUri, markUri, ringUri } from '../../theme/graphics';
import { THEMES } from '../../theme/themes';
import { CanvasFireworks } from '../preview/CanvasFireworks';
import {
  artOf,
  festivity,
  boxStyle,
  mockBandH,
  LEARN_PICKS,
  LEARN_FALLBACK,
  BAND_PICKS,
  type Art,
  type PhotoPick,
} from '../preview/ThemedCelebrationMock';
import { nativeThemeAttr } from '../../theme/themedControls';
import { themeAssets } from '../../theme/themeAssets';
import { ActivityHeader } from '../ActivityHeader';
import { CtaButton } from '../CtaButton';
import { pick, type Lang } from '../LangContext';

const CHARACTER = require('../../../assets/character-kchao.png');

interface Props {
  theme: Theme;
  lang: Lang;
  /** 헤더 진행 퍼센트 */
  progressPct: number;
  onBack: () => void;
  onNext?: () => void;
  titleKo: string;
  titleVi: string;
  descKo?: string;
  descVi?: string;
  /** 하단 안내 한 줄 (예: "다음 단어로 넘어가세요.") */
  noteKo?: string;
  noteVi?: string;
  ctaKo: string;
  ctaVi: string;
  /** 있으면 세트 진행 기록을 구조별로 그린다 (실데이터) */
  setNumber?: number;
  totalSets?: number;
  /** 튜터 아바타 — 원본 화면이 원본 스타일 그대로 넘긴다. 여기서는 배치만 한다 */
  tutor?: ReactNode;
}

export function ThemedCelebrationBody({
  theme, lang, progressPct, onBack, onNext,
  titleKo, titleVi, descKo, descVi, noteKo, noteVi, ctaKo, ctaVi,
  setNumber, totalSets, tutor,
}: Props) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const st = L.structure;
  const art = artOf(theme);
  const mood = festivity(theme);
  // 브랜드 자산 테마: 축하 얼굴을 실캐릭터로 (세트 완료는 대체 캐릭터)
  const asset = themeAssets(theme.id);
  const charImg = asset ? asset.character : undefined;
  // 세트 완료(33~35)는 브랜드 테마에서 캐릭터를 두지 않는다 (사용자 확정: 폭죽·타이틀만)
  const hideArt = !!asset && setNumber != null;
  const photoTop = art.kind === 'photo' || st === 'hero-list';
  // 완료 화면마다 폭죽이 달라야 한다 — 테마 인덱스에 화면 제목 해시를 섞어
  // 터짐 종류(variant)·세기·색 배열이 화면별로 갈린다
  let titleHash = 0;
  for (let i = 0; i < titleKo.length; i++) titleHash = (titleHash * 31 + titleKo.charCodeAt(i)) >>> 0;
  const variant = Math.max(0, THEMES.findIndex((x) => x.id === theme.id)) + (titleHash % 9);
  const learnPicks = LEARN_PICKS[theme.id] ?? LEARN_FALLBACK;
  const bandPick = BAND_PICKS[theme.id] ?? { t: learnPicks[0].t, l: theme.photo.lock + 3 };

  // 실기기 폭은 디바이스 프레임마다 다르다 — 밴드를 실측해서 폭죽 캔버스를 맞춘다
  const [band, setBand] = useState<{ w: number; h: number } | null>(null);
  const onBandLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0 && (!band || Math.abs(band.w - width) > 2 || Math.abs(band.h - height) > 2)) {
      setBand({ w: Math.round(width), h: Math.round(height) });
    }
  };

  const bandBg = photoTop ? 'transparent' : mood === 'quiet' ? c.canvas : c.primary;
  const onBand = photoTop ? '#ffffff' : mood === 'quiet' ? c.ink : c.onPrimary;
  const subOnBand = photoTop ? 'rgba(255,255,255,0.86)' : mood === 'quiet' ? c.muted : readableOn(c.primary, [c.onPrimary, '#ffffff']);
  const bright = !photoTop && luminance(bandBg) > 0.4;

  const title = pick(lang, titleKo, titleVi);
  const titleOther = pick(lang, titleVi, titleKo);
  const desc = descKo ? pick(lang, descKo, descVi ?? descKo) : undefined;
  const note = noteKo ? pick(lang, noteKo, noteVi ?? noteKo) : undefined;

  const fireworks = band ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <CanvasFireworks
        width={band.w}
        height={band.h}
        variant={variant}
        power={(mood === 'loud' ? 1 : mood === 'warm' ? 0.82 : 0.6) + (titleHash % 3) * 0.07}
        blend={bright || st === 'grid' ? 'normal' : 'add'}
        colors={
          bright || st === 'grid'
            ? [[c.accent, c.primaryDark, c.ink], [c.primaryDark, c.accent, '#FFD644'], [c.accent, '#23D96C', c.primaryDark]][titleHash % 3]
            : [['#ffffff', c.accent, c.primarySoft], ['#ffffff', '#FFD644', c.accent], ['#ffffff', c.primarySoft, '#7EE2A8']][titleHash % 3]
        }
      />
    </View>
  ) : null;

  const bandH =
    st === 'hero-list' ? 0.42 :
    st === 'stat-list' ? 0.3 :
    st === 'plain-list' ? 0.24 :
    st === 'tabs-list' ? 0.26 :
    0.36; // focus-list

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }} {...nativeThemeAttr}>
      <ActivityHeader percentage={progressPct} onClose={onBack} />

      {/* ── 상단 밴드 ── */}
      {st === 'grid' ? (
        <View onLayout={onBandLayout} style={{ paddingTop: 26, paddingHorizontal: L.edge, alignItems: 'center' }}>
          {fireworks}
          {hideArt ? null : <ArtPiece theme={theme} art={art} size={96} charImg={charImg} />}
          <View style={{ height: s.row }} />
          <TitleText theme={theme} color={c.ink} text={title} />
          <SubText theme={theme} color={c.muted} text={titleOther} />
        </View>
      ) : (
        <View
          onLayout={onBandLayout}
          style={{
            flexBasis: 0,
            flexGrow: bandH * 10,
            minHeight: theme.id === 'malhaeboka' ? 146 : 150, // 말해보카: 상하 2px씩 타이트하게
            backgroundColor: bandBg,
            overflow: 'hidden',
            borderBottomWidth: mood === 'quiet' && !photoTop ? L.hairline : 0,
            borderBottomColor: c.line,
            borderBottomLeftRadius: st === 'tabs-list' ? L.radius * 1.6 : 0,
            borderBottomRightRadius: st === 'tabs-list' ? L.radius * 1.6 : 0,
          }}
        >
          {photoTop && band && (
            <>
              <Image source={{ uri: coverPhoto(bandPick.t, 390, mockBandH(st), bandPick.l) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <Image source={{ uri: scrimUri(c.ink, 0.16, 0.86) }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
            </>
          )}
          {fireworks}

          {st === 'plain-list' ? (
            <View style={{ flex: 1, paddingHorizontal: L.edge, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.row }}>
                {hideArt ? null : <ArtPiece theme={theme} art={art} size={56} charImg={charImg} />}
                <View style={{ flex: 1 }}>
                  <TitleText theme={theme} color={onBand} text={title} size={0.82} align="left" />
                  <SubText theme={theme} color={subOnBand} text={titleOther} align="left" />
                </View>
              </View>
            </View>
          ) : st === 'tabs-list' ? (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: L.edge, gap: s.row }}>
              <View style={{ flex: 1 }}>
                <TitleText theme={theme} color={onBand} text={title} size={0.86} align="left" />
                <SubText theme={theme} color={subOnBand} text={titleOther} align="left" />
              </View>
              {hideArt ? null : <ArtPiece theme={theme} art={art} size={76} charImg={charImg} />}
            </View>
          ) : st === 'hero-list' ? (
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: L.edge, paddingBottom: s.row }}>
              <TitleText theme={theme} color="#ffffff" text={title} align="left" />
              <SubText theme={theme} color="rgba(255,255,255,0.86)" text={titleOther} align="left" />
            </View>
          ) : st === 'stat-list' ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: L.edge }}>
              {hideArt ? null : <ArtPiece theme={theme} art={art} size={72} charImg={charImg} />}
              <View style={{ height: s.gap }} />
              <TitleText theme={theme} color={onBand} text={title} size={0.78} />
            </View>
          ) : (
            // focus-list — 중앙에 크게
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: L.edge }}>
              {hideArt ? null : <ArtPiece theme={theme} art={art} size={96} charImg={charImg} />}
              <View style={{ height: s.row }} />
              <TitleText theme={theme} color={onBand} text={title} />
              <SubText theme={theme} color={subOnBand} text={titleOther} />
            </View>
          )}
        </View>
      )}

      {/* ── 본문 ── */}
      <ScrollView
        style={{ flexBasis: 0, flexGrow: (1 - bandH) * 10 }}
        contentContainerStyle={{ paddingHorizontal: L.edge, paddingTop: s.block, paddingBottom: s.block, gap: s.block }}
        showsVerticalScrollIndicator={false}
      >
        {desc ? (
          <Text
            style={[
              { fontSize: theme.type.bodySize + 1, color: c.textSecondary, textAlign: st === 'plain-list' ? 'left' : 'center', lineHeight: Math.round((theme.type.bodySize + 1) * theme.type.bodyLine) },
              bodyFont(theme),
            ]}
          >
            {desc}
          </Text>
        ) : null}

        {setNumber != null && totalSets != null ? (
          <SetTrack theme={theme} lang={lang} setNumber={setNumber} totalSets={totalSets} />
        ) : null}

        {tutor ? <View style={{ alignItems: 'center' }}>{tutor}</View> : null}

        {st !== 'grid' && !tutor ? <LearnStripReal theme={theme} lang={lang} picks={learnPicks} /> : null}

        {note ? (
          <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.muted, textAlign: 'center' }, bodyFont(theme)]}>
            {note}
          </Text>
        ) : null}
      </ScrollView>

      {/* ── 하단 CTA — 실동작 버튼 ── */}
      <View style={{ paddingHorizontal: L.edge, paddingTop: Math.min(s.gap, 10), paddingBottom: asset ? 1 : s.row + 6 }}>
        <CtaButton title={pick(lang, ctaKo, ctaVi)} onPress={onNext} size="lg" />
      </View>
    </View>
  );
}

// ─── 축하의 얼굴 (목업과 같은 규칙, 실화면용) ─────────────────────
function ArtPiece({ theme, art, size, charImg }: { theme: Theme; art: Art; size: number; charImg?: any }) {
  const c = theme.colors;
  const L = theme.layout;

  if (art.kind === 'character') {
    const mbMent = theme.id === 'malhaeboka';
    return (
      <View style={{ alignItems: 'center', gap: 7 }}>
        {mbMent ? (
          <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: '#E5DFF7', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 7, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: c.ink }}>참 잘했어요! 오늘도 해냈어요</Text>
          </View>
        ) : null}
        <View style={{ borderRadius: L.radius === 0 ? 0 : Math.max(L.radius, 20), overflow: 'hidden', borderWidth: L.list === 'block' ? 2 : 0, borderColor: c.ink }}>
          <BlinkImage theme={theme} img={charImg ?? CHARACTER} size={size} />
        </View>
      </View>
    );
  }
  if (art.kind === 'photo') return null; // 배경이 이미 실사
  if (art.kind === 'score') {
    // 실화면엔 점수 데이터가 없다 — 링 마크로 대신한다
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={{ uri: ringUri(c.line, c.primary, 1, 2.6) }} style={{ width: size, height: size, position: 'absolute' }} />
        <Text style={[{ fontSize: Math.round(size * 0.4), color: c.ink }, displayFont(theme)]}>✓</Text>
      </View>
    );
  }
  return <Image source={{ uri: markUri(art.mark ?? 'check-circle', c.primary, c.accent, size) }} style={{ width: size, height: size }} />;
}

/** 캐릭터 깜빡임 — 감은 눈 프레임이 있으면 2.4~3.4초마다 130ms 교차 */
function BlinkImage({ theme, img, size }: { theme: Theme; img: any; size: number }) {
  const blinkFrame = themeAssets(theme.id)?.characterBlink;
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!blinkFrame) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!alive) return;
      t = setTimeout(() => {
        if (!alive) return;
        setClosed(true);
        t = setTimeout(() => { if (alive) { setClosed(false); tick(); } }, 130);
      }, 2400 + Math.random() * 1000);
    };
    tick();
    return () => { alive = false; clearTimeout(t); };
  }, [blinkFrame]);
  return <BlinkSprite img={img} blink={blinkFrame} on={closed} w={size} h={size} resizeMode="cover" />;
}

function TitleText({ theme, color, text, size = 1, align = 'center' }: { theme: Theme; color: string; text: string; size?: number; align?: 'left' | 'center' }) {
  const fz = Math.round(theme.type.displaySize * 0.94 * size);
  return (
    <Text
      style={[
        { fontSize: fz, color, letterSpacing: theme.type.displayTracking, lineHeight: Math.round(fz * theme.type.displayLine), textAlign: align },
        // 한국어 제목이 단어 중간에서 꺾이지 않게 (웹 전용 CSS)
        { wordBreak: 'keep-all' } as any,
        displayFont(theme),
      ]}
    >
      {text}
    </Text>
  );
}

function SubText({ theme, color, text, align = 'center' }: { theme: Theme; color: string; text: string; align?: 'left' | 'center' }) {
  return (
    <Text style={[{ fontSize: theme.type.bodySize, color, marginTop: 5, textAlign: align, lineHeight: Math.round(theme.type.bodySize * theme.type.bodyLine) }, bodyFont(theme)]}>
      {text}
    </Text>
  );
}

// ─── 세트 진행 기록 — 구조별 6꼴, 전부 실데이터 ───────────────────
function SetTrack({ theme, lang, setNumber, totalSets }: { theme: Theme; lang: Lang; setNumber: number; totalSets: number }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const st = L.structure;
  const sets = Array.from({ length: totalSets }, (_, i) => i + 1);
  const done = (n: number) => n <= setNumber;
  const label = (n: number) => pick(lang, `세트 ${n}`, `Set ${n}`);
  const stateText = (n: number) => (done(n) ? pick(lang, '완료', 'Xong') : pick(lang, '예정', 'Sắp tới'));

  if (st === 'plain-list') {
    return (
      <View>
        {sets.map((n, i) => (
          <View
            key={n}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingVertical: s.row,
              borderBottomWidth: i === sets.length - 1 ? 0 : L.hairline,
              borderBottomColor: c.line,
            }}
          >
            <Text style={[{ fontSize: theme.type.bodySize, color: c.textSecondary }, bodyFont(theme)]}>{label(n)}</Text>
            <Text style={[{ fontSize: theme.type.bodySize, color: done(n) ? c.success : c.muted }, bodyFont(theme, 700)]}>
              {done(n) ? '✓ ' : ''}{stateText(n)}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (st === 'tabs-list') {
    const pct = setNumber / totalSets;
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.textSecondary }, bodyFont(theme, 600)]}>
            {pick(lang, '세트 진행', 'Tiến độ set')}
          </Text>
          <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.ink }, bodyFont(theme, 700)]}>{setNumber} / {totalSets}</Text>
        </View>
        <View style={{ height: 8, backgroundColor: c.line, borderRadius: L.radius === 0 ? 0 : 999, overflow: 'hidden' }}>
          <View style={{ width: `${pct * 100}%`, height: 8, backgroundColor: c.primary, borderRadius: L.radius === 0 ? 0 : 999 }} />
        </View>
      </View>
    );
  }

  if (st === 'stat-list') {
    return (
      <View style={[{ overflow: 'hidden' }, boxStyle(theme) as ViewStyle]}>
        {sets.map((n, i) => (
          <View
            key={n}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingVertical: 9, paddingHorizontal: 12,
              borderBottomWidth: i === sets.length - 1 ? 0 : L.hairline,
              borderBottomColor: c.line,
              backgroundColor: i % 2 === 1 ? c.backdrop : 'transparent',
            }}
          >
            <Text style={[{ fontSize: theme.type.bodySize - 1, color: c.textSecondary }, bodyFont(theme)]}>{label(n)}</Text>
            <Text style={[{ fontSize: theme.type.bodySize, color: done(n) ? c.success : c.muted }, bodyFont(theme, 700)]}>
              {done(n) ? '✓' : '·'}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (st === 'hero-list') {
    return (
      <View style={{ borderRadius: L.radius, backgroundColor: c.primarySoft, paddingVertical: 12, alignItems: 'center' }}>
        <Text style={[{ fontSize: theme.type.bodySize + 3, color: c.ink, letterSpacing: -0.3 }, bodyFont(theme, 700)]}>
          {setNumber} / {totalSets}
        </Text>
        <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 1 }, bodyFont(theme)]}>
          {pick(lang, '세트 완료', 'Set hoàn thành')}
        </Text>
      </View>
    );
  }

  if (st === 'grid') {
    return (
      <View style={{ flexDirection: 'row', gap: s.gap }}>
        {sets.map((n) => (
          <View key={n} style={[{ flex: 1, paddingVertical: s.row, alignItems: 'center' }, boxStyle(theme) as ViewStyle]}>
            <Text style={[{ fontSize: theme.type.bodySize + 5, color: done(n) ? c.ink : c.muted }, displayFont(theme)]}>
              {done(n) ? '✓' : n}
            </Text>
            <Text style={[{ fontSize: theme.type.bodySize - 3, color: c.muted, marginTop: 2 }, bodyFont(theme)]}>{label(n)}</Text>
          </View>
        ))}
      </View>
    );
  }

  // focus-list — 세트 원 나열
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: s.row }}>
      {sets.map((n) => (
        <View
          key={n}
          style={{
            width: 44, height: 44,
            borderRadius: L.radius === 0 ? 4 : 999,
            backgroundColor: done(n) ? (theme.id === 'malhaeboka' ? c.surface : c.primary) : c.backdrop,
            borderWidth: done(n) ? (theme.id === 'malhaeboka' ? 1.5 : 0) : L.hairline,
            borderColor: theme.id === 'malhaeboka' && done(n) ? '#E5DFF7' : c.line,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {theme.id === 'malhaeboka' && done(n) ? (
            <Image source={CHECK_RED} style={{ width: 26, height: 26 }} resizeMode="contain" />
          ) : (
            <Text style={[{ fontSize: theme.type.bodySize + 1, color: done(n) ? c.onPrimary : c.muted }, bodyFont(theme, 700)]}>
              {done(n) ? '✓' : n}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

/** 오늘 공부한 흔적 — 학습 장면 실사 3장 (목업과 같은 검증된 태그·lock) */
function LearnStripReal({ theme, lang, picks }: { theme: Theme; lang: Lang; picks: PhotoPick[] }) {
  const c = theme.colors;
  const L = theme.layout;
  const s = spacing(L.density);
  const h = 66; // ⚠️ 요청 URL 치수 — 바꾸면 검증된 사진이 뒤바뀐다 (표시 크기는 아래 dispH)
  const dispH = theme.id === 'malhaeboka' ? 126 : 104; // 표시 높이 — 시원하게 (원본이 2배 해상도라 확대 여유 있음)
  return (
    <View>
      <Text style={[{ fontSize: 10.5, color: c.muted, letterSpacing: theme.type.labelTracking, marginBottom: s.gap }, bodyFont(theme, 700)]}>
        {pick(lang, '오늘의 학습', 'Bài học hôm nay')}
      </Text>
      <View style={{ flexDirection: 'row', gap: s.gap }}>
        {picks.map((p) => (
          <Image
            key={p.t + p.l}
            source={{ uri: coverPhoto(p.t, 200, h, p.l) }}
            style={{ flex: 1, height: dispH, borderRadius: L.radius === 0 ? 0 : Math.min(L.radius, 14) }}
            resizeMode="cover"
          />
        ))}
      </View>
    </View>
  );
}
