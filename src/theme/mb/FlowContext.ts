// 학습 플로우 진행 컨텍스트 — EmulatorShell 이 플로우 모드일 때 주입한다.
// ActivityHeader(공용)와 MB 화면들이 트로피 진행바에 STEP n/총 을 표시할 때 쓴다.
import { createContext, useContext } from 'react';

export interface FlowProgress {
  step: number;
  total: number;
}

export const FlowProgressContext = createContext<FlowProgress | null>(null);

export function useFlowProgress(): FlowProgress | null {
  return useContext(FlowProgressContext);
}
