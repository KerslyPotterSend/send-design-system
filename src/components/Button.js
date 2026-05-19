import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { brandTokens } from '../theme/colors';
import { proposedTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const SIZE_DIMS = {
  L: { height: 44, paddingHorizontal: 16, paddingVertical: 8, cornerRadius: 8 },
  M: { height: 32, paddingHorizontal: 8, paddingVertical: 4, cornerRadius: 8 },
  S: { height: 24, paddingHorizontal: 4, paddingVertical: 0, cornerRadius: 4 },
};

const SIZE_TYPOGRAPHY = {
  L: () => proposedTextStyle('body-large', 'medium'),
  M: () => proposedTextStyle('body-small', 'medium'),
  S: () => proposedTextStyle('label-medium', 'medium'),
};

export default function Button({
  children,
  variant = 'primary',
  size = 'L',
  mode = 'light',
  rounded = false,
  iconOnly = false,
  disabled = false,
  onPress,
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const tokens = brandTokens[mode];

  let background = tokens.brandBackground;
  if (disabled) background = tokens.brandBackgroundDisabled;
  else if (pressed) background = tokens.brandBackgroundPress;
  else if (hover) background = tokens.brandBackgroundHover;

  let labelColor = tokens.brandColor;
  if (disabled) labelColor = tokens.brandColorDisabled;
  else if (pressed) labelColor = tokens.brandColorPress;

  const dims = SIZE_DIMS[size];
  const borderRadius = rounded ? dims.height / 2 : dims.cornerRadius;

  const containerStyle = [
    styles.base,
    dims,
    {
      backgroundColor: background,
      borderRadius,
      opacity: disabled ? 1 : 1,
    },
    iconOnly && { width: dims.height, paddingHorizontal: 0 },
    isWeb && !disabled && { cursor: 'pointer' },
    isWeb && disabled && { cursor: 'not-allowed' },
    isWeb && {
      transitionProperty: 'background-color, color',
      transitionDuration: '160ms',
      transitionTimingFunction: 'ease-out',
    },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => {
        setHover(false);
        setPressed(false);
      }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={containerStyle}
    >
      <Text style={[SIZE_TYPOGRAPHY[size](), { color: labelColor }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
