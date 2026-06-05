import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { brandTokens, content, layerTokens } from '../theme/colors';
import { border, buttonSize, cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const SIZE_DIMS = {
  L: {
    paddingHorizontal: spacing.mobile.XL,   // 24
    height: buttonSize.mobile.L,            // 44
    fontSize: '4',                          // 16/24 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 20,
    squareSize: buttonSize.mobile.L,        // 44
  },
  M: {
    paddingHorizontal: spacing.mobile.L,    // 16
    height: buttonSize.mobile.M,            // 32
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 16,
    squareSize: buttonSize.mobile.M,        // 32
  },
  S: {
    paddingHorizontal: spacing.mobile.M,    // 12
    height: buttonSize.mobile.S,            // 24
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.XS,   // 4
    iconSize: 14,
    squareSize: buttonSize.mobile.S,        // 24
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

  const isSecondary = variant === 'secondary';
  const isTertiary = variant === 'tertiary';

  let background;
  let labelColor;
  let borderColor;

  if (isTertiary) {
    const text = content[mode];
    background = 'transparent';
    labelColor = text.contentPrimary;
    borderColor = 'transparent';
    if (isDisabled) {
      labelColor = text.contentTertiary;
    } else if (isPressed) {
      labelColor = text.contentSecondary;
    } else if (isHover) {
      borderColor = layerTokens[mode].layer2BorderColor;
    }
  } else if (isSecondary) {
    const layer = layerTokens[mode];
    const text = content[mode];
    labelColor = text.contentPrimary;
    background = layer.layer3Background;
    borderColor = layer.layer3BorderColor;
    if (isDisabled) {
      background = layer.layer3BackgroundDisabled;
      borderColor = layer.layer3BorderColorDisabled;
      labelColor = text.contentTertiary;
    } else if (isPressed) {
      background = layer.layer3BackgroundPress;
      borderColor = layer.layer3BorderColorPress;
      labelColor = text.contentSecondary;
    } else if (isHover) {
      background = layer.layer3BackgroundHover;
      borderColor = layer.layer3BorderColorHover;
    }
  } else {
    const tokens = brandTokens[mode];
    background = tokens.brandBackground;
    labelColor = tokens.brandColor;
    if (isDisabled) {
      background = tokens.brandBackgroundDisabled;
      labelColor = tokens.brandColorDisabled;
    } else if (isPressed) {
      background = tokens.brandBackgroundPress;
      labelColor = tokens.brandColorPress;
    } else if (isHover) {
      background = tokens.brandBackgroundHover;
    }
  }

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
            },
        {
          backgroundColor: background,
          borderRadius: radius,
        },
        borderColor && {
          borderWidth: border.mobile[1],
          borderColor,
        },
        isWeb && !isDisabled && { cursor: 'pointer' },
        isWeb && isDisabled && { cursor: 'not-allowed' },
        isWeb && {
          transitionProperty: 'background-color, border-color, color',
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
