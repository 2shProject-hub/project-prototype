import { Platform } from 'react-native';
import { EmulatorShell } from './src/emulator/EmulatorShell';
import { StatusBar } from 'expo-status-bar';

// 웹: 에뮬레이터 쉘 전체 레이아웃
// 네이티브: 추후 실제 앱 네비게이션으로 교체 예정
export default function App() {
  if (Platform.OS === 'web') {
    return <EmulatorShell />;
  }
  // 네이티브 환경에서는 에뮬레이터 없이 HomeScreen 직접 표시
  const { LangProvider } = require('./src/components/LangContext');
  const { HomeScreen } = require('./src/screens/HomeScreen');
  const { useState } = require('react');
  const { defaultSessionState } = require('./src/data/lessonData');
  const { View } = require('react-native');

  function NativeApp() {
    const [sessions] = useState({ 1: defaultSessionState() });
    return (
      <LangProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <HomeScreen sessions={sessions} setView={() => {}} onStartSession={() => {}} />
        </View>
      </LangProvider>
    );
  }
  return <NativeApp />;
}
