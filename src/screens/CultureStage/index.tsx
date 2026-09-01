import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { colors } from '../../theme/colors';
import { MOCK_CULTURE_ACTIVITY, type CultureActivityData, type CultureSubItem } from '../../data/lessonData';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';

// ─── Props — Source A ActivityLayout 이식 기준 네이밍 ────────────────
// 이식 시: onPressConfirm → ActivityLayout.onPressConfirm
//          onClose       → ActivityLayout.onClose
interface CultureStageProps {
  onPressConfirm: () => void;
  onClose: () => void;
  data?: CultureActivityData;
}

// ─── 히어로 미디어 (이미지 / 영상 / 플레이스홀더) ─────────────────────
// source: require() 로컬 에셋 또는 { uri } 원격 URL 모두 지원
// 이식 시: source를 ADMIN API 응답의 파일 URL({ uri })로 교체
//          영상은 Platform.OS === 'web' 분기 후 React.createElement('video') 사용
function HeroMedia({ heroMedia }: { heroMedia: CultureActivityData['heroMedia'] }) {
  if (!heroMedia) return null;

  const imageSource = heroMedia.source ?? (heroMedia.uri ? { uri: heroMedia.uri } : null);

  if (imageSource) {
    if (heroMedia.type === 'video') {
      return (
        <View style={hero.wrap}>
          <Image source={imageSource} style={hero.fill} resizeMode="cover" />
          <View style={hero.playOverlay}>
            <ThemedGlyph style={hero.playIcon} glyph="▶" />
          </View>
        </View>
      );
    }
    // 가로 100% 기준, cover로 흰 여백 제거
    return <Image source={imageSource} style={hero.image} resizeMode="cover" />;
  }

  // 소스 미등록 시 플레이스홀더 (lang prop 불필요 — HeroMedia는 순수 UI)
  // 플레이스홀더 텍스트는 Korean-only로 유지 (ADMIN 콘텐츠 등록 전 개발용)
  return (
    <View style={hero.placeholder}>
      <ThemedGlyph style={hero.placeholderIcon} glyph={heroMedia.type === 'video' ? '🎬' : '🖼️'} />
      <Text style={hero.placeholderText}>
        {heroMedia.type === 'video' ? '영상' : '이미지'} 준비 중
      </Text>
    </View>
  );
}

const hero = StyleSheet.create({
  wrap: { position: 'relative', width: '100%' },
  fill: { width: '100%', height: '100%', borderRadius: 12 },
  image: { width: '100%', aspectRatio: 16 / 7, borderRadius: 12 },
  placeholder: {
    width: '100%', aspectRatio: 16 / 9, borderRadius: 12,
    backgroundColor: '#E8EDF2', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  placeholderIcon: { fontSize: 36 },
  placeholderText: { fontSize: 13, color: colors.muted },
  playOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12,
  },
  playIcon: { fontSize: 40, color: '#fff' },
});

// ─── 세부 항목 (교재 번호별) ──────────────────────────────────────────
function SubItemCard({ item, lang }: { item: CultureSubItem; lang: string }) {
  return (
    <View style={sub.wrap}>
      <View style={sub.numBadge}>
        <Text style={sub.numText}>{item.no}</Text>
      </View>
      <View style={sub.body}>
        <Text style={sub.title}>{pick(lang, item.title, item.titleVi ?? item.title)}</Text>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={sub.image} resizeMode="cover" />
        )}
        <Text style={sub.desc}>{pick(lang, item.description, item.descriptionVi ?? item.description)}</Text>
      </View>
    </View>
  );
}

const sub = StyleSheet.create({
  wrap: {
    flexDirection: 'row', gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  numBadge: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
    marginTop: 2, flexShrink: 0,
  },
  numText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  body: { flex: 1, gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: colors.ink },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 8 },
  desc: { fontSize: 13, color: colors.ink, lineHeight: 20 },
});

// ─── 콘텐츠 카드 ─────────────────────────────────────────────────────
function ContentCard({ item, lang }: { item: CultureActivityData['contents'][number]; lang: string }) {
  return (
    <View style={cc.wrap}>
      {/* [questionContent] — Source A: questionContent 슬롯에 해당 */}
      <View style={cc.titleRow}>
        {item.icon && <ThemedGlyph style={cc.icon} glyph={item.icon} />}
        <Text style={cc.title}>{pick(lang, item.title, item.titleVi ?? item.title)}</Text>
      </View>
      <Text style={cc.description}>{pick(lang, item.description, item.descriptionVi ?? item.description)}</Text>
      {/* [/questionContent] */}

      {/* [answerContent] — 세부 항목 목록 */}
      {item.subItems && item.subItems.length > 0 && (
        <View style={cc.subList}>
          {item.subItems.map((sub) => (
            <SubItemCard key={sub.no} item={sub} lang={lang} />
          ))}
        </View>
      )}
      {/* [/answerContent] */}
    </View>
  );
}

const cc = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 16, gap: 8,
    borderWidth: 1, borderColor: colors.line,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  icon: { fontSize: 18 },
  title: { fontSize: 15, fontWeight: '700', color: colors.teal, flex: 1 },
  description: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  subList: { marginTop: 4 },
});

// ─── 메인 화면 ────────────────────────────────────────────────────────
// 이식 가이드:
//   1. <View style={s.root}> → <ActivityLayout ...> 로 교체
//   2. ActivityHeader → ActivityLayout showCloseButton=true, showBackButton=false
//   3. 전체가 단일 scrollable 콘텐츠 (questionContent 슬롯)
//   4. 하단 버튼 → ActivityLayout bottomContent 또는 showConfirmButton
//   5. heroMedia.uri → ADMIN API 응답의 파일 URL로 교체
export function CultureStage({
  onPressConfirm,
  onClose,
  data = MOCK_CULTURE_ACTIVITY,
}: CultureStageProps) {
  const { lang } = useLang();
  const [read, setRead] = useState(false);

  return (
    <View style={s.root}>

      {/* ── ActivityHeader (프로그레스바 + X버튼) ── */}
      {/* 이식 시: ActivityLayout showCloseButton=true, useLessonQuestionProgress=false */}
      <ActivityHeader percentage={read ? 100 : 0} onClose={onClose} />

      {/* ── [questionContent] 본문 스크롤 영역 ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={() => setRead(true)}
        onScrollEndDrag={() => setRead(true)}
        scrollEventThrottle={200}
      >
        {/* 화면 제목 */}
        <Text style={s.title}>{pick(lang, data.title, data.titleVi ?? data.title)}</Text>

        {/* 히어로 미디어 */}
        {data.heroMedia && (
          <View style={s.heroWrap}>
            <HeroMedia heroMedia={data.heroMedia} />
          </View>
        )}

        {/* 콘텐츠 카드 목록 */}
        <View style={s.contentList}>
          {data.contents.map((item) => (
            <ContentCard key={item.activityQuestionNo} item={item} lang={lang} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      {/* ── [/questionContent] ── */}

      {/* ── [bottomContent] 하단 확인 버튼 ── */}
      {/* 이식 시: ActivityLayout confirmDisabled={!read} onPressConfirm={onPressConfirm} */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.confirmBtn, !read && s.confirmBtnDisabled]}
          onPress={read ? onPressConfirm : undefined}
          activeOpacity={read ? 0.8 : 1}
        >
          <Text style={[s.confirmBtnText, !read && s.confirmBtnTextDisabled]}>
            {pick(lang, '다음', '다음')} →
          </Text>
        </TouchableOpacity>
      </View>
      {/* ── [/bottomContent] ── */}

    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },

  title: { fontSize: 24, fontWeight: '800', color: colors.ink },

  heroWrap: { borderRadius: 12, overflow: 'hidden' },

  contentList: { gap: 12 },

  footer: {
    padding: 16, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  confirmBtn: {
    backgroundColor: colors.teal, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: colors.line },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  confirmBtnTextDisabled: { color: colors.muted },
});
