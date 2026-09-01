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

/** 트로피 배지가 붙은 진행 알약 — 막대 안에 n/m, 채움 애니메이션 + 하이라이트 스윕 */
export function MbHeader({
  current,
  total,
  onClose,
}: {
  current: number;
  total: number;
  onClose: () => void;
}) {
  const pct = Math.round((current / total) * 100);
  const fill = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fill, { toValue: pct, duration: 520, useNativeDriver: false }).start();
    sweep.setValue(0);
    Animated.timing(sweep, { toValue: 1, duration: 700, useNativeDriver: false }).start();
    pop.setValue(1.35);
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: false }).start();
  }, [pct, fill, sweep, pop]);

  const trophy = svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">` +
      `<path d="M6 4h12v3.2c0 3.8-2.6 6.8-6 6.8s-6-3-6-6.8z" fill="#FFC53D"/>` +
      `<path d="M6 5H3.4c0 3 1.4 4.8 3.4 5.4M18 5h2.6c0 3-1.4 4.8-3.4 5.4" stroke="#FFC53D" stroke-width="1.7" fill="none"/>` +
      `<rect x="10.6" y="13.6" width="2.8" height="3" fill="#F5A623"/>` +
      `<rect x="8" y="16.6" width="8" height="2.6" rx="1.2" fill="#F5A623"/>` +
      `<path d="M9.2 6.4h5.6" stroke="#FFF3D6" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  );

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {/* 트로피 배지 — 알약에 겹침 */}
        <View
          style={{
            width: 34, height: 34, borderRadius: 17, backgroundColor: mb.white,
            alignItems: 'center', justifyContent: 'center', zIndex: 2,
            shadowColor: '#5B8CB8', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Image source={{ uri: trophy }} style={{ width: 21, height: 21 }} />
        </View>
        <View style={{ flex: 1, height: 22, marginLeft: -10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.75)', overflow: 'hidden', justifyContent: 'center' }}>
          <Animated.View
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              borderRadius: 999,
              backgroundColor: mb.violet,
              width: fill.interpolate({ inputRange: [0, 100], outputRange: ['12%', '100%'] }),
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute', top: 0, bottom: 0, width: 40,
                backgroundColor: 'rgba(255,255,255,0.4)',
                transform: [
                  { translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-50, 320] }) },
                  { skewX: '-22deg' },
                ],
              }}
            />
          </Animated.View>
          {/* 막대 안 카운터 */}
          <Text style={{ fontFamily: mbFont, fontSize: 11.5, fontWeight: '800', color: mb.white, marginLeft: 22, zIndex: 2 }}>
            {current}/{total}
          </Text>
        </View>
      </View>
      <Animated.Text
        style={{ fontFamily: mbFont, fontSize: 15, fontWeight: '900', color: mb.violetDark, transform: [{ scale: pop }] }}
      >
        {pct}%
      </Animated.Text>
      <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
        <Image source={{ uri: icon('close', '#7d8aa0', 19, 2.2) }} style={{ width: 19, height: 19 }} />
      </TouchableOpacity>
    </View>
  );
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
        paddingTop: 8,
        paddingBottom: 14,
      }}
    >
      <TouchableOpacity
        onPress={onPrev}
        disabled={isFirst}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 2,
          paddingHorizontal: 12, height: 44, borderRadius: 12,
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
          paddingHorizontal: 12, height: 44, borderRadius: 12,
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
          height: 50,
          borderRadius: 13,
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
