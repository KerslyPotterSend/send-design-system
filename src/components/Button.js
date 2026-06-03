import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { brandTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const SIZE_DIMS = {
  L: {
    paddingHorizontal: spacing.mobile.L,    // 16
    paddingVertical: spacing.mobile.S,      // 8
    height: 44,                             // fixed height
    fontSize: '4',                          // 16/24 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 20,
    squareSize: 44,
  },
  M: {
    paddingHorizontal: spacing.mobile.M,    // 12
    paddingVertical: spacing.mobile.XS,     // 4
    height: 32,                             // fixed height
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 16,
    squareSize: 32,
  },
  S: {
    paddingHorizontal: spacing.mobile.S,    // 8
    paddingVertical: 0,
    height: 24,                             // fixed height
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.XS,   // 4
    iconSize: 14,
    squareSize: 24,
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'L',
  mode = 'light',
  rounded = false,
  iconOnly = false,
  hasIcon = false,
  icon = null,
  state = 'default',  // 'default' | 'hover' | 'pressed' | 'disabled'
  onPress,
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const interactive = state === 'default';
  const isDisabled = state === 'disabled';
  const isPressed = state === 'pressed' || (interactive && pressed);
  const isHover = state === 'hover' || (interactive && hover);

  const tokens = brandTokens[mode];
  let background = tokens.brandBackground;
  if (isDisabled) background = tokens.brandBackgroundDisabled;
  else if (isPressed) background = tokens.brandBackgroundPress;
  else if (isHover) background = tokens.brandBackgroundHover;

  let labelColor = tokens.brandColor;
  if (isDisabled) labelColor = tokens.brandColorDisabled;
  else if (isPressed) labelColor = tokens.brandColorPress;

  const dims = SIZE_DIMS[size];
  const radius = rounded ? cornerRadius.mobile.Pill : dims.cornerRadius;
  const iconName = icon ?? 'arrow-forward';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => {
        setHover(false);
        setPressed(false);
      }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        iconOnly
          ? {
              width: dims.squareSize,
              height: dims.squareSize,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }
          : {
              height: dims.height,
              paddingHorizontal: dims.paddingHorizontal,
              paddingVertical: dims.paddingVertical,
            },
        {
          backgroundColor: background,
          borderRadius: radius,
        },
        isWeb && !isDisabled && { cursor: 'pointer' },
        isWeb && isDisabled && { cursor: 'not-allowed' },
        isWeb && {
          transitionProperty: 'background-color, color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      {iconOnly ? (
        <Ionicons name={iconName} size={dims.iconSize} color={labelColor} />
      ) : (
        <>
          {hasIcon && <Ionicons name={iconName} size={dims.iconSize} color={labelColor} />}
          <Text style={[currentTextStyle(dims.fontSize, 'medium'), { color: labelColor }]}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
});
