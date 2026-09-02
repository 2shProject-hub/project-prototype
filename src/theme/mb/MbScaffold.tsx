// MB(말해보카 전용) 플로우 공용 골격 — 실제 앱 학습 화면 문법.
//
// 실물 기준: 하늘색 그라디언트 지면 위에 흰 카드가 떠 있고,
// 상단 진행바는 트로피 배지가 붙은 알약 트랙(막대 안에 n/m 카운터) + 채움/스윕 이펙트.
// 하단은 [‹ 이전] [n/m] [넘기기 ›] [다음 →] 한 줄 — 버튼은 라운드 사각(12~13px).
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native';
import { icon, svgDataUri } from '../graphics';
import { mb, mbFont } from './mbTokens';

/** 하늘색 그라디언트 지면 — 실물 학습 화면 배경 */
export function MbCanvas({ children }: { children: React.ReactNode }) {
  const grad = svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="100" viewBox="0 0 10 100" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#BFE3FA"/><stop offset="0.45" stop-color="#E3F2FD"/><stop offset="1" stop-color="#F7FBFF"/>` +
      `</linearGradient></defs><rect width="10" height="100" fill="url(#g)"/></svg>`,
  );
  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: grad }} style={StyleSheet.absoluteFill as any} resizeMode="stretch" />
      {children}
    </View>
  );
}

/** 트로피 배지가 붙은 진행 알약 — 막대 안 카운터, 채움 애니메이션 + 하이라이트 스윕.
 *  말해보카 테마의 모든 화면 상단이 이 바로 통일된다. */
const STUDENT_PROFILE = require('../../../assets/themes/malhaeboka/profile-student.png');

export function MbProgressRow({
  percentage,
  counter,
  onClose,
}: {
  percentage: number;
  counter: string;
  onClose: () => void;
}) {
  const pct = Math.round(percentage);
  const fill = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fill, { toValue: pct, duration: 520, useNativeDriver: false }).start();
    sweep.setValue(0);
    Animated.timing(sweep, { toValue: 1, duration: 700, useNativeDriver: false }).start();
    pop.setValue(1.3);
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: false }).start();
  }, [pct, fill, sweep, pop]);

  // "12/43" → 앞은 보라 강조, 뒤는 회색 — 상용 강의 앱의 수강 카운터 문법
  const parts = counter.includes('/') ? counter.split('/') : null;
  const markerLeft = fill.interpolate({ inputRange: [0, 100], outputRange: ['4%', '100%'] });

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 2, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
      {/* 학생 프로필 — 스토리 링 스타일 보라 테두리 */}
      <View
        style={{
          width: 36, height: 36, borderRadius: 18,
          borderWidth: 2, borderColor: mb.violet,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: mb.white, marginTop: -3,
          shadowColor: '#5B3DF5', shadowOpacity: 0.22, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Image source={STUDENT_PROFILE} style={{ width: 29, height: 29, borderRadius: 14.5 }} />
      </View>
      {/* 트랙 + 마커 + 말풍선 */}
      <View style={{ flex: 1, height: 44 }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 8.5, height: 7, borderRadius: 999, backgroundColor: '#EAE8F3', overflow: 'hidden' }}>
          <Animated.View
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              borderRadius: 999,
              backgroundColor: mb.violet,
              width: fill.interpolate({ inputRange: [0, 100], outputRange: ['4%', '100%'] }),
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute', top: 0, bottom: 0, width: 36,
                backgroundColor: 'rgba(255,255,255,0.45)',
                transform: [
                  { translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-40, 320] }) },
                  { skewX: '-22deg' },
                ],
              }}
            />
          </Animated.View>
        </View>

        {/* 연필 마커 — 진행 지점 */}
        <Animated.View
          style={{
            position: 'absolute', left: markerLeft, top: 0,
            width: 24, height: 24, borderRadius: 12, marginLeft: -12,
            backgroundColor: mb.white, borderWidth: 1.5, borderColor: '#DCD2F5',
            alignItems: 'center', justifyContent: 'center',
            shadowColor: '#5B3DF5', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
            zIndex: 2,
          }}
        >
          <Image source={{ uri: icon('pencil', mb.violet, 13, 2.4) }} style={{ width: 13, height: 13 }} />
        </Animated.View>

        {/* % 말풍선 — 마커 아래 */}
        <Animated.View
          style={{
            position: 'absolute', left: markerLeft, top: 27,
            marginLeft: -21, width: 42, alignItems: 'center',
            transform: [{ scale: pop }],
            zIndex: 2,
          }}
        >
          <View style={{ width: 7, height: 7, backgroundColor: '#2A2733', transform: [{ rotate: '45deg' }], marginBottom: -4.5 }} />
          <View style={{ backgroundColor: '#2A2733', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2.5 }}>
            <Text style={{ fontFamily: mbFont, fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>{pct}%</Text>
          </View>
        </Animated.View>

        {/* 스케일 라벨 */}
        <Text style={{ position: 'absolute', left: 0, top: 27, fontFamily: mbFont, fontSize: 9.5, fontWeight: '700', color: '#B4B1C4' }}>0</Text>
        {parts ? (
          <Text style={{ position: 'absolute', right: 0, top: 27, fontFamily: mbFont, fontSize: 9.5, fontWeight: '700', color: '#B4B1C4' }}>{parts[1]}</Text>
        ) : null}
      </View>

      {/* 우측 카운터 — 이중톤 */}
      {parts ? (
        <Text style={{ fontFamily: mbFont, marginTop: 3 }}>
          <Text style={{ fontSize: 15, fontWeight: '900', color: mb.violetDark }}>{parts[0]}</Text>
          <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#8A8799' }}>/{parts[1]}</Text>
        </Text>
      ) : null}
      <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7} style={{ marginTop: 3 }}>
        <Image source={{ uri: icon('close', '#7d8aa0', 19, 2.2) }} style={{ width: 19, height: 19 }} />
      </TouchableOpacity>
    </View>
  );
}

/** MB 화면용 헤더 — 진행 알약 한 줄 */
export function MbHeader({ current, total, onClose }: { current: number; total: number; onClose: () => void }) {
  return <MbProgressRow percentage={(current / total) * 100} counter={`${current}/${total}`} onClose={onClose} />;
}

/** 플로팅 흰 카드 — 실물의 문항 카드 */
export function MbCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View
      style={[
        {
          backgroundColor: mb.white,
          borderRadius: 20,
          shadowColor: '#3E6D96',
          shadowOpacity: 0.16,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** 한 줄 내비게이션: ‹ 이전 · n/m · 넘기기 › · 다음 → */
export function MbNavBar({
  index,
  total,
  onPrev,
  onSkip,
  onNext,
  nextEnabled,
  nextLabel = '다음',
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onSkip: () => void;
  onNext?: () => void;
  nextEnabled: boolean;
  nextLabel?: string;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const grad = svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#9B6DF8"/><stop offset="1" stop-color="#6E32EA"/>` +
      `</linearGradient></defs><rect width="10" height="10" fill="url(#g)"/></svg>`,
  );
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingTop: 5,
        paddingBottom: 2,
      }}
    >
      <TouchableOpacity
        onPress={onPrev}
        disabled={isFirst}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 2,
          paddingHorizontal: 12, height: 36, borderRadius: 10,
          backgroundColor: mb.white,
          shadowColor: '#3E6D96', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
          opacity: isFirst ? 0.45 : 1,
        }}
      >
        <Image source={{ uri: icon('back', mb.violetDark, 13, 2.6) }} style={{ width: 13, height: 13 }} />
        <Text style={{ fontFamily: mbFont, fontSize: 13.5, fontWeight: '700', color: mb.violetDark }}>이전</Text>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 4 }}>
        <Text style={{ fontFamily: mbFont, fontSize: 13.5, fontWeight: '800', color: mb.muted }}>
          <Text style={{ color: mb.ink }}>{index + 1}</Text> / {total}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSkip}
        disabled={isLast}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 2,
          paddingHorizontal: 12, height: 36, borderRadius: 10,
          backgroundColor: mb.white,
          shadowColor: '#3E6D96', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
          opacity: isLast ? 0.45 : 1,
        }}
      >
        <Text style={{ fontFamily: mbFont, fontSize: 13.5, fontWeight: '700', color: mb.violetDark }}>넘기기</Text>
        <Image source={{ uri: icon('chevron', mb.violetDark, 13, 2.6) }} style={{ width: 13, height: 13 }} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={nextEnabled ? onNext : undefined}
        disabled={!nextEnabled}
        activeOpacity={0.85}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 11,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          backgroundColor: nextEnabled ? mb.violet : 'rgba(255,255,255,0.85)',
          shadowColor: nextEnabled ? mb.violet : '#3E6D96',
          shadowOpacity: nextEnabled ? 0.35 : 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {nextEnabled && (
          <Image source={{ uri: grad }} style={StyleSheet.absoluteFill as any} resizeMode="stretch" />
        )}
        <Text style={{ fontFamily: mbFont, fontSize: 16, fontWeight: '800', color: nextEnabled ? mb.white : mb.muted }}>
          {nextLabel}
        </Text>
        <Image
          source={{ uri: icon('chevron', nextEnabled ? '#FFFFFF' : mb.muted, 15, 2.8) }}
          style={{ width: 15, height: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
}
