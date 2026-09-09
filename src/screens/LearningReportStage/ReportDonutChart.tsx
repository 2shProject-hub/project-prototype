import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { svgDataUri } from '../../theme/graphics';

interface DonutChartProps {
  percentage: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  startColor?: string;
  endColor?: string;
}

export function generateDonutSvg(
  percentage: number,
  label = '정답률',
  size = 114,
  strokeWidth = 12,
  startColor = '#00A8A6',
  endColor = '#0EA5E9',
): string {
  const esc = (t: string) => t.replace(/[^ -~]/g, (ch) => '&#' + ch.charCodeAt(0) + ';');
  const safeLabel = esc(label);
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percentage));
  const off = c * (1 - pct / 100);
  const center = size / 2;

  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<defs>` +
      `<linearGradient id="dGrad" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="${startColor}"/>` +
      `<stop offset="100%" stop-color="${endColor}"/>` +
      `</linearGradient>` +
      `</defs>` +
      // 배경 트랙
      `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#F1F5F9" stroke-width="${strokeWidth}"/>` +
      // 진행 게이지 원호
      `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="url(#dGrad)" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${center} ${center})"/>` +
      // 중앙 퍼센트 및 라벨 텍스트
      `<text x="${center}" y="${center - 1}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#04303D">${pct}%</text>` +
      `<text x="${center}" y="${center + 19}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#64748B">${safeLabel}</text>` +
      `</svg>`,
  );
}

export function ReportDonutChart({
  percentage,
  label = '정답률',
  size = 114,
  strokeWidth = 12,
  startColor = '#00A8A6',
  endColor = '#0EA5E9',
}: DonutChartProps) {
  const uri = generateDonutSvg(percentage, label, size, strokeWidth, startColor, endColor);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
