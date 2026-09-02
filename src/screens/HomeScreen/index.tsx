import React from 'react';

// 차시별 실사 — 타일 로테이션 대신 차시 내용에 맞는 사진
const SESSION_PHOTOS: any[] = [
  require('../../../assets/SetWordbookEvalStage/nara.png'),        // 1차시 나라와 국적 소개
  require('../../../assets/SetWordbookEvalStage/6_employee.png'),  // 2차시 직업 묻고 답하기
  require('../../../assets/SetWordbookEvalStage/1_student.png'),   // 3차시 국적 문장 만들기(필기)
  require('../../../assets/SetWordbookEvalStage/2_teacher.png'),   // 4차시
  require('../../../assets/classroom.jpg'),                        // 5차시
  require('../../../assets/SetWordbookEvalStage/preson.png'),      // 6차시
];
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Animated,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { BottomNav } from '../../components/BottomNav';
import { useLang, pick } from '../../components/LangContext';
import { useTheme } from '../../theme/ThemeContext';
import { themeAssets } from '../../theme/themeAssets';
import { LESSON, SESSIONS, STAGE_ORDER, type SessionState } from '../../data/lessonData';

type AppView = 'home' | 'report' | 'ai-talk' | 'my-info' | 'learning';
type SubTab = 'my' | 'all';

interface Props {
  sessions: Record<number, SessionState>;
  setView: (v: AppView | string) => void;
  onStartSession: (id: number) => void;
}

const LABEL_VI: Record<string, string> = {
  '문법과 표현': 'Ngữ pháp & Biểu đạt',
  '학습 성과': 'Kết quả học tập',
};

function SessionRing({ frac, completed }: { frac: number; completed: boolean }) {
  const { lang } = useLang();
  const pct = Math.round(frac * 100);
  return (
    <View style={ring.container}>
      <View style={ring.track}>
        <View style={ring.hole}>
          {completed ? (
            <Text style={ring.doneText}>{pick(lang, '완료', 'Xong')}</Text>
          ) : (
            <Text style={ring.pctText}>{pct}%</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function HomeScreen({ sessions, setView, onStartSession }: Props) {
  const { theme: activeTheme, enabled: themeOn } = useTheme();
  const brandCrest = themeOn ? themeAssets(activeTheme.id)?.crest : undefined;
  const brandRowIcons = themeOn ? themeAssets(activeTheme.id)?.rowIcons : undefined;
  const { lang } = useLang();
  const [subTab, setSubTab] = useState<SubTab>('my');

  const completedCount = Object.values(sessions).filter((s) => s.completed).length;
  const totalCount = SESSIONS.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const sessionProgress = (sess: SessionState | undefined, id: number) => {
    if (!sess) return 0;
    if (sess.completed) return 1;
    const order = id === 1 ? STAGE_ORDER.filter((x) => x !== 'recall') : STAGE_ORDER;
    const idx = order.indexOf(sess.stage);
    return order.length ? Math.max(0, idx) / order.length : 0;
  };

  return (
    <View style={styles.screen}>
      {/* ── 상단 헤더 ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.headerTabActive}>{pick(lang, '홈', 'Trang chủ')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.headerTabInactive}>{pick(lang, '코스', 'Khóa học')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boltBadge}>
          {brandCrest ? (
            <Image source={require('../../../assets/themes/malhaeboka/icon-bolt.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
          ) : (
            <Text style={styles.boltIcon}>⚡</Text>
          )}
          <Text style={styles.boltText}>0</Text>
        </View>
      </View>

      {/* ── 2차 탭: 나의 코스 / 전체 코스 ── */}
      <View style={styles.subTabs}>
        {(['my', 'all'] as SubTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTab, subTab === tab && styles.subTabActive]}
            onPress={() => setSubTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.subTabText, brandCrest && { fontSize: 16, fontWeight: '800' }, subTab === tab && styles.subTabTextActive, brandCrest && subTab === tab && { fontSize: 16, fontWeight: '900' }]}>
              {tab === 'my'
                ? pick(lang, '나의 코스', 'Khóa của tôi')
                : pick(lang, '전체 코스', 'Tất cả khóa học')
              }
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {subTab === 'all' ? (
        /* ── 전체 코스 탭 ── */
        <View style={styles.allCourseEmpty}>
          <ThemedGlyph style={styles.allCourseEmptyIcon} glyph="📚" />
          <Text style={styles.allCourseEmptyTitle}>
            {pick(lang, '전체 코스', 'Tất cả khóa học')}
          </Text>
          <Text style={styles.allCourseEmptySub}>
            {pick(lang,
              '어드민에 등록된 전체 코스가\nAPI를 통해 표시됩니다.',
              'Tất cả các khóa học được đăng ký\ntrong admin sẽ hiển thị qua API.'
            )}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* ── 히어로 카드 ── */}
          <View style={styles.hero}>
            <View style={styles.heroText}>
              <View style={styles.lessonBadge}>
                <Text style={styles.lessonBadgeText}>{LESSON.number}</Text>
              </View>
              <Text style={[styles.heroTitle, brandCrest && { fontSize: 24, letterSpacing: -0.5 }]}>{LESSON.title}</Text>
              {brandCrest ? (
                <ReadingPulse text={pick(lang, LESSON.summary, LESSON.summaryVi)} style={[styles.heroSummary, { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#332F45' }]} />
              ) : (
                <Text style={styles.heroSummary}>
                  {pick(lang, LESSON.summary, LESSON.summaryVi)}
                </Text>
              )}
            </View>
            <View style={styles.heroImageBox}>
              {brandCrest ? (
                <Image source={brandCrest} style={{ width: 56, height: 72 }} resizeMode="contain" />
              ) : (
                <ThemedGlyph style={styles.heroEmoji} glyph="🏫" />
              )}
            </View>
          </View>

          {/* ── 전체 진도 ── */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelText}>
                {pick(lang, '전체 진도', 'Tổng tiến độ')}
              </Text>
              <Text style={styles.progressPct}>
                {pct}%
                <Text style={styles.progressSub}> ({completedCount}/{totalCount})</Text>
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` as `${number}%` }]} />
            </View>
            {/* 차시 세션 pill ── 가로 스크롤 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillsScroll}
              contentContainerStyle={styles.pillsRow}
            >
              {SESSIONS.map((s) => {
                const done = sessions[s.id]?.completed;
                return (
                  <View key={s.id} style={[styles.pill, done && styles.pillDone]}>
                    <Text style={[styles.pillText, done && styles.pillTextDone]}>
                      {done ? '✓ ' : ''}{pick(lang, `${s.id}차시`, `Bài ${s.id}`)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* ── 섹션 제목 ── */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              {pick(lang, '1과 학습 순서', 'Thứ tự học Bài 1')}
            </Text>
          </View>

          {/* ── 세션 카드 (타임라인) ── */}
          <View style={styles.timeline}>
            {SESSIONS.map((s, idx) => {
              const sess = sessions[s.id];
              const completed = sess?.completed ?? false;
              const unlocked = s.id === 1 || s.id === 2;
              const frac = sessionProgress(sess, s.id);
              const isLast = idx === SESSIONS.length - 1;

              const nowId = [...SESSIONS].reverse().find((x) => (x.id === 1 || x.id === 2) && !(sessions[x.id]?.completed ?? false))?.id;
              const showNow = brandRowIcons && unlocked && !completed && s.id === nowId;
              return (
                <View key={s.id} style={styles.timelineRow}>
                  {/* 세로 연결선 */}
                  {!isLast && <View style={styles.connector} />}
                  {/* 번호 원 — 브랜드 자산 테마는 아이콘 타일 (차시 번호는 카드의 "N차시" 텍스트가 유지) */}
                  {brandRowIcons ? (
                    <MbNowPulse active={!!showNow}>
                    <View style={[styles.dot, { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#ECE7FA' }, showNow ? { borderColor: '#B9A5F5', borderWidth: 2 } : null]}>
                      <Image
                        source={SESSION_PHOTOS[idx % SESSION_PHOTOS.length]}
                        style={{ width: 40, height: 40, borderRadius: 20, opacity: unlocked ? 1 : 0.38 }}
                        resizeMode="cover"
                      />
                      {completed ? (
                        <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: activeTheme.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: activeTheme.colors.onPrimary, fontSize: 9, fontWeight: '700' }}>✓</Text>
                        </View>
                      ) : null}
                      {showNow ? (
                        <View style={{ position: 'absolute', top: -7, alignSelf: 'center', backgroundColor: '#7150F0', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 1.5 }}>
                          <Text style={{ fontSize: 8.5, fontWeight: '800', color: '#FFFFFF' }}>NOW</Text>
                        </View>
                      ) : null}
                    </View>
                    </MbNowPulse>
                  ) : (
                    <View style={[
                      styles.dot,
                      completed && styles.dotDone,
                      !unlocked && styles.dotLocked,
                    ]}>
                      <Text style={[styles.dotText, !unlocked && styles.dotTextLocked]}>
                        {completed ? '✓' : s.id}
                      </Text>
                    </View>
                  )}
                  {/* 카드 — 진행중 차시는 카드도 함께 숨쉰다 */}
                  <MbNowPulse active={!!showNow} scaleTo={1.015} style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={[styles.sessionCard, showNow && { backgroundColor: '#F7F4FF', borderWidth: 1.5, borderColor: '#C9B8F9' }, !unlocked && styles.sessionCardLocked]}
                    onPress={() => unlocked && onStartSession(s.id)}
                    activeOpacity={unlocked ? 0.75 : 1}
                    disabled={!unlocked}
                  >
                    <View style={styles.sessionMain}>
                      <View style={styles.sessionMeta}>
                        <Text style={styles.sessionIndex}>
                          {pick(lang, `${s.id}차시`, `Bài ${s.id}`)}
                        </Text>
                        <Text style={[styles.sessionTitle, !unlocked && styles.sessionTitleLocked]}>
                          {s.title}
                        </Text>
                        {s.titleVi ? (
                          <Text style={styles.sessionTitleVi}>{s.titleVi}</Text>
                        ) : null}
                        <Text style={styles.sessionExpr}>
                          <Text style={styles.sessionLabel}>
                            {pick(lang, s.label, LABEL_VI[s.label] ?? s.label)}
                          </Text>
                          {'  '}{s.expression}
                        </Text>
                      </View>
                      {unlocked ? (
                        <SessionRing frac={frac} completed={completed} />
                      ) : (
                        <Text style={styles.lockIcon}>🔒</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  </MbNowPulse>
                </View>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      <BottomNav active="home" setView={(v) => setView(v)} />
    </View>
  );
}

// ── 진도 링 ──────────────────────────────────────────────────────────
const ring = StyleSheet.create({
  container: { width: 52, height: 52 },
  track: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 3, borderColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
  },
  hole: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  doneText: { fontSize: 9, fontWeight: '700', color: colors.teal, textAlign: 'center' },
  pctText: { fontSize: 10, fontWeight: '700', color: colors.teal },
});

// ── 메인 스타일 ──────────────────────────────────────────────────────
// 단어별 리딩 모션 — 순서대로 커졌다 줄며 읽어주는 느낌 (말해보카)
function ReadingPulse({ text, style }: { text: string; style?: any }) {
  const words = text.split(' ');
  const anims = useRef(words.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const seq = Animated.loop(
      Animated.sequence([
        ...anims.map((a) =>
          Animated.sequence([
            Animated.timing(a, { toValue: 1, duration: 240, useNativeDriver: false }),
            Animated.timing(a, { toValue: 0, duration: 240, useNativeDriver: false }),
          ]),
        ),
        Animated.delay(1200),
      ]),
    );
    seq.start();
    return () => seq.stop();
  }, [anims]);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {words.map((w, i) => (
        <Animated.View
          key={i}
          style={{ transform: [{ scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) }] }}
        >
          <Animated.Text
            style={[style, { marginRight: 4, opacity: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }) }]}
          >
            {w}
          </Animated.Text>
        </Animated.View>
      ))}
    </View>
  );
}

// 진행중 차시 아이콘 — 잔잔히 커졌다 작아지며 '지금 여기'를 알린다
function MbNowPulse({ active, style, scaleTo = 1.09, children }: { active: boolean; style?: object; scaleTo?: number; children: React.ReactNode }) {
  const sc = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) { sc.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sc, { toValue: scaleTo, duration: 700, useNativeDriver: false }),
        Animated.timing(sc, { toValue: 1, duration: 700, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, sc, scaleTo]);
  if (!active) return <View style={style}>{children}</View>;
  return <Animated.View style={[style, { transform: [{ scale: sc }] }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },

  // Header
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  headerTabActive: { fontSize: 22, fontWeight: '800', color: colors.ink },
  headerTabInactive: { fontSize: 22, fontWeight: '800', color: '#BDBDBD' },
  boltBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ECEFF3',
    borderBottomWidth: 3,
    borderBottomColor: '#DADEEA',
  },
  boltIcon: { fontSize: 18 },
  boltText: { fontSize: 15, fontWeight: '700', color: colors.ink },

  // Secondary tabs
  subTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.surface,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabActive: { borderBottomColor: colors.teal },
  subTabText: { fontSize: 14, fontWeight: '500', color: colors.muted },
  subTabTextActive: { fontSize: 14, fontWeight: '700', color: colors.teal },

  // 전체 코스 빈 상태
  allCourseEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
  },
  allCourseEmptyIcon: { fontSize: 40 },
  allCourseEmptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  allCourseEmptySub: {
    fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20,
  },

  scroll: { flex: 1, backgroundColor: colors.canvas },

  // Hero
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    backgroundColor: colors.tealSoft,
    borderBottomWidth: 1,
    borderBottomColor: '#c8f0ef',
  },
  heroText: { flex: 1, gap: 6 },
  lessonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  lessonBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  heroSummary: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  heroImageBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#c8f0ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 36 },

  // Progress
  progressSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  progressPct: { fontSize: 14, fontWeight: '800', color: colors.teal },
  progressSub: { fontSize: 12, fontWeight: '400', color: colors.muted },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 5 },
  pillsScroll: {},
  pillsRow: { flexDirection: 'row', gap: 6 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.canvas,
  },
  pillDone: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  pillText: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  pillTextDone: { color: colors.teal, fontWeight: '700' },

  // Section heading
  sectionHeading: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: colors.canvas,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },

  // Timeline
  timeline: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.canvas,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 21, // dot(44px) 정중앙 = 22 - 선폭/2
    top: 51,
    bottom: -23, // 다음 아이콘 상단(marginTop 7)까지 끊김 없이 잇는다
    width: 2,
    backgroundColor: '#E4E0F2',
    zIndex: 0,
  },
  dot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 7,
    zIndex: 1,
  },
  dotDone: { backgroundColor: colors.green },
  dotLocked: { backgroundColor: '#D9D9D9' },
  dotText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dotTextLocked: { color: '#9AA5B1' },

  sessionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    ...shadow.card,
  },
  sessionCardLocked: { opacity: 0.6 },
  sessionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionMeta: { flex: 1, gap: 2 },
  sessionIndex: { fontSize: 11, fontWeight: '600', color: colors.muted },
  sessionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, lineHeight: 22 },
  sessionTitleLocked: { color: '#BCC9D2' },
  sessionTitleVi: { fontSize: 12, color: colors.muted },
  sessionExpr: { fontSize: 12, color: colors.muted, marginTop: 2 },
  sessionLabel: { fontSize: 11, fontWeight: '700', color: colors.teal },
  lockIcon: { fontSize: 22 },
});
