// MB 설명 슬라이드(문법: -이에요/-예요) — 말해보카 테마 전용 신규 화면.
//
// 원본은 구운 PNG 9장이라 목업 크기에서 글자가 보이지 않는다.
// 여기서는 9장의 교수 설계를 코드(뷰)로 다시 그린다 — 큰 타이포, 받침 하이라이트,
// 등식 카드, 말풍선 장면, 정리표. 전부 벡터/CSS, 시원한 화면 채움.
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { icon, svgDataUri } from '../graphics';
import { mb, mbFont, mbDisplay, mbBody } from './mbTokens';
import { MbCanvas, MbHeader, MbCard, MbNavBar } from './MbScaffold';
import { useFlowProgress } from './FlowContext';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const TOTAL = 9;

export function MbSlideExplain({ onNext, onBack }: Props) {
  const flow = useFlowProgress();
  const [index, setIndex] = useState(0);
  const [visitedLast, setVisitedLast] = useState(false);
  const slideIn = useRef(new Animated.Value(0)).current;
  const isLast = index === TOTAL - 1;

  useEffect(() => {
    slideIn.setValue(0);
    Animated.timing(slideIn, { toValue: 1, duration: 240, useNativeDriver: false }).start();
    if (isLast) setVisitedLast(true);
  }, [index]);

  const BODIES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9];
  const Body = BODIES[index];

  return (
    <MbCanvas>
      <MbHeader current={flow?.step ?? index + 1} total={flow?.total ?? TOTAL} onClose={onBack} />
      <Animated.View
        style={{
          flex: 1,
          paddingHorizontal: 14,
          paddingTop: 6,
          opacity: slideIn,
          transform: [{ translateY: slideIn.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}
      >
        <MbCard style={{ flex: 1 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: mb.lavender, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 }}>
            <Text style={{ fontFamily: mbFont, fontSize: 11.5, fontWeight: '800', color: mb.violetDark }}>문법과 표현 1</Text>
          </View>
          <Body />
        </MbCard>
      </Animated.View>
      <MbNavBar
        index={index}
        total={TOTAL}
        onPrev={() => index > 0 && setIndex(i => i - 1)}
        onSkip={() => !isLast && setIndex(i => i + 1)}
        onNext={onNext}
        nextEnabled={visitedLast}
      />
    </MbCanvas>
  );
}

// ── 조각들 ───────────────────────────────────────────────────────

/** 음절 카드 — 받침을 빨간 밑줄로 강조 */
function Syllable({ ch, batchim, size = 56 }: { ch: string; batchim?: boolean; size?: number }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View
        style={{
          width: size, height: size, borderRadius: 14,
          backgroundColor: mb.white, borderWidth: 1.5, borderColor: mb.lavenderLine,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#3E6D96', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text style={mbDisplay(Math.round(size * 0.5), '800')}>{ch}</Text>
      </View>
      <View style={{ width: size * 0.55, height: 5, borderRadius: 3, backgroundColor: batchim ? '#FF5A76' : 'transparent' }} />
    </View>
  );
}

function NameCard({ name, chs, batchims, tone }: { name: string; chs: string[]; batchims: boolean[]; tone?: 'ok' | 'no' }) {
  return (
    <View
      style={{
        flex: 1, alignItems: 'center', gap: 10, paddingVertical: 16, borderRadius: 16,
        backgroundColor: tone === 'ok' ? '#F1FBF4' : tone === 'no' ? '#FFF5F0' : mb.white,
        borderWidth: 1.5, borderColor: tone === 'ok' ? '#BFE8CC' : tone === 'no' ? '#FFD9C8' : mb.lavenderLine,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {chs.map((c, i) => <Syllable key={i} ch={c} batchim={batchims[i]} size={52} />)}
      </View>
      <Text style={mbBody(13, '700')}>{name}</Text>
    </View>
  );
}

function Callout({ children, tone = 'violet' }: { children: React.ReactNode; tone?: 'violet' | 'green' }) {
  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 9,
        backgroundColor: tone === 'green' ? '#F1FBF4' : mb.lavender,
        borderRadius: 13, paddingHorizontal: 13, paddingVertical: 11,
      }}
    >
      <Image source={{ uri: icon('sparkle', tone === 'green' ? '#1E9E55' : mb.violet, 16, 2) }} style={{ width: 16, height: 16 }} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function EqChip({ label, filled }: { label: string; filled?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 16, paddingVertical: 12, borderRadius: 13,
        backgroundColor: filled ? mb.violet : mb.white,
        borderWidth: filled ? 0 : 1.5, borderColor: mb.lavenderLine,
        shadowColor: filled ? mb.violet : '#3E6D96', shadowOpacity: filled ? 0.3 : 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
      }}
    >
      <Text style={[mbDisplay(19, '800'), filled && { color: mb.white }]}>{label}</Text>
    </View>
  );
}

function BubbleScene({ line, sub }: { line: string; sub: string }) {
  return (
    <View style={{ gap: 14, alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: mb.lavender, borderRadius: 18, borderBottomLeftRadius: 5,
          paddingHorizontal: 18, paddingVertical: 15, maxWidth: '92%',
        }}
      >
        <Text style={[mbDisplay(20, '800'), { color: mb.violetDeep, lineHeight: 30 }]}>{line}</Text>
      </View>
      <Text style={[mbBody(13, '600'), { textAlign: 'center' }]}>{sub}</Text>
    </View>
  );
}

const Title = ({ t }: { t: string }) => <Text style={[mbDisplay(25, '800'), { marginBottom: 12 }]}>{t}</Text>;

// ── 9장 ─────────────────────────────────────────────────────────

function Slide1() {
  return (
    <View style={{ flex: 1, gap: 13 }}>
      <Text style={[mbDisplay(30), { textAlign: 'center', marginTop: 4 }]}>-이에요 / -예요</Text>
      <View style={{ gap: 9, marginTop: 4 }}>
        <Row k="뜻" v={"'~이다'라는 뜻이에요. 영어의 am / is / are 와 비슷해요."} />
        <Row k="언제" v="이름, 사람, 물건 등을 말할 때 사용해요." />
      </View>
      <View style={{ flex: 1 }} />
      <Callout>
        <Text style={[mbBody(13.5, '700'), { color: mb.violetDeep }]}>
          받침이 있으면 <Text style={{ color: mb.violet }}>-이에요</Text> · 받침이 없으면 <Text style={{ color: mb.violet }}>-예요</Text>
        </Text>
      </Callout>
    </View>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <View style={{ backgroundColor: '#F6F5FA', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, minWidth: 44, alignItems: 'center' }}>
        <Text style={{ fontFamily: mbFont, fontSize: 12, fontWeight: '800', color: mb.sub }}>{k}</Text>
      </View>
      <Text style={[mbBody(14, '600'), { flex: 1, color: mb.ink }]}>{v}</Text>
    </View>
  );
}

function Slide2() {
  return (
    <View style={{ flex: 1, gap: 14 }}>
      <Title t="받침이 뭐예요?" />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14 }}>
        <Syllable ch="유" />
        <Syllable ch="진" batchim />
        <Syllable ch="타" />
        <Syllable ch="오" />
      </View>
      <View style={{ flex: 1 }} />
      <Callout>
        <Text style={[mbBody(13.5, '600'), { color: mb.violetDeep }]}>
          글자 밑 <Text style={{ color: '#FF5A76', fontWeight: '800' }}>빨간 표시</Text>가 받침이에요. 있는 글자도, 없는 글자도 있어요.
        </Text>
      </Callout>
    </View>
  );
}

function Slide3() {
  return (
    <View style={{ flex: 1, gap: 14 }}>
      <Title t="받침이 있는 이름은?" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <NameCard name="유진" chs={['유', '진']} batchims={[false, true]} />
        <NameCard name="타오" chs={['타', '오']} batchims={[false, false]} />
      </View>
      <View style={{ flex: 1 }} />
      <Callout><Text style={[mbBody(13.5, '600'), { color: mb.violetDeep }]}>두 이름을 잘 살펴보세요!</Text></Callout>
    </View>
  );
}

function Slide4() {
  return (
    <View style={{ flex: 1, gap: 14 }}>
      <Title t="정답을 볼까요?" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <NameCard name="받침 있어요" chs={['유', '진']} batchims={[false, true]} tone="ok" />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <NameCard name="받침 없어요" chs={['타', '오']} batchims={[false, false]} tone="no" />
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <Callout tone="green">
        <Text style={[mbBody(13.5, '700'), { color: '#1E7A44' }]}>"유진"은 받침이 있고, "타오"는 받침이 없어요.</Text>
      </Callout>
    </View>
  );
}

function Slide5() {
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Title t="받침이 있으면 -이에요" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, flexWrap: 'wrap' }}>
        <EqChip label="유진" />
        <Text style={[mbDisplay(22, '900'), { color: mb.violet }]}>+</Text>
        <EqChip label="-이에요" />
        <Text style={[mbDisplay(22, '900'), { color: mb.violet }]}>=</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <EqChip label="유진이에요" filled />
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

function Slide6() {
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Title t="문장으로 써볼까요?" />
      <BubbleScene line={'안녕하세요?\n저는 유진이에요.'} sub="받침이 있어서 -이에요를 썼어요" />
      <View style={{ flex: 1 }} />
    </View>
  );
}

function Slide7() {
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Title t="받침이 없으면 -예요" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, flexWrap: 'wrap' }}>
        <EqChip label="타오" />
        <Text style={[mbDisplay(22, '900'), { color: mb.violet }]}>+</Text>
        <EqChip label="-예요" />
        <Text style={[mbDisplay(22, '900'), { color: mb.violet }]}>=</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <EqChip label="타오예요" filled />
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

function Slide8() {
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Title t="문장으로 써볼까요?" />
      <BubbleScene line={'반가워요.\n저는 타오예요.'} sub="받침이 없어서 -예요를 썼어요" />
      <View style={{ flex: 1 }} />
    </View>
  );
}

function Slide9() {
  return (
    <View style={{ flex: 1, gap: 14 }}>
      <Title t="정리해요!" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SummaryCol head="받침 있으면" chip="-이에요" example="유진이에요" />
        <SummaryCol head="받침 없으면" chip="-예요" example="타오예요" />
      </View>
      <View style={{ flex: 1 }} />
      <Callout tone="green">
        <Text style={[mbBody(13.5, '700'), { color: '#1E7A44' }]}>이제 이름과 국적을 말할 수 있어요!</Text>
      </Callout>
    </View>
  );
}

function SummaryCol({ head, chip, example }: { head: string; chip: string; example: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 9, paddingVertical: 16, borderRadius: 16, backgroundColor: '#F6F5FA' }}>
      <Text style={mbBody(12.5, '700')}>{head}</Text>
      <View style={{ backgroundColor: mb.violet, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 7 }}>
        <Text style={[mbDisplay(17, '800'), { color: mb.white }]}>{chip}</Text>
      </View>
      <Text style={[mbBody(13, '600'), { color: mb.ink }]}>{example}</Text>
    </View>
  );
}
