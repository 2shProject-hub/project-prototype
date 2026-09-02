// MB(말해보카 전용) 화면 레지스트리.
//
// 말해보카 테마가 켜져 있으면 ScreenRenderer 가 여기 등록된 전용 화면을 대신 렌더한다.
// 등록이 없는 화면은 기존 소스 그대로 — 다른 테마는 어떤 경우에도 영향받지 않는다.
// 새 화면을 BIKO 컨셉으로 옮길 때마다 여기에 추가한다.
import React from 'react';
import { MbWordSlides } from './MbWordSlides';
import { MbSlideExplain } from './MbSlideExplain';

export interface MbScreenProps {
  onNavigate: (id: string) => void;
  /** 학습 플로우에서의 현재 스텝(1-base)·전체 수 — 플로우 밖에서는 undefined */
  flowStep?: number;
  flowTotal?: number;
}

export const MB_SCREENS: Record<string, (p: MbScreenProps) => React.ReactElement> = {
  'slide-explain': ({ onNavigate }) => (
    <MbSlideExplain onNext={() => onNavigate('home')} onBack={() => onNavigate('home')} />
  ),
  'word-intro-slides': ({ onNavigate, flowStep, flowTotal }) => (
    <MbWordSlides
      onNext={() => onNavigate('home')}
      onBack={() => onNavigate('home')}
      flowStep={flowStep}
      flowTotal={flowTotal}
    />
  ),
};
