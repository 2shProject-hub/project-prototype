import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { svgDataUri } from '../../theme/graphics';

interface RadarChartProps {
  accuracy: number; // 정확도 (0~100)
  fluency: number; // 유창성 (0~100)
  completeness: number; // 완성도 (0~100)
  labels?: {
    accuracy: string;
    fluency: string;
    completeness: string;
  };
  accentColor?: string;
  fillColor?: string;
}

export function generateRadarSvg(
  accuracy: number,
  fluency: number,
  completeness: number,
  labels = { accuracy: '정확도', fluency: '유창성', completeness: '완성도' },
  accentColor = '#FF5B29', // 시안의 선명한 코랄 오렌지
  fillColor = 'rgba(255, 91, 41, 0.22)',
): string {
  // 대형 레이아웃 캔버스
  const W = 330;
  const H = 265;
  const cx = 165;
  const cy = 138;
  const R = 92;

  const esc = (t: string) => t.replace(/[^ -~]/g, (ch) => '&#' + ch.charCodeAt(0) + ';');
  const labelAcc = esc(labels.accuracy);
  const labelFlu = esc(labels.fluency);
  const labelComp = esc(labels.completeness);

  // 3개 축 각도: 상단(-PI/2), 우하단(PI/6), 좌하단(5PI/6)
  const a1 = -Math.PI / 2;
  const a2 = Math.PI / 6;
  const a3 = (5 * Math.PI) / 6;

  // 가이드라인 삼각형 좌표 생성
  const triPoints = (r: number) => {
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const x3 = cx + r * Math.cos(a3);
    const y3 = cy + r * Math.sin(a3);
    return `${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)}`;
  };

  // 축 꼭짓점 둥근 사각형 앵커 마크
  const anchorSquare = (x: number, y: number) =>
    `<rect x="${(x - 5.5).toFixed(1)}" y="${(y - 5.5).toFixed(1)}" width="11" height="11" rx="3" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.6"/>`;

  // 실제 데이터 포인트 좌표
  const rAcc = Math.max(0.12, Math.min(1, accuracy / 100)) * R;
  const rFlu = Math.max(0.12, Math.min(1, fluency / 100)) * R;
  const rComp = Math.max(0.12, Math.min(1, completeness / 100)) * R;

  const dx1 = cx + rAcc * Math.cos(a1);
  const dy1 = cy + rAcc * Math.sin(a1);
  const dx2 = cx + rFlu * Math.cos(a2);
  const dy2 = cy + rFlu * Math.sin(a2);
  const dx3 = cx + rComp * Math.cos(a3);
  const dy3 = cy + rComp * Math.sin(a3);

  const dataPoints = `${dx1.toFixed(1)},${dy1.toFixed(1)} ${dx2.toFixed(1)},${dy2.toFixed(1)} ${dx3.toFixed(1)},${dy3.toFixed(1)}`;

  // 축 끝단 좌표
  const tip1X = cx + R * Math.cos(a1);
  const tip1Y = cy + R * Math.sin(a1);
  const tip2X = cx + R * Math.cos(a2);
  const tip2Y = cy + R * Math.sin(a2);
  const tip3X = cx + R * Math.cos(a3);
  const tip3Y = cy + R * Math.sin(a3);

  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
      `<defs>` +
      `<filter id="bigShadow" x="-20%" y="-20%" width="140%" height="140%">` +
      `<feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="${accentColor}" flood-opacity="0.28"/>` +
      `</filter>` +
      `</defs>` +
      // 가이드 배경 그리드 삼각형 (4단계: 25%, 50%, 75%, 100%)
      `<polygon points="${triPoints(R)}" fill="none" stroke="#E2E8F0" stroke-width="1.4"/>` +
      `<polygon points="${triPoints(R * 0.75)}" fill="none" stroke="#EDF2F7" stroke-width="1.1"/>` +
      `<polygon points="${triPoints(R * 0.5)}" fill="none" stroke="#F1F5F9" stroke-width="1.1"/>` +
      `<polygon points="${triPoints(R * 0.25)}" fill="none" stroke="#F8FAFC" stroke-width="1"/>` +
      // 중심에서 각 꼭짓점으로 이어지는 축 라인
      `<line x1="${cx}" y1="${cy}" x2="${tip1X.toFixed(1)}" y2="${tip1Y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1.4"/>` +
      `<line x1="${cx}" y1="${cy}" x2="${tip2X.toFixed(1)}" y2="${tip2Y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1.4"/>` +
      `<line x1="${cx}" y1="${cy}" x2="${tip3X.toFixed(1)}" y2="${tip3Y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1.4"/>` +
      // 축 꼭짓점 둥근 사각형 앵커 핀
      anchorSquare(tip1X, tip1Y) +
      anchorSquare(tip2X, tip2Y) +
      anchorSquare(tip3X, tip3Y) +
      // 데이터 다각형 영역 채우기 & 테두리
      `<polygon points="${dataPoints}" fill="${fillColor}" stroke="${accentColor}" stroke-width="3" stroke-linejoin="round" filter="url(#bigShadow)"/>` +
      // 데이터 꼭짓점 포인트 원
      `<circle cx="${dx1.toFixed(1)}" cy="${dy1.toFixed(1)}" r="5.5" fill="${accentColor}" stroke="#FFFFFF" stroke-width="2.2"/>` +
      `<circle cx="${dx2.toFixed(1)}" cy="${dy2.toFixed(1)}" r="5.5" fill="${accentColor}" stroke="#FFFFFF" stroke-width="2.2"/>` +
      `<circle cx="${dx3.toFixed(1)}" cy="${dy3.toFixed(1)}" r="5.5" fill="${accentColor}" stroke="#FFFFFF" stroke-width="2.2"/>` +
      // 상단: 정확도 라벨 및 대형 퍼센트 수치
      `<text x="${cx}" y="17" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#475569">${labelAcc}</text>` +
      `<text x="${cx}" y="35" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="15" font-weight="800" fill="${accentColor}">${accuracy}%</text>` +
      // 우하단: 유창성 라벨 및 대형 퍼센트 수치
      `<text x="${(cx + R + 22).toFixed(1)}" y="${(cy + R * 0.5 + 24).toFixed(1)}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#475569">${labelFlu}</text>` +
      `<text x="${(cx + R + 22).toFixed(1)}" y="${(cy + R * 0.5 + 43).toFixed(1)}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="15" font-weight="800" fill="${accentColor}">${fluency}%</text>` +
      // 좌하단: 완성도 라벨 및 대형 퍼센트 수치
      `<text x="${(cx - R - 22).toFixed(1)}" y="${(cy + R * 0.5 + 24).toFixed(1)}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#475569">${labelComp}</text>` +
      `<text x="${(cx - R - 22).toFixed(1)}" y="${(cy + R * 0.5 + 43).toFixed(1)}" text-anchor="middle" font-family="Pretendard, -apple-system, sans-serif" font-size="15" font-weight="800" fill="${accentColor}">${completeness}%</text>` +
      `</svg>`,
  );
}

export function ReportRadarChart({
  accuracy,
  fluency,
  completeness,
  labels,
  accentColor = '#FF5B29',
  fillColor = 'rgba(255, 91, 41, 0.22)',
}: RadarChartProps) {
  const uri = generateRadarSvg(accuracy, fluency, completeness, labels, accentColor, fillColor);

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.chartImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: '100%',
  },
  chartImage: {
    width: 330,
    height: 265,
  },
});
