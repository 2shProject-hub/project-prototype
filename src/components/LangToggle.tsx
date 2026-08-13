import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLang, Lang } from './LangContext';
import { colors } from '../theme/colors';

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <View style={styles.container}>
      {(['ko', 'vi'] as Lang[]).map((l) => (
        <TouchableOpacity
          key={l}
          style={[styles.tab, lang === l && styles.tabActive]}
          onPress={() => setLang(l)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, lang === l && styles.labelActive]}>
            {l === 'ko' ? 'KR' : 'VT'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.canvas,
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: colors.teal,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  labelActive: {
    color: '#fff',
  },
});
