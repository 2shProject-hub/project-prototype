// 아바타/튜터 대화창 타자 이펙트 — 글자가 순차적으로 주르륵 나타난다 (속도 빠르게).
// 남은 글자를 투명으로 함께 렌더해 레이아웃은 처음부터 최종 크기로 고정된다(점프 없음).
import React, { useEffect, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

export function TypewriterText({
  text,
  style,
  active = true,
  cps = 58,
  delayMs = 0,
  numberOfLines,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  /** false 면 즉시 전체 표시 (테마 OFF 등) */
  active?: boolean;
  /** 초당 글자 수 */
  cps?: number;
  delayMs?: number;
  numberOfLines?: number;
}) {
  const [n, setN] = useState(active ? 0 : text.length);
  useEffect(() => {
    if (!active) { setN(text.length); return; }
    setN(0);
    let iv: ReturnType<typeof setInterval> | null = null;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        setN((v) => {
          if (v >= text.length) { if (iv) clearInterval(iv); return v; }
          return v + 1;
        });
      }, Math.max(8, 1000 / cps));
    }, delayMs);
    return () => { clearTimeout(t); if (iv) clearInterval(iv); };
  }, [text, active, cps, delayMs]);
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {text.slice(0, n)}
      <Text style={{ opacity: 0 }}>{text.slice(n)}</Text>
    </Text>
  );
}
