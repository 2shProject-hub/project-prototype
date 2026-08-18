/**
 * 에뮬레이터 쉘 — 웹 전용 (Platform.OS === 'web')
 * 구성: 좌측 컨트롤 패널 | 중앙 디바이스 프레임 | 우측 정보 패널
 */
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { colors } from '../theme/colors';
import { LangProvider } from '../components/LangContext';
import { SCREEN_REGISTRY, getScreen } from './screenRegistry';

// 화면 컴포넌트 임포트
import { HomeScreen } from '../screens/HomeScreen';
import { MissionStage } from '../screens/MissionStage';
import { MissionTutorStage } from '../screens/MissionTutorStage';
import { MissionTutorPrevStage } from '../screens/MissionTutorPrevStage';
import { MissionTutorPrevViStage } from '../screens/MissionTutorPrevViStage';
import { BridgeStage } from '../screens/BridgeStage';
import { IntroStage } from '../screens/IntroStage';
import { IntroTutorStage } from '../screens/IntroTutorStage';
import { WordBuildStage } from '../screens/WordBuildStage';
import { SentenceBuildStage } from '../screens/SentenceBuildStage';
import { SentenceBuildStage2 } from '../screens/SentenceBuildStage2';
import { VocabWordbookStage } from '../screens/VocabWordbookStage';
import { VocabWordbookVoiceStage } from '../screens/VocabWordbookVoiceStage';
import { GrammarDetailStage } from '../screens/GrammarDetailStage';
import { QuickReviewStage } from '../screens/QuickReviewStage';
import { CultureStage } from '../screens/CultureStage';
import { WordDetailStage } from '../screens/WordDetailStage';
import { VideoBridgeStage } from '../screens/VideoBridgeStage';
import { defaultSessionState } from '../data/lessonData';
import { useLang, type Lang } from '../components/LangContext';

// ─── 디바이스 프리셋 ───────────────────────────────────────────────
const DEVICES = [
  { id: 'iphone15', label: 'iPhone 15', os: 'iOS', w: 390, h: 844 },
  { id: 'iphone-se', label: 'iPhone SE', os: 'iOS', w: 375, h: 667 },
  { id: 'android-std', label: 'Android 표준', os: 'AOS', w: 360, h: 800 },
  { id: 'android-budget', label: '보급형 Android', os: 'AOS', w: 360, h: 640 },
  { id: 'android-lg', label: 'Android 대형', os: 'AOS', w: 412, h: 917 },
];

// ─── 화면 → 컴포넌트 렌더러 ────────────────────────────────────────
function ScreenRenderer({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const [sessions] = useState({ 1: defaultSessionState() });

  switch (screenId) {
    case 'home':
      return (
        <HomeScreen
          sessions={sessions}
          setView={(v: any) => onNavigate(v)}
          onStartSession={() => onNavigate('mission')}
        />
      );
    case 'mission':
      return (
        <MissionStage
          sessionId={1}
          onNext={() => onNavigate('quick-review')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'mission-tutor':
      return (
        <MissionTutorStage
          sessionId={1}
          onNext={() => onNavigate('vocab-wordbook')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'mission-tutor-prev':
      return (
        <MissionTutorPrevStage
          sessionId={1}
          onNext={() => onNavigate('quick-review')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'mission-tutor-prev-vi':
      return (
        <MissionTutorPrevViStage
          sessionId={1}
          onNext={() => onNavigate('quick-review')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'bridge-vocab-grammar':
      return (
        <BridgeStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'bridge-grammar-listening':
    case 'bridge-grammar-speaking':
    case 'bridge-grammar-writing': {
      const bridgeDataMap: Record<string, import('../data/lessonData').BridgeData> = {
        'bridge-grammar-listening': require('../data/lessonData').MOCK_BRIDGE_GRAMMAR_LISTENING,
        'bridge-grammar-speaking':  require('../data/lessonData').MOCK_BRIDGE_GRAMMAR_SPEAKING,
        'bridge-grammar-writing':   require('../data/lessonData').MOCK_BRIDGE_GRAMMAR_WRITING,
      };
      return (
        <BridgeStage
          data={bridgeDataMap[screenId]}
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    }
    case 'vocab-wordbook':
      return (
        <VocabWordbookStage
          onNext={() => onNavigate('word-build')}
          onBack={() => onNavigate('mission')}
        />
      );
    case 'vocab-wordbook-voice':
      return (
        <VocabWordbookVoiceStage
          onNext={() => onNavigate('intro')}
          onBack={() => onNavigate('mission')}
        />
      );
    case 'intro':
      return (
        <IntroStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('vocab-wordbook')}
        />
      );
    case 'intro-tutor':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('vocab-wordbook')}
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
    case 'sentence-build':
      return (
        <SentenceBuildStage
          onComplete={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-build-2':
      return (
        <SentenceBuildStage2
          onComplete={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
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
    case 'video-bridge':
      return (
        <VideoBridgeStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
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
    flex: 1, paddingVertical: 7, borderRadius: 10,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  btnActive: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  label: { fontSize: 11, fontWeight: '600', color: colors.muted },
  labelActive: { color: colors.teal },
});

export function EmulatorShell() {
  const [deviceId, setDeviceId] = useState('iphone15');
  const [screenId, setScreenId] = useState('home');
  const [infoTab, setInfoTab] = useState<'desc' | 'dev' | 'design'>('desc');

  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0];
  const screen = getScreen(screenId);

  // 프레임 스케일 — 최대 높이 제약에 맞춤
  const maxH = 780;
  const scale = Math.min(1, maxH / device.h);
  const frameW = device.w * scale;
  const frameH = device.h * scale;

  if (Platform.OS !== 'web') return null;

  return (
    <LangProvider>
    <View style={shell.root}>
      {/* ── 상단 타이틀 바 ── */}
      <View style={shell.topBar}>
        <View style={shell.topBarBrand}>
          <Text style={shell.topBarLogo}>K-Chao</Text>
          <Text style={shell.topBarSub}>리뉴얼 프로토타입 뷰어</Text>
        </View>
        <Text style={shell.topBarVersion}>v0.1 · Expo Web</Text>
      </View>

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
            {SCREEN_REGISTRY.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[shell.selectItem, screenId === s.id && shell.selectItemActive]}
                onPress={() => setScreenId(s.id)}
                activeOpacity={0.7}
              >
                <View style={shell.screenItemTop}>
                  <Text style={[shell.selectItemLabel, screenId === s.id && shell.selectItemLabelActive]}>
                    {s.label}
                  </Text>
                  <View style={[shell.categoryBadge, s.category === '신규' && shell.badgeNew, s.category === '수정' && shell.badgeMod]}>
                    <Text style={shell.categoryBadgeText}>{s.category}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 중앙 디바이스 프레임 ── */}
        <View style={shell.centerPanel}>
          <View style={[shell.deviceOuter, { width: frameW + 24, height: frameH + 48 }]}>
            {/* OS 상단 노치/Dynamic Island 표시 */}
            <View style={[shell.statusBar, { width: frameW }]}>
              <Text style={shell.statusBarText}>9:41</Text>
              <View style={shell.notch} />
              <Text style={shell.statusBarText}>● ● ●</Text>
            </View>
            {/* 화면 렌더링 영역 */}
            <View style={[shell.deviceScreen, { width: frameW, height: frameH - 24 }]}>
              <ScreenRenderer screenId={screenId} onNavigate={setScreenId} />
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
    </View>
    </LangProvider>
  );
}

const shell = StyleSheet.create({
  root: { flex: 1, flexDirection: 'column', backgroundColor: colors.backdrop },
  topBar: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  topBarBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topBarLogo: { fontSize: 15, fontWeight: '800', color: colors.teal },
  topBarSub: { fontSize: 13, color: colors.muted },
  topBarVersion: { fontSize: 12, color: colors.muted },
  body: { flex: 1, flexDirection: 'row' },

  // Left panel
  leftPanel: {
    width: 220, backgroundColor: colors.surface,
    borderRightWidth: 1, borderRightColor: colors.line,
    padding: 16,
  },
  panelTitle: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.6, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' as const },
  selectItem: {
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, marginBottom: 4,
  },
  selectItemActive: { backgroundColor: colors.tealSoft },
  selectItemOs: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  selectItemOsActive: { color: colors.teal },
  selectItemLabel: { fontSize: 13, fontWeight: '500', color: colors.ink },
  selectItemLabelActive: { fontWeight: '700', color: colors.teal },
  selectItemSize: { fontSize: 11, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
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
  deviceInfo: { alignItems: 'center' },
  deviceInfoText: { fontSize: 11, color: colors.muted },

  // Right panel
  rightPanel: {
    width: 420, backgroundColor: colors.surface,
    borderLeftWidth: 1, borderLeftColor: colors.line,
    flexDirection: 'column',
  },
  screenHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  screenName: { fontSize: 14, fontWeight: '700', color: colors.ink, flex: 1, marginRight: 8 },
  tabs: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.teal },
  tabText: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  tabTextActive: { color: colors.teal, fontWeight: '700' },
  tabContent: { flex: 1, padding: 16 },
  infoBlock: { gap: 12 },
  infoText: { fontSize: 13, color: colors.ink, lineHeight: 20 },
  codeChip: {
    borderRadius: 10, padding: 10,
    backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line,
  },
  codeChipB: { borderColor: colors.tealSoft, backgroundColor: '#f0fcfc' },
  codeChipLabel: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  codeChipValue: { fontSize: 12, fontWeight: '600', color: colors.teal, marginTop: 2 },

  // Badges
  categoryBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    backgroundColor: colors.canvas,
  },
  badgeNew: { backgroundColor: '#e8f8f0' },
  badgeMod: { backgroundColor: '#fff4e6' },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: colors.muted },
});
