import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { themeAssets } from '../theme/themeAssets';

type NavView = 'home' | 'report' | 'ai-talk' | 'my-info';

interface BottomNavProps {
  active: string;
  setView: (v: NavView) => void;
}

export function BottomNav({ active, setView }: BottomNavProps) {
  // 브랜드 자산 테마(말해보카 등)는 이모지 대신 실제 내비 글리프를 쓴다
  const { theme, enabled: themeOn } = useTheme();
  const navIcons = themeOn ? themeAssets(theme.id)?.navIcons : undefined;
  const items: { key: NavView; label: string; icon: string }[] = [
    { key: 'home', label: '홈', icon: '🏠' },
    { key: 'report', label: '리포트', icon: '📊' },
    { key: 'ai-talk', label: 'ai대화', icon: '🤖' },
    { key: 'my-info', label: '내 정보', icon: '👤' },
  ];

  return (
    <View style={styles.nav}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => setView(item.key)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, active === item.key && styles.iconWrapActive]}>
            {navIcons?.[item.key] ? (
              <Image
                source={active === item.key ? navIcons[item.key].on : navIcons[item.key].off}
                style={{ width: 24, height: 21 }}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.icon}>{item.icon}</Text>
            )}
          </View>
          <Text style={[styles.label, active === item.key && styles.labelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingTop: 5,
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: '#ddfbfa',
  },
  icon: { fontSize: 18 },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.muted,
    marginTop: 3,
  },
  labelActive: {
    color: colors.teal,
    fontWeight: '700',
  },
});
