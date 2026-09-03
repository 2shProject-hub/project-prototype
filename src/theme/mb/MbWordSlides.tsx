// MB 단어 슬라이드(2-W) — 말해보카 테마 전용 신규 화면.
//
// 실물 학습 화면 문법: 하늘 그라디언트 지면 + 플로팅 흰 카드 + 트로피 진행 알약.
// 슬라이드 콘텐츠는 전부 코드로 그리고, 학습 콘텐츠 사진(국기·인물)만 실사.
// 캐릭터(금붕어)는 문구와 역할이 맞는 자리에만 배치한다. 튜터 아바타는 원본 그대로.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_WORD_SLIDES, type WordSlide } from '../../data/lessonData';
import { icon } from '../graphics';
import { mb, mbFont, mbDisplay, mbBody } from './mbTokens';
import { MbCanvas, MbHeader, MbCard, MbNavBar } from './MbScaffold';
import { TypewriterText } from '../../components/TypewriterText';
import { BlinkSprite } from '../BlinkSprite';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png') as string;
const IMG_FLAG = require('../../../assets/word-slides/vietnam-flag.png');
const IMG_PERSON = require('../../../assets/word-slides/vietnam-person.png');
const IMG_KOREA = require('../../../assets/SetWordbookEvalStage/2_korea.png');
const IMG_SARAM = require('../../../assets/SetWordbookEvalStage/preson.png');
const CHAR_FISH = require('../../../assets/themes/malhaeboka/sticker-goldfish.png');
const CHAR_FISH_BLINK = require('../../../assets/themes/malhaeboka/blink-sticker-goldfish.png');

// 2.6초 주기로 130ms 눈을 감는다
function useBlink(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let open: ReturnType<typeof setTimeout> | null = null;
    const iv = setInterval(() => { setOn(true); open = setTimeout(() => setOn(false), 130); }, 2600);
    return () => { clearInterval(iv); if (open) clearTimeout(open); };
  }, []);
  return on;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  slides?: WordSlide[];
  flowStep?: number;
  flowTotal?: number;
}

export function MbWordSlides({ onNext, onBack, slides, flowStep, flowTotal }: Props) {
  const { lang } = useLang();
  const data = slides ?? MOCK_WORD_SLIDES;

  const [index, setIndex] = useState(0);
  const [visitedLast, setVisitedLast] = useState(data.length === 1);
  const [needsTap, setNeedsTap] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slideIn = useRef(new Animated.Value(0)).current;

  const slide = data[index];
  const isLast = index === data.length - 1;
  const total = data.length;

  useEffect(() => {
    setNeedsTap(false);
    slideIn.setValue(0);
    Animated.timing(slideIn, { toValue: 1, duration: 260, useNativeDriver: false }).start();
    if (Platform.OS !== 'web' || !slide.audio) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(slide.audio);
    audioRef.current = audio;
    audio.play().catch(() => setNeedsTap(true));
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [index]);

  useEffect(() => {
    if (isLast) setVisitedLast(true);
  }, [isLast]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  const replayAudio = () => {
    if (Platform.OS !== 'web' || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setNeedsTap(false);
  };

  return (
    <MbCanvas>
      {/* 플로우에서는 43스텝 진행, 단독 실행에서는 슬라이드 진행 */}
      <MbHeader current={flowStep ?? index + 1} total={flowTotal ?? total} onClose={onBack} />

      <Animated.View
        style={{
          flex: 1,
          paddingHorizontal: 14,
          paddingTop: 6,
          opacity: slideIn,
          transform: [{ translateY: slideIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        }}
      >
        <MbCard style={{ flex: 1 }}>
          {index === 0 && <IntroBody />}
          {index === 1 && <QuizBody a="베트남" aImg={IMG_FLAG} answer="베트남 사람" ansImg={IMG_PERSON} />}
          {index === 2 && <QuizBody a="한국" aImg={IMG_KOREA} aFit="contain" answer="한국 사람" ansImg={IMG_SARAM} />}
          {index === 3 && <OutroBody />}
        </MbCard>
      </Animated.View>

      {/* 튜터 + 말풍선 (아바타 원본 유지) */}
      {slide.showTutor && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingTop: 8, gap: 8 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: mb.white,
              borderRadius: 18,
              borderBottomRightRadius: 5,
              borderWidth: 1.5,
              borderColor: '#E9E2FB',
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              shadowColor: '#3E6D96', shadowOpacity: 0.16, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
            }}
          >
            <TypewriterText
              text={pick(lang, slide.bubble.ko, slide.bubble.vi)}
              style={[mbBody(15, '600'), { flex: 1, color: mb.ink, lineHeight: 23 }]}
              numberOfLines={4}
            />
            <TouchableOpacity
              onPress={replayAudio}
              activeOpacity={0.7}
              style={{
                width: 42, height: 42, borderRadius: 21,
                backgroundColor: mb.lavender,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Image source={{ uri: icon('volume', mb.violet, 21, 2) }} style={{ width: 21, height: 21 }} />
            </TouchableOpacity>
          </View>
          <Image source={TUTOR_IMAGE as any} style={{ width: 88, height: 108 }} resizeMode="contain" />
        </View>
      )}

      <MbNavBar
        index={index}
        total={total}
        onPrev={() => { if (index > 0) { stopAudio(); setIndex(i => i - 1); } }}
        onSkip={() => { if (!isLast) { stopAudio(); setIndex(i => i + 1); } }}
        onNext={onNext}
        nextEnabled={visitedLast}
      />
    </MbCanvas>
  );
}

// ── 슬라이드 본문 ────────────────────────────────────────────────

function PhotoCard({ img, ko, vi, fit }: { img: any; ko: string; vi: string; fit?: 'cover' | 'contain' }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: mb.white,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#EAF2FA',
        padding: 10,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#3E6D96', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
      }}
    >
      <Image source={img} style={{ width: '100%', height: 164, borderRadius: 14 }} resizeMode={fit ?? 'cover'} />
      <View style={{ alignItems: 'center', gap: 1, paddingBottom: 2 }}>
        <Text style={mbDisplay(19, '800')}>{ko}</Text>
        <Text style={mbBody(12, '600')}>{vi}</Text>
      </View>
    </View>
  );
}

function IntroBody() {
  const fishBlink = useBlink();
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -3, duration: 750, useNativeDriver: false }),
        Animated.timing(bob, { toValue: 0, duration: 750, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);
  return (
    <View style={{ flex: 1, gap: 14 }}>
      {/* 캐릭터가 오늘의 단어를 소개 — 문구와 배치를 맞춘다 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Animated.View style={{ transform: [{ translateY: bob }] }}>
          <BlinkSprite img={CHAR_FISH} blink={CHAR_FISH_BLINK} on={fishBlink} w={34} h={36} />
        </Animated.View>
        <View style={{ backgroundColor: mb.lavender, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ fontFamily: mbFont, fontSize: 12.5, fontWeight: '800', color: mb.violetDark }}>오늘의 단어</Text>
        </View>
      </View>
      <View style={{ alignItems: 'center', gap: 3 }}>
        <Text style={mbDisplay(30)}>나라와 국적</Text>
        <Text style={mbBody(13.5, '600')}>Quốc gia và quốc tịch</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
        <PhotoCard img={IMG_FLAG} ko="베트남" vi="Việt Nam" />
        <PhotoCard img={IMG_PERSON} ko="베트남 사람" vi="người Việt Nam" fit="contain" />
      </View>
      {/* 핵심 규칙 — 빈 공간 없이 화면을 채우는 안내 스트립 */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          backgroundColor: '#F3FAF5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
        }}
      >
        <Image source={{ uri: icon('sparkle', mb.green, 16, 2) }} style={{ width: 16, height: 16 }} />
        <Text style={[mbBody(12.5, '600'), { flex: 1, color: '#1E7A44' }]}>
          나라 이름 + <Text style={{ fontWeight: '800' }}>사람</Text> = 국적이 돼요
        </Text>
      </View>
    </View>
  );
}

function QuizBody({ a, aImg, answer, ansImg, aFit }: { a: string; aImg: any; answer: string; ansImg: any; aFit?: 'cover' | 'contain' }) {
  return (
    <View style={{ flex: 1, gap: 12 }}>
      <View style={{ alignSelf: 'flex-start', backgroundColor: '#FFE8F1', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 }}>
        <Text style={{ fontFamily: mbFont, fontSize: 11, fontWeight: '800', color: '#E0447C' }}>Quiz</Text>
      </View>
      <Text style={mbDisplay(24, '800')}>단어를 합쳐 볼까요?</Text>
      {/* 하단이 비지 않게 — 남는 높이를 문제·정답이 나눠 가진다 */}
      <View style={{ flex: 1, justifyContent: 'center', gap: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, alignItems: 'center', gap: 7 }}>
            <Image
              source={aImg}
              style={{ width: '100%', height: 148, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: aFit === 'contain' ? 1.5 : 0, borderColor: '#EEE9F8' }}
              resizeMode={aFit ?? 'cover'}
            />
            <Text style={mbDisplay(17, '800')}>{a}</Text>
          </View>
          <Text style={[mbDisplay(28, '900'), { color: mb.violet }]}>+</Text>
          <View style={{ flex: 1, height: 148, borderRadius: 14, backgroundColor: mb.lavender, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[mbDisplay(20, '800'), { color: mb.violetDark }]}>사람</Text>
          </View>
        </View>
        {/* 정답 — 실물의 정답 칩처럼 바이올렛 필 */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            backgroundColor: mb.violet, borderRadius: 16, padding: 16,
            shadowColor: mb.violet, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Image source={ansImg} style={{ width: 72, height: 72, borderRadius: 14 }} resizeMode="cover" />
          <Text style={[mbDisplay(23, '900'), { color: mb.white, flex: 1 }]}>{answer}</Text>
          <Image source={{ uri: icon('check', '#FFFFFF', 22, 2.6) }} style={{ width: 22, height: 22 }} />
        </View>
      </View>
    </View>
  );
}

function OutroBody() {
  const fishBlink2 = useBlink();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {/* 캐릭터가 축하 — 문구와 짝 */}
      <BlinkSprite img={CHAR_FISH} blink={CHAR_FISH_BLINK} on={fishBlink2} w={88} h={92} />
      <Text style={mbDisplay(28)}>훌륭해요!</Text>
      <Text style={[mbBody(14, '600'), { textAlign: 'center' }]}>이제 더 많은 단어를 배워봐요.</Text>
    </View>
  );
}
