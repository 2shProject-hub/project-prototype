// 눈 깜빡임 스프라이트 — 뜬 눈/감은 눈 두 프레임을 항상 함께 마운트해 두고 투명도만 토글한다.
// 소스 스왑 방식은 감은 프레임 로드가 끝날 때까지 캐릭터가 통째로 사라져 보이는 플리커가 난다.
import React from 'react';
import { Image, View } from 'react-native';

export function BlinkSprite({ img, blink, on, w, h, resizeMode = 'contain' }: {
  img: any;
  blink?: any;
  on: boolean;
  w: number;
  h: number;
  resizeMode?: 'contain' | 'cover';
}) {
  if (!blink) return <Image source={img} style={{ width: w, height: h }} resizeMode={resizeMode} />;
  return (
    <View style={{ width: w, height: h }}>
      <Image source={img} style={{ position: 'absolute', top: 0, left: 0, width: w, height: h, opacity: on ? 0 : 1 }} resizeMode={resizeMode} />
      <Image source={blink} style={{ position: 'absolute', top: 0, left: 0, width: w, height: h, opacity: on ? 1 : 0 }} resizeMode={resizeMode} />
    </View>
  );
}
