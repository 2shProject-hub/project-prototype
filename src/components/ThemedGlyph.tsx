// 이모지 아이콘의 브랜드 자산 치환.
//
// 화면들은 스피커(🔊/🔈)·마이크(🎤)·힌트(💡) 같은 아이콘을 이모지 Text 로 그린다.
// 브랜드 자산 테마(말해보카)가 켜져 있으면 같은 자리에서 실제 앱 글리프 이미지를,
// 아니면 기존 이모지를 그대로 렌더한다 — 크기는 원래 스타일의 fontSize 를 따른다.
//
// 상태를 색으로 표현하던 이모지 쌍(🔊 재생중 / 🔈 대기)은 활성·비활성 글리프 쌍으로 대응된다.
import { Image, Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { themeAssets } from '../theme/themeAssets';

/** 이모지 → 글리프 키 (themeAssets.glyphs 의 키) */
const GLYPH_KEY: Record<string, string> = {
  '🔊': 'speakerOn',
  '🔉': 'speakerOn',
  '🔈': 'speakerOff',
  '🎧': 'speakerOn',
  '🎤': 'mic',
  '🎙': 'mic',
  '🎙️': 'mic',
  '💡': 'hint',
  '⏸': 'pause',
  '⌨': 'kbd',
  '⌨️': 'kbd',
  '🃏': 'cards',
  '🔤': 'cards',
  '📖': 'book',
  '📚': 'book',
  '▶': 'play',
  '🎬': 'play',
  '🏫': 'school',
  '✏️': 'write',
  '✏': 'write',
  '📝': 'write',
  '🎯': 'quest',
  '🤝': 'dict',
  '🖼️': 'book',
  '🖼': 'book',
};

interface Props {
  /** 원래 쓰던 이모지 (동적 상태면 표현식 결과) */
  glyph: string;
  /** 원래 Text 에 주던 스타일 — fontSize 로 이미지 크기를 정한다 */
  style?: StyleProp<TextStyle>;
}

export function ThemedGlyph({ glyph, style }: Props) {
  const { theme, enabled } = useTheme();
  const key = GLYPH_KEY[glyph.trim()];
  const img = enabled && key ? themeAssets(theme.id)?.glyphs?.[key] : undefined;
  if (!img) return <Text style={style}>{glyph}</Text>;

  const flat = StyleSheet.flatten(style) ?? {};
  const size = typeof flat.fontSize === 'number' ? flat.fontSize : 18;
  // 전구·키보드처럼 디테일이 많은 실사 글리프는 같은 fontSize 라도 작아 보인다 — 키별 배율 부스트
  const boost = key === 'hint' ? 1.7 : key === 'kbd' ? 1.55 : key === 'mic' ? 1.5 : key === 'speakerOn' || key === 'speakerOff' ? 1.3 : 1;
  return (
    <Image
      source={img}
      style={{
        width: Math.round(size * 1.2 * boost),
        height: Math.round(size * 1.1 * boost),
        opacity: typeof flat.opacity === 'number' ? flat.opacity : undefined,
      }}
      resizeMode="contain"
    />
  );
}
