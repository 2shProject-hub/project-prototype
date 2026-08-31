// assets/particle-rain.json (Lottie) 를 웹에서 재생한다.
// @dotlottie/react-player 는 웹 전용이라 Platform 가드 + 에러 바운더리로 감싼다.
// 플레이어 로딩에 실패해도 축하 화면의 SMIL 반짝임은 그대로 남으므로 시안이 깨지지 않는다.
import { Component, type ReactNode } from 'react';
import { View, Platform, StyleSheet } from 'react-native';

const ANIMATION = require('../../../assets/particle-rain.json');

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* 조용히 무시 — 폴백은 SMIL 반짝임 */
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children as any;
  }
}

function WebPlayer() {
  let Player: any;
  try {
    Player = require('@dotlottie/react-player').DotLottiePlayer;
  } catch {
    return null;
  }
  if (!Player) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { opacity: 0.85 }]} pointerEvents="none">
      <Player src={ANIMATION} autoplay loop style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

export function LottieConfetti() {
  if (Platform.OS !== 'web') return null;
  return (
    <Boundary>
      <WebPlayer />
    </Boundary>
  );
}
