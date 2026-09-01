import { ThemedGlyph } from './ThemedGlyph';
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';

export interface AudioPlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AudioPlayButton({
  isPlaying,
  onPress,
  size = 'md',
  label,
  disabled = false,
  style,
}: AudioPlayButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;

    if (isPlaying) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
      anim.start();
    } else {
      scaleAnim.setValue(1);
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [isPlaying, scaleAnim]);

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.btn_sm;
      case 'lg':
        return styles.btn_lg;
      case 'md':
      default:
        return styles.btn_md;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 18;
      case 'lg':
        return 32;
      case 'md':
      default:
        return 24;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            getSizeStyle(),
            isPlaying && styles.buttonPlaying,
            disabled && styles.buttonDisabled,
          ]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <ThemedGlyph
            style={[
              styles.icon,
              { fontSize: getIconSize() },
              isPlaying && styles.iconPlaying,
            ]}
            glyph={isPlaying ? '⏸' : '🔊'}
          />
        </TouchableOpacity>
      </Animated.View>

      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  buttonPlaying: {
    backgroundColor: colors.teal,
    borderColor: colors.tealDark,
  },
  buttonDisabled: {
    backgroundColor: colors.bgDisabled,
    borderColor: colors.border,
  },
  btn_sm: {
    width: 44,
    height: 44,
  },
  btn_md: {
    width: 64,
    height: 64,
  },
  btn_lg: {
    width: 80,
    height: 80,
  },
  icon: {
    color: colors.teal,
  },
  iconPlaying: {
    color: colors.surface,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
