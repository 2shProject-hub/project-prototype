import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';

export type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong';

export interface ChoiceChipProps {
  text: string;
  subText?: string;
  badge?: string | number;
  state?: ChoiceState;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'md' | 'lg';
}

export function ChoiceChip({
  text,
  subText,
  badge,
  state = 'default',
  selected = false,
  disabled = false,
  onPress,
  icon,
  style,
  textStyle,
  size = 'md',
}: ChoiceChipProps) {
  // selected prop이 true이고 state가 default이면 'selected'로 간주
  const effectiveState: ChoiceState =
    state === 'default' && selected ? 'selected' : state;

  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.container, styles[`size_${size}`]];

    if (effectiveState === 'selected') {
      base.push(styles.state_selected);
    } else if (effectiveState === 'correct') {
      base.push(styles.state_correct);
    } else if (effectiveState === 'wrong') {
      base.push(styles.state_wrong);
    } else {
      base.push(styles.state_default);
    }

    if (style) {
      base.push(style);
    }

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text, styles[`textSize_${size}`]];

    if (effectiveState === 'selected') {
      base.push(styles.text_selected);
    } else if (effectiveState === 'correct') {
      base.push(styles.text_correct);
    } else if (effectiveState === 'wrong') {
      base.push(styles.text_wrong);
    } else {
      base.push(styles.text_default);
    }

    if (textStyle) {
      base.push(textStyle);
    }

    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.contentRow}>
        {badge !== undefined && (
          <View
            style={[
              styles.badge,
              effectiveState === 'selected' && styles.badge_selected,
              effectiveState === 'correct' && styles.badge_correct,
              effectiveState === 'wrong' && styles.badge_wrong,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                effectiveState !== 'default' && styles.badgeText_active,
              ]}
            >
              {badge}
            </Text>
          </View>
        )}

        <View style={styles.textColumn}>
          <Text style={getTextStyle()}>{text}</Text>
          {subText ? <Text style={styles.subText}>{subText}</Text> : null}
        </View>

        {icon && <View style={styles.iconBox}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    ...shadow.soft,
  },
  size_md: {
    minHeight: 52,
    paddingVertical: spacing.md,
  },
  size_lg: {
    minHeight: 60,
    paddingVertical: spacing.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badge_selected: {
    backgroundColor: colors.teal,
  },
  badge_correct: {
    backgroundColor: colors.correct,
  },
  badge_wrong: {
    backgroundColor: colors.wrong,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  badgeText_active: {
    color: colors.surface,
  },
  textColumn: {
    flex: 1,
  },
  text: {
    fontWeight: '700',
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  subText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  iconBox: {
    marginLeft: spacing.sm,
  },

  // ── States ──
  state_default: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  state_selected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  state_correct: {
    borderColor: colors.correct,
    backgroundColor: colors.correctLight,
  },
  state_wrong: {
    borderColor: colors.wrong,
    backgroundColor: colors.wrongLight,
  },

  // ── Text States ──
  text_default: {
    color: colors.textPrimary,
  },
  text_selected: {
    color: colors.tealDark,
  },
  text_correct: {
    color: colors.correct,
  },
  text_wrong: {
    color: colors.wrong,
  },
});
