import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'correct' | 'wrong';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CtaButtonProps {
  title: string | ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  activeOpacity?: number;
}

export function CtaButton({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
  activeOpacity = 0.8,
}: CtaButtonProps) {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button, styles[`size_${size}`]];

    if (fullWidth) {
      base.push(styles.fullWidth);
    }

    if (disabled) {
      base.push(styles.disabled);
    } else {
      base.push(styles[`variant_${variant}`]);
    }

    if (style) {
      base.push(style);
    }

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text, styles[`textSize_${size}`]];

    if (disabled) {
      base.push(styles.textDisabled);
    } else {
      base.push(styles[`textVariant_${variant}`]);
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
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? colors.teal : colors.surface}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconBox}>{icon}</View>}
          {typeof title === 'string' ? (
            <Text style={getTextStyle()}>{title}</Text>
          ) : (
            title
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    marginRight: spacing.sm,
  },

  // ── Sizes ──
  size_sm: {
    height: 40,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    height: 48,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    height: 54,
    paddingHorizontal: spacing.xl,
  },

  // ── Variants ──
  variant_primary: {
    backgroundColor: colors.teal,
  },
  variant_secondary: {
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  variant_correct: {
    backgroundColor: colors.correct,
  },
  variant_wrong: {
    backgroundColor: colors.wrong,
  },
  disabled: {
    backgroundColor: colors.borderLight,
  },

  // ── Typography ──
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 16,
  },
  textVariant_primary: {
    color: colors.surface,
  },
  textVariant_secondary: {
    color: colors.textSecondary,
  },
  textVariant_outline: {
    color: colors.teal,
  },
  textVariant_correct: {
    color: colors.surface,
  },
  textVariant_wrong: {
    color: colors.surface,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
